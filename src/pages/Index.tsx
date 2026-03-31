import { useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { CoursesSection } from "@/components/landing/CoursesSection";
import { WhyChooseUsSection } from "@/components/landing/WhyChooseUsSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { ContactSection } from "@/components/landing/ContactSection";
import { Footer } from "@/components/landing/Footer";
import { courseService, resolveApiError, studentService, teacherService, type Course } from "@/services/api";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    activeCourses: 0,
    revenue: "0",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [coursesData, statsData, teachers] = await Promise.all([
          courseService.getAll(),
          studentService.getAdminStats(),
          teacherService.getAll(),
        ]);

        setCourses(coursesData);
        setSelectedCourse(coursesData[0]?.title || "");
        setStats({
          totalStudents: statsData.totalStudents,
          totalTeachers: statsData.totalTeachers || teachers.length,
          activeCourses: statsData.activeCourses,
          revenue: statsData.revenue,
        });
      } catch (error) {
        toast.error(resolveApiError(error));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const statCards = useMemo(
    () => [
      { label: "Students Enrolled", value: stats.totalStudents.toLocaleString(), icon: "Users" as const },
      { label: "Faculty Members", value: stats.totalTeachers.toString(), icon: "UserCog" as const },
      { label: "Active Courses", value: stats.activeCourses.toString(), icon: "BookOpen" as const },
      { label: "Revenue Snapshot", value: stats.revenue, icon: "CreditCard" as const },
    ],
    [stats],
  );

  const scrollToContact = (courseTitle?: string) => {
    if (courseTitle) {
      setSelectedCourse(courseTitle);
    }

    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <HeroSection onEnroll={() => scrollToContact()} />
      {loading ? (
        <div className="container py-20 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <StatsSection stats={statCards} />
          <CoursesSection courses={courses} onSelectCourse={scrollToContact} />
        </>
      )}
      <WhyChooseUsSection />
      <TestimonialsSection />
      <ContactSection courses={courses} defaultCourse={selectedCourse} />
      <Footer />
    </div>
  );
};

export default Index;
