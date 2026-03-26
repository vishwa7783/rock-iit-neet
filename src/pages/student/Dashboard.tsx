import { LayoutDashboard, BookOpen, UserCheck, BarChart3, CreditCard, User, Clock, CheckCircle, TrendingUp } from "lucide-react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { upcomingClasses, testScores } from "@/data/dummy";
import { Progress } from "@/components/ui/progress";

const navItems = [
  { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
  { label: "My Courses", href: "/student/courses", icon: BookOpen },
  { label: "Attendance", href: "/student/attendance", icon: UserCheck },
  { label: "Performance", href: "/student/performance", icon: BarChart3 },
  { label: "Fees", href: "/student/fees", icon: CreditCard },
  { label: "Profile", href: "/student/profile", icon: User },
];

const StudentDashboard = () => {
  return (
    <DashboardLayout navItems={navItems} title="Dashboard" userName="Aarav Sharma" userRole="Student · IIT JEE">
      {/* Overview cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-card rounded-xl border p-5 shadow-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Upcoming Classes</div>
              <div className="text-2xl font-bold">3</div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Next: Physics at 10:00 AM</p>
        </div>

        <div className="bg-card rounded-xl border p-5 shadow-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Attendance</div>
              <div className="text-2xl font-bold">92%</div>
            </div>
          </div>
          <Progress value={92} className="h-2" />
        </div>

        <div className="bg-card rounded-xl border p-5 shadow-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent-foreground flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Avg. Score</div>
              <div className="text-2xl font-bold">84%</div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">+5% from last month</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Classes */}
        <div className="bg-card rounded-xl border shadow-card">
          <div className="p-5 border-b">
            <h3 className="font-bold">Upcoming Classes</h3>
          </div>
          <div className="divide-y">
            {upcomingClasses.map((c, i) => (
              <div key={i} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm">{c.subject}</div>
                  <div className="text-xs text-muted-foreground">{c.topic} · {c.teacher}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{c.time}</div>
                  <div className="text-xs text-muted-foreground">{c.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Test Scores */}
        <div className="bg-card rounded-xl border shadow-card">
          <div className="p-5 border-b">
            <h3 className="font-bold">Recent Test Scores</h3>
          </div>
          <div className="divide-y">
            {testScores.map((t, i) => (
              <div key={i} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm">{t.subject}</div>
                  <div className="text-xs text-muted-foreground">{t.date}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">{t.score}/{t.total}</div>
                  <Progress value={t.score} className="h-1.5 w-20 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
