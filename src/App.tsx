import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Login from "./pages/Login.tsx";
import StudentDashboard from "./pages/student/Dashboard.tsx";
import AdminDashboard from "./pages/admin/Dashboard.tsx";
import EmployeeDashboard from "./pages/employee/Dashboard.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/courses" element={<StudentDashboard />} />
          <Route path="/student/attendance" element={<StudentDashboard />} />
          <Route path="/student/performance" element={<StudentDashboard />} />
          <Route path="/student/fees" element={<StudentDashboard />} />
          <Route path="/student/profile" element={<StudentDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/students" element={<AdminDashboard />} />
          <Route path="/admin/teachers" element={<AdminDashboard />} />
          <Route path="/admin/courses" element={<AdminDashboard />} />
          <Route path="/admin/fees" element={<AdminDashboard />} />
          <Route path="/admin/schedule" element={<AdminDashboard />} />
          <Route path="/admin/reports" element={<AdminDashboard />} />
          <Route path="/admin/enquiries" element={<AdminDashboard />} />
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          <Route path="/employee/classes" element={<EmployeeDashboard />} />
          <Route path="/employee/attendance" element={<EmployeeDashboard />} />
          <Route path="/employee/assignments" element={<EmployeeDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
