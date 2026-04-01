export const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
};

export type FeesStatus = "PAID" | "PENDING" | "PARTIAL";
export type AttendanceStatus = "PRESENT" | "ABSENT";
export type SessionRole = "student" | "teacher" | "admin";

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  courseId: number;
  batchId: number;
  attendancePercentage: number | null;
  parentName?: string;
  parentPhoneNumber?: string;
  course?: {
    title: string;
    subtitle: string;
    description: string | null;
    targetClasses: string;
    createdAt?: string;
  };
  batch?: {
    name: string;
    startDate: string;
    endDate: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface StudentPayload {
  name: string;
  email: string;
  phone: string;
  courseId: number;
  batchId: number;
  attendancePercentage: number;
  parentName?: string;
  parentPhoneNumber?: string;
}

export interface Teacher {
  id: string;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherPayload {
  name: string;
  phone: string;
  email: string;
}

export interface Course {
  id: number;
  title: string;
  subtitle: string;
  description: string | null;
  targetClasses: string;
  createdAt: string;
  updatedAt: string;
}

export interface CoursePayload {
  title: string;
  subtitle: string;
  description: string;
  targetClasses: string;
}

export interface ClassSchedule {
  id: number;
  subject: string;
  topic: string;
  date: string;
  time: string;
  teacherId: string;
  teacherName: string;
  batchId: number;
  room: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClassSchedulePayload {
  subject: string;
  topic: string;
  date: string;
  time: string;
  teacherId: string;
  batchId: number;
  room: string;
}

export interface AttendanceRecord {
  id: number;
  studentId: string;
  studentName: string;
  classScheduleId: number;
  subject: string;
  status: AttendanceStatus;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendancePayload {
  studentId: string;
  classScheduleId: number;
  status: AttendanceStatus;
  date: string;
}

export interface TestScore {
  id: number;
  studentId: string;
  studentName: string;
  subject: string;
  score: number;
  total: number;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface TestScorePayload {
  studentId: string;
  subject: string;
  score: number;
  total: number;
  date: string;
}

export interface AdminStats {
  totalStudents: number;
  totalTeachers: number;
  activeCourses: number;
  revenue: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  interestedIn?: string;
  schoolName?: string;
  grade?: string;
  parentName?: string;
  parentPhoneNumber?: string;
  status: string;
  reason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnquiryPayload {
  name: string;
  email: string;
  phone: string;
  interestedIn?: string;
  schoolName?: string;
  grade?: string;
  parentName?: string;
  parentNumber?: string;
  status?: string;
  reason?: string;
}

export interface AppSession {
  role: SessionRole;
  userId?: string;
  userName: string;
  userRoleLabel: string;
  phone?: string;
  batch?: string;
  course?: string;
}

const SESSION_KEY = "rock-app-session";

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  let json: ApiResponse<T> | undefined;
  try {
    json = await response.json();
  } catch {
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
  }

  if (!response.ok) {
    throw new Error(json?.message || `API error: ${response.status}`);
  }

  return json?.data as T;
}

function hasWindow() {
  return typeof window !== "undefined";
}

export function getSession(): AppSession | null {
  if (!hasWindow()) return null;

  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AppSession) : null;
  } catch {
    return null;
  }
}

export function setSession(session: AppSession) {
  if (!hasWindow()) return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  if (!hasWindow()) return;
  window.localStorage.removeItem(SESSION_KEY);
}

export function resolveApiError(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

export const authService = {
  logout: async () => {
    clearSession();
    return { success: true };
  },
};

export const studentService = {
  getAll: () => request<Student[]>("/students"),
  getById: (id: string) => request<Student>(`/students/${id}`),
  create: (data: StudentPayload) => request<Student>("/students", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: StudentPayload) =>
    request<Student>(`/students/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`/students/${id}`, { method: "DELETE" }),
  getAdminStats: () => request<AdminStats>("/students/admin/stats"),
};

export const teacherService = {
  getAll: () => request<Teacher[]>("/teachers"),
  getById: (id: string) => request<Teacher>(`/teachers/${id}`),
  create: (data: TeacherPayload) => request<Teacher>("/teachers", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: TeacherPayload) =>
    request<Teacher>(`/teachers/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`/teachers/${id}`, { method: "DELETE" }),
};

export const courseService = {
  getAll: () => request<Course[]>("/courses"),
  getById: (id: number) => request<Course>(`/courses/${id}`),
  create: (data: CoursePayload) => request<Course>("/courses", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: CoursePayload) =>
    request<Course>(`/courses/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/courses/${id}`, { method: "DELETE" }),
};

export const scheduleService = {
  getAll: () => request<ClassSchedule[]>("/schedules"),
  getByBatch: (batchId: number) => request<ClassSchedule[]>(`/schedules/batch/${batchId}`),
  getByTeacher: (teacherId: string) => request<ClassSchedule[]>(`/schedules/teacher/${teacherId}`),
  getById: (id: number) => request<ClassSchedule>(`/schedules/${id}`),
  create: (data: ClassSchedulePayload) =>
    request<ClassSchedule>("/schedules", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: ClassSchedulePayload) =>
    request<ClassSchedule>(`/schedules/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/schedules/${id}`, { method: "DELETE" }),
};

export const attendanceService = {
  mark: (data: AttendancePayload) =>
    request<AttendanceRecord>("/attendances", { method: "POST", body: JSON.stringify(data) }),
  getByStudent: (studentId: string) => request<AttendanceRecord[]>(`/attendances/student/${studentId}`),
  getByClass: (classId: number) => request<AttendanceRecord[]>(`/attendances/class/${classId}`),
};

export const testScoreService = {
  getByStudent: (studentId: string) => request<TestScore[]>(`/test-scores/student/${studentId}`),
  create: (data: TestScorePayload) =>
    request<TestScore>("/test-scores", { method: "POST", body: JSON.stringify(data) }),
};

export const enquiryService = {
  create: (data: EnquiryPayload) =>
    request<Enquiry>("/enquiries", { method: "POST", body: JSON.stringify(data) }),
  getEnquiries: (statuses?: string[]) => {
    const qs = statuses && statuses.length ? `?statuses=${statuses.join(",")}` : "";
    return request<Enquiry[]>(`/enquiries${qs}`);
  },
  getAllActive: () => {
    return request<Enquiry[]>("/enquiries?statuses=active,Active,pending,Pending,new,New");
  },
  updateStatus: (id: string, status: string, reason: string = "") =>
    request<Enquiry>(`/enquiries/${id}`, { method: "PUT", body: JSON.stringify({ status, reason }) }),
};
