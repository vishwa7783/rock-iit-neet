import { useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { WhyChooseUsSection } from "@/components/landing/WhyChooseUsSection";
import { CoursesSection } from "@/components/landing/CoursesSection";
import { ResultsSection } from "@/components/landing/ResultsSection";
import { StudentBenefits } from "@/components/landing/StudentBenefits";
import { ContactSection } from "@/components/landing/ContactSection";
import { Footer } from "@/components/landing/Footer";
import { courseService, resolveApiError, type Course } from "@/services/api";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const coursesData = await courseService.getAll();
        setCourses(coursesData);
        setSelectedCourse(coursesData[0]?.title || "");
      } catch (error) {
        toast.error(resolveApiError(error));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const scrollToContact = (courseTitle?: string) => {
    if (courseTitle) {
      setSelectedCourse(courseTitle);
    }

    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection onEnroll={() => scrollToContact()} />
      <AboutSection />
      <WhyChooseUsSection />
      {loading ? (
        <div className="container py-20 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        <CoursesSection courses={courses} onSelectCourse={scrollToContact} />
      )}
      <ResultsSection />
      <StudentBenefits />
      <ContactSection courses={courses} defaultCourse={selectedCourse} />
      <Footer />
    </div>
  );
};

export default Index;
