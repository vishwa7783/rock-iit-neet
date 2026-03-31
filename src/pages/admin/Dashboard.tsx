import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  BookOpen,
  CreditCard,
  FileBarChart,
  LayoutDashboard,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  UserCog,
  Users,
  MessageSquare,
  ArrowUpDown,
  Eye,
} from "lucide-react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  courseService,
  getSession,
  resolveApiError,
  scheduleService,
  studentService,
  teacherService,
  enquiryService,
  type Enquiry,
  type AdminStats,
  type ClassSchedule,
  type ClassSchedulePayload,
  type Course,
  type CoursePayload,
  type FeesStatus,
  type Student,
  type StudentPayload,
  type Teacher,
  type TeacherPayload,
} from "@/services/api";
import { toast } from "sonner";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Students", href: "/admin/students", icon: Users },
  { label: "Teachers", href: "/admin/teachers", icon: UserCog },
  { label: "Courses", href: "/admin/courses", icon: BookOpen },
  { label: "Schedule", href: "/admin/schedule", icon: FileBarChart },
  { label: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
];

const emptyStudentForm: StudentPayload = {
  name: "",
  email: "",
  phone: "",
  courseId: 0,
  batchId: 0,
  attendancePercentage: 0,
};

const emptyTeacherForm: TeacherPayload = {
  name: "",
  phone: "",
  email: "",
};

const emptyCourseForm: CoursePayload = {
  title: "",
  subtitle: "",
  description: "",
  targetClasses: "",
};

const emptyScheduleForm: ClassSchedulePayload = {
  subject: "",
  topic: "",
  date: "",
  time: "",
  teacherId: "",
  batchId: 0,
  room: "",
};



const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const matches = (value: string, query: string) => value.toLowerCase().includes(query.toLowerCase());

const AdminDashboard = () => {
  const session = getSession();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats>({
    totalStudents: 0,
    totalTeachers: 0,
    activeCourses: 0,
    revenue: "0",
  });
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);

  const [studentSearch, setStudentSearch] = useState("");
  const [teacherSearch, setTeacherSearch] = useState("");
  const [courseSearch, setCourseSearch] = useState("");

  const [scheduleSearch, setScheduleSearch] = useState("");
  const [enquirySearch, setEnquirySearch] = useState("");
  const [enquirySortField, setEnquirySortField] = useState<"name" | "status" | "date">("date");
  const [enquirySortDir, setEnquirySortDir] = useState<"asc" | "desc">("desc");

  const [enquiryTab, setEnquiryTab] = useState<"active" | "resolved_inactive">("active");
  const [enquiryReasonForm, setEnquiryReasonForm] = useState("");

  const [enquiryDialogOpen, setEnquiryDialogOpen] = useState(false);
  const [enquiryDetailsDialogOpen, setEnquiryDetailsDialogOpen] = useState(false);
  const [selectedDetailEnquiry, setSelectedDetailEnquiry] = useState<Enquiry | null>(null);
  const [editingEnquiryId, setEditingEnquiryId] = useState<string | null>(null);
  const [enquiryStatusForm, setEnquiryStatusForm] = useState<string>("active");

  const [studentDialogOpen, setStudentDialogOpen] = useState(false);
  const [teacherDialogOpen, setTeacherDialogOpen] = useState(false);
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);

  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);
  const [editingScheduleId, setEditingScheduleId] = useState<number | null>(null);

  const [studentForm, setStudentForm] = useState<StudentPayload>(emptyStudentForm);
  const [teacherForm, setTeacherForm] = useState<TeacherPayload>(emptyTeacherForm);
  const [courseForm, setCourseForm] = useState<CoursePayload>(emptyCourseForm);
  const [scheduleForm, setScheduleForm] = useState<ClassSchedulePayload>(emptyScheduleForm);

  const activeSection = location.pathname.split("/")[2] || "dashboard";
  const normalizedSection = activeSection === "reports" ? "schedule" : activeSection;

  const pageTitle =
    normalizedSection === "students"
      ? "Students"
      : normalizedSection === "teachers"
        ? "Teachers"
        : normalizedSection === "courses"
          ? "Courses"
          : normalizedSection === "schedule"
            ? "Schedule"
            : normalizedSection === "enquiries"
              ? "Enquiries"
              : "Admin Dashboard";

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [studentsData, teachersData, coursesData, schedulesData, statsData, enquiriesData] = await Promise.all([
        studentService.getAll(),
        teacherService.getAll(),
        courseService.getAll(),
        scheduleService.getAll(),
        studentService.getAdminStats(),
        enquiryService.getEnquiries(enquiryTab === "active" ? ["Active"] : ["inactive", "resolved"]),
      ]);

      setStudents(studentsData);
      setTeachers(teachersData);
      setCourses(coursesData);
      setSchedules(schedulesData);
      setEnquiries(enquiriesData);
      setStats({
        ...statsData,
        totalTeachers: statsData.totalTeachers || teachersData.length,
      });
    } catch (error) {
      toast.error(resolveApiError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    enquiryService.getEnquiries(enquiryTab === "active" ? ["Active"] : ["inactive", "resolved"]).then(setEnquiries);
  }, [enquiryTab]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const filteredStudents = useMemo(() => {
    if (!studentSearch.trim()) return students;
    return students.filter(
      (student) =>
        matches(student.name, studentSearch) ||
        matches(student.email, studentSearch) ||
        matches(String(student.courseId), studentSearch) ||
        matches(String(student.batchId), studentSearch),
    );
  }, [studentSearch, students]);

  const filteredTeachers = useMemo(() => {
    if (!teacherSearch.trim()) return teachers;
    return teachers.filter(
      (teacher) =>
        matches(teacher.name, teacherSearch) ||
        matches(teacher.email, teacherSearch) ||
        matches(teacher.phone, teacherSearch),
    );
  }, [teacherSearch, teachers]);

  const filteredCourses = useMemo(() => {
    if (!courseSearch.trim()) return courses;
    return courses.filter(
      (course) =>
        matches(course.title, courseSearch) ||
        matches(course.subtitle, courseSearch) ||
        matches(course.targetClasses, courseSearch),
    );
  }, [courseSearch, courses]);



  const filteredSchedules = useMemo(() => {
    if (!scheduleSearch.trim()) return schedules;
    return schedules.filter(
      (schedule) =>
        matches(schedule.subject, scheduleSearch) ||
        matches(schedule.topic, scheduleSearch) ||
        matches(schedule.teacherName, scheduleSearch) ||
        matches(String(schedule.batchId), scheduleSearch) ||
        matches(schedule.room, scheduleSearch),
    );
  }, [scheduleSearch, schedules]);

  const filteredEnquiries = useMemo(() => {
    let result = enquiries;
    if (enquirySearch.trim()) {
      result = result.filter(
        (e) => matches(e.name, enquirySearch) || matches(e.email, enquirySearch) || matches(e.phone, enquirySearch)
      );
    }
    return [...result].sort((a, b) => {
      let cmp = 0;
      if (enquirySortField === "name") {
        cmp = a.name.localeCompare(b.name);
      } else if (enquirySortField === "status") {
        cmp = (a.status || "").localeCompare(b.status || "");
      } else if (enquirySortField === "date") {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        cmp = dateA - dateB;
      }
      return enquirySortDir === "asc" ? cmp : -cmp;
    });
  }, [enquirySearch, enquirySortField, enquirySortDir, enquiries]);

  const toggleEnquirySort = (field: "name" | "status" | "date") => {
    if (enquirySortField === field) {
      setEnquirySortDir(enquirySortDir === "asc" ? "desc" : "asc");
    } else {
      setEnquirySortField(field);
      setEnquirySortDir(field === "name" ? "asc" : "desc");
    }
  };

  const openStudentDialog = async (id?: string) => {
    if (!id) {
      setEditingStudentId(null);
      setStudentForm(emptyStudentForm);
      setStudentDialogOpen(true);
      return;
    }

    try {
      const student = await studentService.getById(id);
      setEditingStudentId(student.id);
      setStudentForm({
        name: student.name,
        email: student.email,
        phone: student.phone,
        courseId: student.courseId,
        batchId: student.batchId,
        attendancePercentage: student.attendancePercentage || 0,
      });
      setStudentDialogOpen(true);
    } catch (error) {
      toast.error(resolveApiError(error));
    }
  };

  const openTeacherDialog = async (id?: string) => {
    if (!id) {
      setEditingTeacherId(null);
      setTeacherForm(emptyTeacherForm);
      setTeacherDialogOpen(true);
      return;
    }

    try {
      const teacher = await teacherService.getById(id);
      setEditingTeacherId(teacher.id);
      setTeacherForm({
        name: teacher.name,
        phone: teacher.phone,
        email: teacher.email,
      });
      setTeacherDialogOpen(true);
    } catch (error) {
      toast.error(resolveApiError(error));
    }
  };

  const openCourseDialog = async (id?: number) => {
    if (!id) {
      setEditingCourseId(null);
      setCourseForm(emptyCourseForm);
      setCourseDialogOpen(true);
      return;
    }

    try {
      const course = await courseService.getById(id);
      setEditingCourseId(course.id);
      setCourseForm({
        title: course.title,
        subtitle: course.subtitle,
        description: course.description || "",
        targetClasses: course.targetClasses,
      });
      setCourseDialogOpen(true);
    } catch (error) {
      toast.error(resolveApiError(error));
    }
  };

  const openScheduleDialog = async (id?: number) => {
    if (!id) {
      setEditingScheduleId(null);
      setScheduleForm({
        ...emptyScheduleForm,
        teacherId: teachers[0]?.id || "",
      });
      setScheduleDialogOpen(true);
      return;
    }

    try {
      const schedule = await scheduleService.getById(id);
      setEditingScheduleId(schedule.id);
      setScheduleForm({
        subject: schedule.subject,
        topic: schedule.topic,
        date: schedule.date,
        time: schedule.time.slice(0, 5),
        teacherId: schedule.teacherId,
        batchId: schedule.batchId,
        room: schedule.room,
      });
      setScheduleDialogOpen(true);
    } catch (error) {
      toast.error(resolveApiError(error));
    }
  };

  const saveStudent = async () => {
    try {
      if (editingStudentId) {
        await studentService.update(editingStudentId, studentForm);
        toast.success("Student updated");
      } else {
        await studentService.create(studentForm);
        toast.success("Student created");
      }
      setStudentDialogOpen(false);
      await loadDashboard();
    } catch (error) {
      toast.error(resolveApiError(error));
    }
  };

  const saveTeacher = async () => {
    try {
      if (editingTeacherId) {
        await teacherService.update(editingTeacherId, teacherForm);
        toast.success("Teacher updated");
      } else {
        await teacherService.create(teacherForm);
        toast.success("Teacher created");
      }
      setTeacherDialogOpen(false);
      await loadDashboard();
    } catch (error) {
      toast.error(resolveApiError(error));
    }
  };

  const saveCourse = async () => {
    try {
      if (editingCourseId) {
        await courseService.update(editingCourseId, courseForm);
        toast.success("Course updated");
      } else {
        await courseService.create(courseForm);
        toast.success("Course created");
      }
      setCourseDialogOpen(false);
      await loadDashboard();
    } catch (error) {
      toast.error(resolveApiError(error));
    }
  };

  const saveSchedule = async () => {
    try {
      if (editingScheduleId) {
        await scheduleService.update(editingScheduleId, scheduleForm);
        toast.success("Schedule updated");
      } else {
        await scheduleService.create(scheduleForm);
        toast.success("Schedule created");
      }
      setScheduleDialogOpen(false);
      await loadDashboard();
    } catch (error) {
      toast.error(resolveApiError(error));
    }
  };

  const openEnquiryDialog = (enquiry: Enquiry) => {
    setEditingEnquiryId(enquiry.id);
    setEnquiryStatusForm("inactive");
    setEnquiryReasonForm("");
    setEnquiryDialogOpen(true);
  };

  const openEnquiryDetails = (enquiry: Enquiry) => {
    setSelectedDetailEnquiry(enquiry);
    setEnquiryDetailsDialogOpen(true);
  };

  const saveEnquiryStatus = async () => {
    if (!editingEnquiryId) return;
    if (!enquiryReasonForm.trim()) {
      return toast.error("Reason is mandatory");
    }
    try {
      await enquiryService.updateStatus(editingEnquiryId, enquiryStatusForm, enquiryReasonForm);
      toast.success("Enquiry status updated");
      setEnquiryDialogOpen(false);
      enquiryService.getEnquiries(enquiryTab === "active" ? ["Active"] : ["inactive", "resolved"]).then(setEnquiries);
    } catch (error) {
      toast.error(resolveApiError(error));
    }
  };

  const deleteStudent = async (id: string) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await studentService.delete(id);
      toast.success("Student deleted");
      await loadDashboard();
    } catch (error) {
      toast.error(resolveApiError(error));
    }
  };

  const deleteTeacher = async (id: string) => {
    if (!window.confirm("Delete this teacher?")) return;
    try {
      await teacherService.delete(id);
      toast.success("Teacher deleted");
      await loadDashboard();
    } catch (error) {
      toast.error(resolveApiError(error));
    }
  };

  const deleteCourse = async (id: number) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await courseService.delete(id);
      toast.success("Course deleted");
      await loadDashboard();
    } catch (error) {
      toast.error(resolveApiError(error));
    }
  };

  const deleteSchedule = async (id: number) => {
    if (!window.confirm("Delete this schedule?")) return;
    try {
      await scheduleService.delete(id);
      toast.success("Schedule deleted");
      await loadDashboard();
    } catch (error) {
      toast.error(resolveApiError(error));
    }
  };

  if (loading) {
    return (
      <DashboardLayout
        navItems={navItems}
        title={pageTitle}
        userName={session?.userName || "Admin User"}
        userRole={session?.userRoleLabel || "Administrator"}
      >
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      navItems={navItems}
      title={pageTitle}
      userName={session?.userName || "Admin User"}
      userRole={session?.userRoleLabel || "Administrator"}
    >
      {normalizedSection === "dashboard" && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Students", value: stats.totalStudents, icon: Users },
            { label: "Teachers", value: stats.totalTeachers, icon: UserCog },
            { label: "Active Courses", value: stats.activeCourses, icon: BookOpen },
            { label: "Revenue (₹)", value: stats.revenue, icon: CreditCard },
          ].map((item) => (
            <div key={item.label} className="bg-card rounded-xl border p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">{item.label}</div>
                  <div className="text-xl font-bold">{item.value}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {normalizedSection === "students" && (
        <section className="bg-card rounded-xl border shadow-card">
          <div className="p-5 border-b flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <h3 className="font-bold">Students</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Search students..."
                className="w-56"
                value={studentSearch}
                onChange={(event) => setStudentSearch(event.target.value)}
              />
              <Dialog open={studentDialogOpen} onOpenChange={setStudentDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1" onClick={() => openStudentDialog()}>
                    <Plus className="h-3.5 w-3.5" /> Add
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingStudentId ? "Edit Student" : "Add Student"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    <Input placeholder="Full name" value={studentForm.name} onChange={(event) => setStudentForm({ ...studentForm, name: event.target.value })} />
                    <Input placeholder="Email" type="email" value={studentForm.email} onChange={(event) => setStudentForm({ ...studentForm, email: event.target.value })} />
                    <Input placeholder="Phone" value={studentForm.phone} onChange={(event) => setStudentForm({ ...studentForm, phone: event.target.value.replace(/\D/g, "").slice(0, 10) })} />
                    <Input placeholder="Course ID" type="number" value={studentForm.courseId || ""} onChange={(event) => setStudentForm({ ...studentForm, courseId: Number(event.target.value) })} />
                    <Input placeholder="Batch ID" type="number" value={studentForm.batchId || ""} onChange={(event) => setStudentForm({ ...studentForm, batchId: Number(event.target.value) })} />
                    <Input
                      placeholder="Attendance %"
                      type="number"
                      min="0"
                      max="100"
                      value={studentForm.attendancePercentage}
                      onChange={(event) => setStudentForm({ ...studentForm, attendancePercentage: Number(event.target.value || 0) })}
                    />
                    <Button className="w-full" onClick={saveStudent}>
                      {editingStudentId ? "Save Student" : "Create Student"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Batch</TableHead>

                  <TableHead>Attendance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-xs text-muted-foreground">{student.email}</div>
                    </TableCell>
                    <TableCell>{student.courseId}</TableCell>
                    <TableCell>{student.batchId}</TableCell>

                    <TableCell>{student.attendancePercentage ?? 0}%</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openStudentDialog(student.id)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteStudent(student.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      )}

      {normalizedSection === "teachers" && (
        <section className="bg-card rounded-xl border shadow-card">
          <div className="p-5 border-b flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <h3 className="font-bold">Teachers</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Search teachers..."
                className="w-56"
                value={teacherSearch}
                onChange={(event) => setTeacherSearch(event.target.value)}
              />
              <Dialog open={teacherDialogOpen} onOpenChange={setTeacherDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1" onClick={() => openTeacherDialog()}>
                    <Plus className="h-3.5 w-3.5" /> Add
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingTeacherId ? "Edit Teacher" : "Add Teacher"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    <Input placeholder="Full name" value={teacherForm.name} onChange={(event) => setTeacherForm({ ...teacherForm, name: event.target.value })} />
                    <Input placeholder="Phone" value={teacherForm.phone} onChange={(event) => setTeacherForm({ ...teacherForm, phone: event.target.value.replace(/\D/g, "").slice(0, 10) })} />
                    <Input placeholder="Email" type="email" value={teacherForm.email} onChange={(event) => setTeacherForm({ ...teacherForm, email: event.target.value })} />
                    <Button className="w-full" onClick={saveTeacher}>
                      {editingTeacherId ? "Save Teacher" : "Create Teacher"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell className="font-medium">{teacher.name}</TableCell>
                    <TableCell>{teacher.phone}</TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openTeacherDialog(teacher.id)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteTeacher(teacher.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      )}

      {normalizedSection === "courses" && (
        <section className="bg-card rounded-xl border shadow-card">
          <div className="p-5 border-b flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <h3 className="font-bold">Courses</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Search courses..."
                className="w-56"
                value={courseSearch}
                onChange={(event) => setCourseSearch(event.target.value)}
              />
              <Dialog open={courseDialogOpen} onOpenChange={setCourseDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1" onClick={() => openCourseDialog()}>
                    <Plus className="h-3.5 w-3.5" /> Add
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingCourseId ? "Edit Course" : "Add Course"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    <Input placeholder="Title" value={courseForm.title} onChange={(event) => setCourseForm({ ...courseForm, title: event.target.value })} />
                    <Input placeholder="Subtitle" value={courseForm.subtitle} onChange={(event) => setCourseForm({ ...courseForm, subtitle: event.target.value })} />
                    <Input placeholder="Description" value={courseForm.description} onChange={(event) => setCourseForm({ ...courseForm, description: event.target.value })} />
                    <Input placeholder="Target classes" value={courseForm.targetClasses} onChange={(event) => setCourseForm({ ...courseForm, targetClasses: event.target.value })} />
                    <Button className="w-full" onClick={saveCourse}>
                      {editingCourseId ? "Save Course" : "Create Course"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Subtitle</TableHead>
                  <TableHead>Target Classes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <div className="font-medium">{course.title}</div>
                      <div className="text-xs text-muted-foreground">{course.description}</div>
                    </TableCell>
                    <TableCell>{course.subtitle}</TableCell>
                    <TableCell>{course.targetClasses}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openCourseDialog(course.id)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteCourse(course.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      )}



      {normalizedSection === "schedule" && (
        <section className="bg-card rounded-xl border shadow-card">
          <div className="p-5 border-b flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <h3 className="font-bold">Schedule</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Search schedule..."
                className="w-56"
                value={scheduleSearch}
                onChange={(event) => setScheduleSearch(event.target.value)}
              />
              <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1" onClick={() => openScheduleDialog()}>
                    <Plus className="h-3.5 w-3.5" /> Add
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingScheduleId ? "Edit Schedule" : "Add Schedule"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    <Input placeholder="Subject" value={scheduleForm.subject} onChange={(event) => setScheduleForm({ ...scheduleForm, subject: event.target.value })} />
                    <Input placeholder="Topic" value={scheduleForm.topic} onChange={(event) => setScheduleForm({ ...scheduleForm, topic: event.target.value })} />
                    <Input type="date" value={scheduleForm.date} onChange={(event) => setScheduleForm({ ...scheduleForm, date: event.target.value })} />
                    <Input type="time" value={scheduleForm.time} onChange={(event) => setScheduleForm({ ...scheduleForm, time: event.target.value })} />
                    <Select value={scheduleForm.teacherId} onValueChange={(value) => setScheduleForm({ ...scheduleForm, teacherId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select teacher" />
                      </SelectTrigger>
                      <SelectContent>
                        {teachers.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id}>
                            {teacher.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input placeholder="Batch ID" type="number" value={scheduleForm.batchId || ""} onChange={(event) => setScheduleForm({ ...scheduleForm, batchId: Number(event.target.value) })} />
                    <Input placeholder="Room" value={scheduleForm.room} onChange={(event) => setScheduleForm({ ...scheduleForm, room: event.target.value })} />
                    <Button className="w-full" onClick={saveSchedule}>
                      {editingScheduleId ? "Save Schedule" : "Create Schedule"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>When</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell>
                      <div className="font-medium">{schedule.subject}</div>
                      <div className="text-xs text-muted-foreground">{schedule.topic}</div>
                    </TableCell>
                    <TableCell>{schedule.teacherName}</TableCell>
                    <TableCell>{schedule.batchId}</TableCell>
                    <TableCell>{formatDate(schedule.date)} · {schedule.time.slice(0, 5)}</TableCell>
                    <TableCell>{schedule.room}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openScheduleDialog(schedule.id)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteSchedule(schedule.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      )}

      {normalizedSection === "enquiries" && (
        <section className="bg-card rounded-xl border shadow-card">
          <div className="p-5 border-b flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <h3 className="font-bold">
              {enquiryTab === "active" ? "Active Enquiries" : "Inactive & Resolved Enquiries"}
            </h3>
            <div className="flex gap-2">
              <Input
                placeholder="Search queries..."
                className="w-56"
                value={enquirySearch}
                onChange={(event) => setEnquirySearch(event.target.value)}
              />
              <Button variant="outline" onClick={() => setEnquiryTab(prev => prev === "active" ? "resolved_inactive" : "active")}>
                {enquiryTab === "active" ? "View Resolved & Inactive" : "View Active"}
              </Button>
              <Dialog open={enquiryDialogOpen} onOpenChange={setEnquiryDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Enquiry Status</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    <Select value={enquiryStatusForm} onValueChange={setEnquiryStatusForm}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Reason for status change (Mandatory)"
                      value={enquiryReasonForm}
                      onChange={(e) => setEnquiryReasonForm(e.target.value)}
                    />
                    <Button className="w-full" onClick={saveEnquiryStatus}>
                      Save Status
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={enquiryDetailsDialogOpen} onOpenChange={setEnquiryDetailsDialogOpen}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Enquiry Details</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Student Name</p>
                      <p className="text-base font-semibold">{selectedDetailEnquiry?.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                      <p className="text-base">{selectedDetailEnquiry?.email}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                      <p className="text-base">{selectedDetailEnquiry?.phone}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">School Name</p>
                      <p className="text-base">{selectedDetailEnquiry?.schoolName || "-"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Interested In / Grade</p>
                      <p className="text-base">
                        {selectedDetailEnquiry?.interestedIn || "-"} {selectedDetailEnquiry?.grade ? `· Grade: ${selectedDetailEnquiry.grade}` : ""}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <Badge variant={selectedDetailEnquiry?.status === "active" ? "default" : "secondary"} className="capitalize">
                        {selectedDetailEnquiry?.status}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Parent Name</p>
                      <p className="text-base">{selectedDetailEnquiry?.parentName || "-"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Parent Number</p>
                      <p className="text-base">{selectedDetailEnquiry?.parentNumber || "-"}</p>
                    </div>
                    <div className="col-span-full space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Reason / Comments</p>
                      <div className="p-3 bg-muted rounded-md min-h-[60px] text-sm">
                        {selectedDetailEnquiry?.reason || "No comments provided."}
                      </div>
                    </div>
                    <div className="col-span-full pt-2 flex justify-between text-xs text-muted-foreground border-t">
                      <p>Created: {selectedDetailEnquiry ? new Date(selectedDetailEnquiry.createdAt).toLocaleString() : ""}</p>
                      <p>Last Updated: {selectedDetailEnquiry ? new Date(selectedDetailEnquiry.updatedAt).toLocaleString() : ""}</p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <div
                      className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors"
                      onClick={() => toggleEnquirySort("name")}
                    >
                      Name
                      <ArrowUpDown className="h-3.5 w-3.5" />
                    </div>
                  </TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Interested In / Grade</TableHead>
                  {enquiryTab === "resolved_inactive" && (
                    <TableHead>
                      <div
                        className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors"
                        onClick={() => toggleEnquirySort("status")}
                      >
                        Status
                        <ArrowUpDown className="h-3.5 w-3.5" />
                      </div>
                    </TableHead>
                  )}
                  {enquiryTab === "resolved_inactive" && <TableHead>Reason</TableHead>}
                  <TableHead>
                    <div
                      className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors"
                      onClick={() => toggleEnquirySort("date")}
                    >
                      Date
                      <ArrowUpDown className="h-3.5 w-3.5" />
                    </div>
                  </TableHead>
                  {enquiryTab === "active" && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEnquiries.map((enquiry) => (
                  <TableRow key={enquiry.id}>
                    <TableCell>
                      <div className="font-medium">{enquiry.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{enquiry.phone}</div>
                      <div className="text-xs text-muted-foreground">{enquiry.email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{enquiry.interestedIn || "-"}</div>
                      <div className="text-xs text-muted-foreground">{enquiry.grade ? `Grade: ${enquiry.grade}` : ""}</div>
                    </TableCell>
                    {enquiryTab === "resolved_inactive" && (
                      <TableCell>
                        <span className="capitalize">{enquiry.status || "Active"}</span>
                      </TableCell>
                    )}
                    {enquiryTab === "resolved_inactive" && (
                      <TableCell>
                        <div className="text-sm text-muted-foreground max-w-[200px] truncate" title={enquiry.reason || "-"}>
                          {enquiry.reason || "-"}
                        </div>
                      </TableCell>
                    )}
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(enquiry.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEnquiryDetails(enquiry)}>
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        {enquiryTab === "active" && (
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEnquiryDialog(enquiry)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredEnquiries.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No enquiries found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </section>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
