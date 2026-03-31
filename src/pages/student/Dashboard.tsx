import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  BookOpen,
  CheckCircle,
  Clock,
  CreditCard,
  LayoutDashboard,
  Loader2,
  TrendingUp,
  User,
  UserCheck,
} from "lucide-react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  attendanceService,
  courseService,
  getSession,
  resolveApiError,
  scheduleService,
  setSession,
  studentService,
  testScoreService,
  type AttendanceRecord,
  type ClassSchedule,
  type Student,
  type TestScore,
} from "@/services/api";
import { toast } from "sonner";

const navItems = [
  { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
  { label: "My Courses", href: "/student/dashboard", icon: BookOpen },
  { label: "Attendance", href: "/student/dashboard", icon: UserCheck },
  { label: "Performance", href: "/student/dashboard", icon: BarChart3 },
  { label: "Fees", href: "/student/dashboard", icon: CreditCard },
  { label: "Profile", href: "/student/dashboard", icon: User },
];

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const StudentDashboard = () => {
  const session = getSession();
  const [students, setStudents] = useState<Student[]>([]);
  const [activeStudentId, setActiveStudentId] = useState<string>(session?.userId || "");
  const [student, setStudent] = useState<Student | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [scores, setScores] = useState<TestScore[]>([]);
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [courseDescription, setCourseDescription] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const list = await studentService.getAll();
        setStudents(list);

        const initialStudentId = session?.userId && list.some((item) => item.id === session.userId) ? session.userId : list[0]?.id;
        if (initialStudentId) {
          setActiveStudentId(initialStudentId);
        }
      } catch (error) {
        toast.error(resolveApiError(error));
      }
    };

    bootstrap();
  }, [session?.userId]);

  useEffect(() => {
    if (!activeStudentId) return;

    const loadStudentDashboard = async () => {
      try {
        setLoading(true);
        const selectedStudent = await studentService.getById(activeStudentId);
        const [attendanceData, scoreData, scheduleData, courses] = await Promise.all([
          attendanceService.getByStudent(activeStudentId),
          testScoreService.getByStudent(activeStudentId),
          scheduleService.getByBatch(selectedStudent.batchId),
          courseService.getAll(),
        ]);

        setStudent(selectedStudent);
        setAttendance(attendanceData);
        setScores(scoreData);
        setSchedules(scheduleData);
        setCourseDescription(
          courses.find((course) => course.id === selectedStudent.courseId)?.description || "",
        );

        setSession({
          role: "student",
          userId: selectedStudent.id,
          userName: selectedStudent.name,
          userRoleLabel: `Student Course ID: ${selectedStudent.courseId}`,
          phone: selectedStudent.phone,
          batch: String(selectedStudent.batchId),
          course: String(selectedStudent.courseId),
        });
      } catch (error) {
        toast.error(resolveApiError(error));
      } finally {
        setLoading(false);
      }
    };

    loadStudentDashboard();
  }, [activeStudentId]);

  const upcomingSchedules = useMemo(
    () =>
      [...schedules]
        .sort((first, second) => `${first.date}T${first.time}`.localeCompare(`${second.date}T${second.time}`))
        .slice(0, 4),
    [schedules],
  );

  const averageScore = useMemo(() => {
    if (!scores.length) return 0;
    return Math.round(scores.reduce((total, score) => total + (score.score / score.total) * 100, 0) / scores.length);
  }, [scores]);

  const recentAttendance = useMemo(
    () => [...attendance].sort((first, second) => second.date.localeCompare(first.date)).slice(0, 4),
    [attendance],
  );

  return (
    <DashboardLayout
      navItems={navItems}
      title="Dashboard"
      userName={student?.name || session?.userName || "Student"}
      userRole={student ? `Student · ${student.courseId}` : session?.userRoleLabel || "Student"}
    >
      {students.length > 0 && (
        <div className="mb-6 max-w-sm">
          <Select value={activeStudentId} onValueChange={setActiveStudentId}>
            <SelectTrigger>
              <SelectValue placeholder="Select student" />
            </SelectTrigger>
            <SelectContent>
              {students.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : student ? (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-card rounded-xl border p-5 shadow-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Upcoming Classes</div>
                  <div className="text-2xl font-bold">{upcomingSchedules.length}</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Next batch: {student.batchId}
              </p>
            </div>

            <div className="bg-card rounded-xl border p-5 shadow-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Attendance</div>
                  <div className="text-2xl font-bold">{Math.round(student.attendancePercentage || 0)}%</div>
                </div>
              </div>
              <Progress value={student.attendancePercentage || 0} className="h-2" />
            </div>

            <div className="bg-card rounded-xl border p-5 shadow-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent-foreground flex items-center justify-center">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Avg. Score</div>
                  <div className="text-2xl font-bold">{averageScore}%</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{scores.length} test records fetched from backend</p>
            </div>

            <div className="bg-card rounded-xl border p-5 shadow-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Current Course</div>
                  <div className="text-lg font-bold">{student.courseId}</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{student.batchId}</p>
            </div>
          </div>

          <div className="grid xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <div className="bg-card rounded-xl border shadow-card">
                <div className="p-5 border-b">
                  <h3 className="font-bold">Upcoming Classes</h3>
                </div>
                <div className="divide-y">
                  {upcomingSchedules.length ? (
                    upcomingSchedules.map((schedule) => (
                      <div key={schedule.id} className="p-4 flex items-center justify-between gap-4">
                        <div>
                          <div className="font-semibold text-sm">{schedule.subject}</div>
                          <div className="text-xs text-muted-foreground">{schedule.topic} · {schedule.teacherName}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{schedule.time.slice(0, 5)}</div>
                          <div className="text-xs text-muted-foreground">{formatDate(schedule.date)}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-sm text-muted-foreground">No schedule found for batch {student.batchId}.</div>
                  )}
                </div>
              </div>

              <div className="bg-card rounded-xl border shadow-card">
                <div className="p-5 border-b">
                  <h3 className="font-bold">Recent Test Scores</h3>
                </div>
                <div className="divide-y">
                  {scores.length ? (
                    scores.slice(0, 5).map((score) => {
                      const percentage = Math.round((score.score / score.total) * 100);
                      return (
                        <div key={score.id} className="p-4 flex items-center justify-between gap-4">
                          <div>
                            <div className="font-semibold text-sm">{score.subject}</div>
                            <div className="text-xs text-muted-foreground">{formatDate(score.date)}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold">{score.score}/{score.total}</div>
                            <Progress value={percentage} className="h-1.5 w-20 mt-1" />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-4 text-sm text-muted-foreground">No test scores recorded yet.</div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-card rounded-xl border shadow-card p-5">
                <h3 className="font-bold mb-3">Student Profile</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Email</span>
                    <span className="text-right">{student.email}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Phone</span>
                    <span>{student.phone}</span>
                  </div>
                </div>
                {courseDescription && <p className="text-xs text-muted-foreground mt-4">{courseDescription}</p>}
              </div>

              <div className="bg-card rounded-xl border shadow-card">
                <div className="p-5 border-b">
                  <h3 className="font-bold">Attendance Feed</h3>
                </div>
                <div className="divide-y">
                  {recentAttendance.length ? (
                    recentAttendance.map((record) => (
                      <div key={record.id} className="p-4 flex items-center justify-between gap-4">
                        <div>
                          <div className="font-semibold text-sm">{record.subject}</div>
                          <div className="text-xs text-muted-foreground">{formatDate(record.date)}</div>
                        </div>
                        <span className={`text-xs font-semibold ${record.status === "PRESENT" ? "text-green-600" : "text-red-600"}`}>
                          {record.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-sm text-muted-foreground">Attendance records will appear here.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-sm text-muted-foreground">No students found in the backend yet.</div>
      )}
    </DashboardLayout>
  );
};

export default StudentDashboard;
