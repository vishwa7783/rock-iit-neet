import { useState } from "react";
import { LayoutDashboard, Users, UserCog, BookOpen, CreditCard, FileBarChart, Plus, Pencil, Trash2 } from "lucide-react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { dashboardStudents, courses } from "@/data/dummy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Students", href: "/admin/students", icon: Users },
  { label: "Teachers", href: "/admin/teachers", icon: UserCog },
  { label: "Courses", href: "/admin/courses", icon: BookOpen },
  { label: "Fees", href: "/admin/fees", icon: CreditCard },
  { label: "Reports", href: "/admin/reports", icon: FileBarChart },
];

const AdminDashboard = () => {
  const [search, setSearch] = useState("");
  const filtered = dashboardStudents.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout navItems={navItems} title="Admin Dashboard" userName="Admin User" userRole="Administrator">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Students", value: "5,234", icon: Users, color: "primary" },
          { label: "Teachers", value: "48", icon: UserCog, color: "secondary" },
          { label: "Active Courses", value: "12", icon: BookOpen, color: "accent" },
          { label: "Revenue (₹)", value: "12.5L", icon: CreditCard, color: "primary" },
        ].map((s, i) => (
          <div key={i} className="bg-card rounded-xl border p-5 shadow-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
                <div className="text-xl font-bold">{s.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Students table */}
      <div className="bg-card rounded-xl border shadow-card">
        <div className="p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-bold">Students</h3>
          <div className="flex gap-2">
            <Input placeholder="Search students..." className="w-48" value={search} onChange={(e) => setSearch(e.target.value)} />
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1"><Plus className="h-3.5 w-3.5" /> Add</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add New Student</DialogTitle></DialogHeader>
                <div className="space-y-3 pt-2">
                  <Input placeholder="Full Name" />
                  <Input placeholder="Email" type="email" />
                  <Input placeholder="Phone" type="tel" />
                  <Input placeholder="Course (e.g. IIT JEE)" />
                  <Button className="w-full">Add Student</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Fees</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-xs">{s.id}</TableCell>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>{s.course}</TableCell>
                  <TableCell>{s.attendance}</TableCell>
                  <TableCell>
                    <Badge variant={s.fees === "Paid" ? "default" : s.fees === "Pending" ? "destructive" : "secondary"}>
                      {s.fees}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Courses summary */}
      <div className="mt-6 bg-card rounded-xl border shadow-card">
        <div className="p-5 border-b">
          <h3 className="font-bold">Courses</h3>
        </div>
        <div className="divide-y">
          {courses.map((c) => (
            <div key={c.id} className="p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm">{c.title}</div>
                <div className="text-xs text-muted-foreground">{c.classes} · {c.subtitle}</div>
              </div>
              <Button variant="outline" size="sm">Manage</Button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
