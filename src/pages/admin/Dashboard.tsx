import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  History,
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
  parentName: "",
  parentPhoneNumber: "",
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
  const navigate = useNavigate();

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
  const [historyEnquiries, setHistoryEnquiries] = useState<Enquiry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [studentDetailsOpen, setStudentDetailsOpen] = useState(false);
  const [updateReason, setUpdateReason] = useState("");

  const [studentSearch, setStudentSearch] = useState("");
  const [teacherSearch, setTeacherSearch] = useState("");
  const [courseSearch, setCourseSearch] = useState("");

  const [scheduleSearch, setScheduleSearch] = useState("");
  const [enquirySearch, setEnquirySearch] = useState("");
  const [enquirySort, setEnquirySort] = useState<{ field: "name" | "date"; order: "asc" | "desc" }>({
    field: "date",
    order: "desc",
  });

  const [enquiryDialogOpen, setEnquiryDialogOpen] = useState(false);
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
              ? "Active Enquiries"
              : normalizedSection === "enquiry-history"
                ? "Enquiry History"
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
        enquiryService.getEnquiries(["active", "pending", "new", "Active", "Pending", "New"]),
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

  const loadHistory = async () => {
    try {
      setHistoryLoading(true);
      const data = await enquiryService.getEnquiries(["inactive", "resolved", "Inactive", "Resolved"]);
      setHistoryEnquiries(data);
    } catch (error) {
      toast.error(resolveApiError(error));
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (normalizedSection === "enquiry-history") {
      loadHistory();
    } else {
      loadDashboard();
    }
  }, [normalizedSection]);

  const filteredStudents = useMemo(() => {
    if (!studentSearch.trim()) return students;
    return students.filter(
      (student) =>
        matches(student.name, studentSearch) ||
        matches(student.email, studentSearch) ||
        matches(student.course?.title || String(student.courseId), studentSearch) ||
        matches(student.batch?.name || String(student.batchId), studentSearch),
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
      if (enquirySort.field === "name") {
        cmp = a.name.localeCompare(b.name);
      } else {
        cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return enquirySort.order === "asc" ? cmp : -cmp;
    });
  }, [enquirySearch, enquirySort, enquiries]);

  const filteredHistoryEnquiries = useMemo(() => {
    let result = historyEnquiries;
    if (enquirySearch.trim()) {
      result = result.filter(
        (e) => matches(e.name, enquirySearch) || matches(e.email, enquirySearch) || matches(e.phone, enquirySearch)
      );
    }
    return result;
  }, [enquirySearch, historyEnquiries]);

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
        parentName: student.parentName || "",
        parentPhoneNumber: student.parentPhoneNumber || "",
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
    setEnquiryStatusForm(enquiry.status === "active" ? "inactive" : "active");
    setUpdateReason("");
    setEnquiryDialogOpen(true);
  };

  const saveEnquiryStatus = async () => {
    if (!editingEnquiryId) return;
    try {
      await enquiryService.updateStatus(editingEnquiryId, enquiryStatusForm, updateReason);
      toast.success("Enquiry status updated");
      setEnquiryDialogOpen(false);
      await loadDashboard();
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
                    <div className="grid grid-cols-2 gap-2">
                      <Input placeholder="Parent name" value={studentForm.parentName} onChange={(event) => setStudentForm({ ...studentForm, parentName: event.target.value })} />
                      <Input placeholder="Parent Phone" value={studentForm.parentPhoneNumber} onChange={(event) => setStudentForm({ ...studentForm, parentPhoneNumber: event.target.value.replace(/\D/g, "").slice(0, 10) })} />
                    </div>
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
                    <TableCell>{student.course?.title || student.courseId}</TableCell>
                    <TableCell>{student.batch?.name || student.batchId}</TableCell>

                    <TableCell>{student.attendancePercentage ?? 0}%</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => {
                        setSelectedStudent(student);
                        setStudentDetailsOpen(true);
                      }}>
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
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
          <div className="p-5 border-b flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <h3 className="font-bold text-primary">Active Enquiries</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-primary/30 text-primary hover:bg-primary/5 h-10 px-4 rounded-xl font-bold"
                onClick={() => navigate("/admin/enquiry-history")}
              >
                <History className="h-4 w-4" /> Inactive & Resolved
              </Button>
              <Input
                placeholder="Search queries..."
                className="w-56 h-10 rounded-xl"
                value={enquirySearch}
                onChange={(event) => setEnquirySearch(event.target.value)}
              />
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
                      placeholder="Reason for status change..."
                      value={updateReason}
                      onChange={(e) => setUpdateReason(e.target.value)}
                    />
                    <Button className="w-full" onClick={saveEnquiryStatus}>
                      Save Status
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
                  <TableHead>
                    <div
                      className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors"
                      onClick={() => setEnquirySort({
                        field: "name",
                        order: enquirySort.field === "name" && enquirySort.order === "asc" ? "desc" : "asc"
                      })}
                    >
                      Name
                      <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />
                    </div>
                  </TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Interested In / Grade</TableHead>
                  <TableHead>
                    <div
                      className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors"
                      onClick={() => setEnquirySort({
                        field: "date",
                        order: enquirySort.field === "date" && enquirySort.order === "asc" ? "desc" : "asc"
                      })}
                    >
                      Date
                      <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
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
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(enquiry.createdAt)}
                    </TableCell>
                    <TableCell className="text-right flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => {
                        setSelectedEnquiry(enquiry);
                        setDetailsOpen(true);
                      }}>
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEnquiryDialog(enquiry)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredEnquiries.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No active enquiries found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </section>
      )}

      {normalizedSection === "enquiry-history" && (
        <section className="bg-card rounded-xl border shadow-card">
          <div className="p-5 border-b flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-500">History</h3>
              <p className="text-xs text-muted-foreground uppercase font-black tracking-widest mt-1">
                Inactive & Resolved Leads
              </p>
            </div>
            <div className="flex gap-4">
              <Input
                placeholder="Search history..."
                className="w-56 h-10 rounded-xl"
                value={enquirySearch}
                onChange={(event) => setEnquirySearch(event.target.value)}
              />
              <Button
                variant="ghost"
                size="sm"
                className="font-bold gap-2 text-primary hover:bg-primary/5"
                onClick={() => navigate("/admin/enquiries")}
              >
                ← Back to Active
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            {historyLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary/30" />
                <p className="text-sm font-bold text-slate-400 animate-pulse uppercase tracking-widest">Loading History...</p>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-muted/10">
                  <TableRow>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest">Name</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest">Status</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest">Update Reason</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest">Date</TableHead>
                    <TableHead className="text-right font-black text-[10px] uppercase tracking-widest">View</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistoryEnquiries.map((e) => (
                    <TableRow key={e.id} className="hover:bg-muted/5 transition-colors">
                      <TableCell className="font-bold text-slate-700">{e.name}</TableCell>
                      <TableCell>
                        <Badge
                          className={`rounded-lg px-2 py-1 text-[10px] font-black uppercase tracking-wider ${String(e.status).toLowerCase() === "resolved"
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                            : "bg-slate-200 text-slate-600 hover:bg-slate-200"
                            }`}
                        >
                          {e.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <p className="text-sm font-medium text-slate-500 italic truncate" title={e.reason}>
                          {e.reason || "-"}
                        </p>
                      </TableCell>
                      <TableCell className="text-slate-400 text-xs">
                        {formatDate(e.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-primary"
                          onClick={() => {
                            setSelectedEnquiry(e);
                            setDetailsOpen(true);
                          }}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredHistoryEnquiries.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="h-12 w-12 rounded-2xl bg-muted/20 flex items-center justify-center text-muted-foreground/30">
                            <History className="h-6 w-6" />
                          </div>
                          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No Records Found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </section>
      )}

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Enquiry Details</DialogTitle>
          </DialogHeader>
          {selectedEnquiry && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-muted-foreground">Name</p>
                  <p className="font-bold text-sm">{selectedEnquiry.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-muted-foreground">Status</p>
                  <Badge variant={selectedEnquiry.status === "active" ? "default" : "secondary"}>
                    {selectedEnquiry.status}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-muted-foreground">Mobile</p>
                  <p className="text-sm font-medium">{selectedEnquiry.phone}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-muted-foreground">Email</p>
                  <p className="text-sm font-medium truncate">{selectedEnquiry.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-muted-foreground">Class</p>
                  <p className="text-sm font-medium">{selectedEnquiry.grade || "-"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-muted-foreground">Interested In</p>
                  <p className="text-sm font-medium">{selectedEnquiry.interestedIn || "-"}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-muted-foreground">School Name</p>
                <p className="text-sm font-medium">{selectedEnquiry.schoolName || "-"}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-muted-foreground">Parent Name</p>
                  <p className="text-sm font-medium">{selectedEnquiry.parentName || "-"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-muted-foreground">Parent Mobile</p>
                  <p className="text-sm font-medium">{selectedEnquiry.parentPhoneNumber || "-"}</p>
                </div>
              </div>
              {selectedEnquiry.reason && (
                <div className="space-y-1 p-2 rounded-lg bg-muted/50 border">
                  <p className="text-[10px] font-black uppercase text-muted-foreground">Latest Update Reason</p>
                  <p className="text-xs font-medium italic">{selectedEnquiry.reason}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={studentDetailsOpen} onOpenChange={setStudentDetailsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-muted-foreground">Name</p>
                  <p className="font-bold text-sm">{selectedStudent.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-muted-foreground">Attendance</p>
                  <Badge variant="outline">{selectedStudent.attendancePercentage ?? 0}%</Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-muted-foreground">Mobile</p>
                  <p className="text-sm font-medium">{selectedStudent.phone}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-muted-foreground">Email</p>
                  <p className="text-sm font-medium truncate">{selectedStudent.email}</p>
                </div>
              </div>
              <div className="space-y-1 p-3 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-[10px] font-black uppercase text-primary/70">Course Details</p>
                <p className="font-bold text-sm">{selectedStudent.course?.title || `ID: ${selectedStudent.courseId}`}</p>
                {selectedStudent.course?.subtitle && <p className="text-xs text-muted-foreground">{selectedStudent.course.subtitle}</p>}
              </div>
              <div className="space-y-1 p-3 rounded-lg bg-secondary/5 border border-secondary/10">
                <p className="text-[10px] font-black uppercase text-muted-foreground">Batch Details</p>
                <p className="font-bold text-sm">{selectedStudent.batch?.name || `ID: ${selectedStudent.batchId}`}</p>
                {selectedStudent.batch?.startDate && (
                  <p className="text-xs text-muted-foreground">
                    {formatDate(selectedStudent.batch.startDate)} - {formatDate(selectedStudent.batch.endDate)}
                  </p>
                )}
              </div>
              {(selectedStudent.parentName || selectedStudent.parentPhoneNumber) && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-muted-foreground">Parent Name</p>
                    <p className="text-sm font-medium">{selectedStudent.parentName || "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-muted-foreground">Parent Mobile</p>
                    <p className="text-sm font-medium">{selectedStudent.parentPhoneNumber || "-"}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout >
  );
};

export default AdminDashboard;
