import { useState } from "react";
import { LayoutDashboard, BookOpen, UserCheck, ClipboardList, Save } from "lucide-react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { teacherClasses, attendanceData } from "@/data/dummy";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { label: "Dashboard", href: "/employee/dashboard", icon: LayoutDashboard },
  { label: "My Classes", href: "/employee/classes", icon: BookOpen },
  { label: "Attendance", href: "/employee/attendance", icon: UserCheck },
  { label: "Assignments", href: "/employee/assignments", icon: ClipboardList },
];

const EmployeeDashboard = () => {
  const [attendance, setAttendance] = useState(attendanceData.map((a) => ({ ...a })));

  const toggleAttendance = (id: string) => {
    setAttendance((prev) => prev.map((a) => a.id === id ? { ...a, present: !a.present } : a));
  };

  const presentCount = attendance.filter((a) => a.present).length;

  return (
    <DashboardLayout navItems={navItems} title="Teacher Dashboard" userName="Dr. Mehta" userRole="Physics Faculty">
      {/* Classes */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {teacherClasses.map((c) => (
          <div key={c.id} className="bg-card rounded-xl border p-5 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="secondary">{c.batch}</Badge>
              <span className="text-xs text-muted-foreground">{c.room}</span>
            </div>
            <h3 className="font-bold">{c.subject}</h3>
            <p className="text-sm text-muted-foreground">{c.time}</p>
            <p className="text-xs text-muted-foreground mt-1">{c.students} students</p>
          </div>
        ))}
      </div>

      {/* Mark Attendance */}
      <div className="bg-card rounded-xl border shadow-card">
        <div className="p-5 border-b flex items-center justify-between">
          <div>
            <h3 className="font-bold">Mark Attendance</h3>
            <p className="text-xs text-muted-foreground">Physics · JEE 2025 · Today</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{presentCount}/{attendance.length} present</span>
            <Button size="sm" className="gap-1"><Save className="h-3.5 w-3.5" /> Save</Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead className="text-right">Present</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendance.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-mono text-xs">{a.id}</TableCell>
                  <TableCell className="font-medium">{a.name}</TableCell>
                  <TableCell className="text-right">
                    <Switch checked={a.present} onCheckedChange={() => toggleAttendance(a.id)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
