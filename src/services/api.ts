// API Service Layer - Prepared for future backend integration
// Replace dummy implementations with actual API calls when backend is ready

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}

// Auth
export const authService = {
  sendOtp: async (_phone: string) => ({ success: true, message: "OTP sent" }),
  verifyOtp: async (_phone: string, _otp: string) => ({ success: true, token: "dummy-token", role: "student" }),
  logout: async () => ({ success: true }),
};

// Students
export const studentService = {
  getAll: async () => request("/students"),
  getById: async (id: string) => request(`/students/${id}`),
  create: async (data: unknown) => request("/students", { method: "POST", body: JSON.stringify(data) }),
  update: async (id: string, data: unknown) => request(`/students/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: async (id: string) => request(`/students/${id}`, { method: "DELETE" }),
};

// Courses
export const courseService = {
  getAll: async () => request("/courses"),
  getById: async (id: string) => request(`/courses/${id}`),
};

// Attendance
export const attendanceService = {
  mark: async (classId: string, data: unknown) => request(`/attendance/${classId}`, { method: "POST", body: JSON.stringify(data) }),
  getByClass: async (classId: string) => request(`/attendance/${classId}`),
};

// Dashboard
export const dashboardService = {
  getStudentDashboard: async () => request("/dashboard/student"),
  getAdminDashboard: async () => request("/dashboard/admin"),
  getTeacherDashboard: async () => request("/dashboard/teacher"),
};
