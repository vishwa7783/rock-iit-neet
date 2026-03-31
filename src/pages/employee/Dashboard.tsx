import { useEffect, useMemo, useState } from "react";
import { BookOpen, ClipboardList, LayoutDashboard, Loader2, Save, UserCheck } from "lucide-react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  attendanceService,
  getSession,
  resolveApiError,
  scheduleService,
  setSession,
  studentService,
  teacherService,
  testScoreService,
  type AttendanceRecord,
  type ClassSchedule,
  type Student,
  type Teacher,
} from "@/services/api";
import { toast } from "sonner";

const navItems = [
  { label: "Dashboard", href: "/employee/dashboard", icon: LayoutDashboard },
  { label: "My Classes", href: "/employee/dashboard", icon: BookOpen },
  { label: "Attendance", href: "/employee/dashboard", icon: UserCheck },
  { label: "Assignments", href: "/employee/dashboard", icon: ClipboardList },
];

type AttendanceRow = {
  studentId: string;
  name: string;
  present: boolean;
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const EmployeeDashboard = () => {
  const session = getSession();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [activeTeacherId, setActiveTeacherId] = useState<string>(session?.userId || "");
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>("");
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [attendanceRows, setAttendanceRows] = useState<AttendanceRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [scoreStudentId, setScoreStudentId] = useState("");
  const [scoreSubject, setScoreSubject] = useState("");
  const [scoreValue, setScoreValue] = useState("");
  const [scoreTotal, setScoreTotal] = useState("100");
  const [scoreDate, setScoreDate] = useState("");

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const [teacherList, studentList] = await Promise.all([teacherService.getAll(), studentService.getAll()]);
        setTeachers(teacherList);
        setStudents(studentList);

        const initialTeacherId = session?.userId && teacherList.some((item) => item.id === session.userId) ? session.userId : teacherList[0]?.id;
        if (initialTeacherId) {
          setActiveTeacherId(initialTeacherId);
        }
      } catch (error) {
        toast.error(resolveApiError(error));
      }
    };

    bootstrap();
  }, [session?.userId]);

  useEffect(() => {
    if (!activeTeacherId) return;

    const loadTeacherDashboard = async () => {
      try {
        setLoading(true);
        const teacherData = await teacherService.getById(activeTeacherId);
        const teacherSchedules = await scheduleService.getByTeacher(activeTeacherId);

        setTeacher(teacherData);
        setSchedules(teacherSchedules);

        if (teacherSchedules[0]) {
          setSelectedScheduleId(String(teacherSchedules[0].id));
          setScoreDate(teacherSchedules[0].date);
          setScoreSubject(teacherSchedules[0].subject);
        }

        setSession({
          role: "teacher",
          userId: teacherData.id,
          userName: teacherData.name,
          userRoleLabel: teacherData.role,
          phone: teacherData.phone,
        });
      } catch (error) {
        toast.error(resolveApiError(error));
      } finally {
        setLoading(false);
      }
    };

    loadTeacherDashboard();
  }, [activeTeacherId]);

  const selectedSchedule = useMemo(
    () => schedules.find((item) => String(item.id) === selectedScheduleId) || null,
    [selectedScheduleId, schedules],
  );

  useEffect(() => {
    if (!selectedSchedule) {
      setAttendanceRecords([]);
      setAttendanceRows([]);
      return;
    }

    const loadAttendance = async () => {
      try {
        const records = await attendanceService.getByClass(selectedSchedule.id);
        setAttendanceRecords(records);

        const roster = students
          .filter((student) => student.batchId === selectedSchedule.batchId)
          .map((student) => {
            const existing = records.find(
              (record) => record.studentId === student.id && record.date === selectedSchedule.date,
            );

            return {
              studentId: student.id,
              name: student.name,
              present: existing ? existing.status === "PRESENT" : true,
            };
          });

        setAttendanceRows(roster);
        setScoreDate(selectedSchedule.date);
        setScoreSubject(selectedSchedule.subject);
        setScoreStudentId((current) => current || roster[0]?.studentId || "");
      } catch (error) {
        toast.error(resolveApiError(error));
      }
    };

    loadAttendance();
  }, [selectedSchedule, students]);

  const todayAttendanceRecords = useMemo(
    () => attendanceRecords.filter((record) => record.date === selectedSchedule?.date),
    [attendanceRecords, selectedSchedule?.date],
  );

  const attendanceLocked = todayAttendanceRecords.length > 0;
  const presentCount = attendanceRows.filter((row) => row.present).length;

  const toggleAttendance = (studentId: string) => {
    if (attendanceLocked) return;

    setAttendanceRows((current) =>
      current.map((row) => (row.studentId === studentId ? { ...row, present: !row.present } : row)),
    );
  };

  const saveAttendance = async () => {
    if (!selectedSchedule) return;

    try {
      await Promise.all(
        attendanceRows.map((row) =>
          attendanceService.mark({
            studentId: row.studentId,
            classScheduleId: selectedSchedule.id,
            status: row.present ? "PRESENT" : "ABSENT",
            date: selectedSchedule.date,
          }),
        ),
      );
      toast.success("Attendance saved");
      const records = await attendanceService.getByClass(selectedSchedule.id);
      setAttendanceRecords(records);
    } catch (error) {
      toast.error(resolveApiError(error));
    }
  };

  const saveScore = async () => {
    if (!scoreStudentId) {
      toast.error("Select a student first");
      return;
    }

    try {
      await testScoreService.create({
        studentId: scoreStudentId,
        subject: scoreSubject,
        score: Number(scoreValue),
        total: Number(scoreTotal),
        date: scoreDate,
      });
      toast.success("Test score recorded");
      setScoreValue("");
    } catch (error) {
      toast.error(resolveApiError(error));
    }
  };

  return (
    <DashboardLayout
      navItems={navItems}
      title="Teacher Dashboard"
      userName={teacher?.name || session?.userName || "Teacher"}
      userRole={teacher?.role || session?.userRoleLabel || "Faculty"}
    >
      {teachers.length > 0 && (
        <div className="mb-6 max-w-sm">
          <Select value={activeTeacherId} onValueChange={setActiveTeacherId}>
            <SelectTrigger>
              <SelectValue placeholder="Select teacher" />
            </SelectTrigger>
            <SelectContent>
              {teachers.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name} • {item.role}
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
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {schedules.map((schedule) => (
              <button
                key={schedule.id}
                type="button"
                onClick={() => setSelectedScheduleId(String(schedule.id))}
                className={`bg-card rounded-xl border p-5 shadow-card text-left ${String(schedule.id) === selectedScheduleId ? "border-primary" : ""}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">{schedule.batchId}</Badge>
                  <span className="text-xs text-muted-foreground">{schedule.room}</span>
                </div>
                <h3 className="font-bold">{schedule.subject}</h3>
                <p className="text-sm text-muted-foreground">{schedule.topic}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(schedule.date)} · {schedule.time.slice(0, 5)}
                </p>
              </button>
            ))}
          </div>

          {selectedSchedule && (
            <div className="grid xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 bg-card rounded-xl border shadow-card">
                <div className="p-5 border-b flex items-center justify-between">
                  <div>
                    <h3 className="font-bold">Mark Attendance</h3>
                    <p className="text-xs text-muted-foreground">
                      {selectedSchedule.subject} · {selectedSchedule.batchId} · {formatDate(selectedSchedule.date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{presentCount}/{attendanceRows.length} present</span>
                    <Button size="sm" className="gap-1" onClick={saveAttendance} disabled={attendanceLocked || !attendanceRows.length}>
                      <Save className="h-3.5 w-3.5" /> Save
                    </Button>
                  </div>
                </div>
                {attendanceLocked && (
                  <div className="px-5 py-3 text-xs text-amber-700 bg-amber-50 border-b">
                    Attendance for this class date is already recorded. The backend only supports new entries, so this view is locked to avoid duplicates.
                  </div>
                )}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Batch</TableHead>
                        <TableHead className="text-right">Present</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendanceRows.map((row) => (
                        <TableRow key={row.studentId}>
                          <TableCell className="font-medium">{row.name}</TableCell>
                          <TableCell>{selectedSchedule.batchId}</TableCell>
                          <TableCell className="text-right">
                            <Switch checked={row.present} onCheckedChange={() => toggleAttendance(row.studentId)} disabled={attendanceLocked} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-card rounded-xl border shadow-card p-5 space-y-3">
                  <div>
                    <h3 className="font-bold">Record Test Score</h3>
                    <p className="text-xs text-muted-foreground">Uses the Spring `test-scores` API for the selected class roster.</p>
                  </div>
                  <Select value={scoreStudentId} onValueChange={setScoreStudentId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      {attendanceRows.map((row) => (
                        <SelectItem key={row.studentId} value={row.studentId}>
                          {row.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input placeholder="Subject" value={scoreSubject} onChange={(event) => setScoreSubject(event.target.value)} />
                  <Input placeholder="Score" type="number" value={scoreValue} onChange={(event) => setScoreValue(event.target.value)} />
                  <Input placeholder="Total" type="number" value={scoreTotal} onChange={(event) => setScoreTotal(event.target.value)} />
                  <Input type="date" value={scoreDate} onChange={(event) => setScoreDate(event.target.value)} />
                  <Button className="w-full" onClick={saveScore}>Save Score</Button>
                </div>

                <div className="bg-card rounded-xl border shadow-card p-5">
                  <h3 className="font-bold mb-3">Recorded Attendance</h3>
                  <div className="space-y-3">
                    {todayAttendanceRecords.length ? (
                      todayAttendanceRecords.map((record) => (
                        <div key={record.id} className="flex items-center justify-between gap-3 text-sm">
                          <span>{record.studentName}</span>
                          <span className={record.status === "PRESENT" ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                            {record.status}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No attendance has been recorded for this class date yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
