import { motion } from "framer-motion";
import { Atom, Stethoscope, BookOpen, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Course } from "@/services/api";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

interface CoursesSectionProps {
  courses: Course[];
  onSelectCourse?: (courseTitle: string) => void;
}

export function CoursesSection({ courses, onSelectCourse }: CoursesSectionProps) {
  const getCourseColor = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("neet")) return "bg-orange-500";
    if (t.includes("iit") || t.includes("jee")) return "bg-blue-900";
    if (t.includes("foundation")) return "bg-indigo-600";
    if (t.includes("board")) return "bg-emerald-600";
    return "bg-slate-800";
  };

  const getCourseIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("neet")) return Stethoscope;
    if (t.includes("iit") || t.includes("jee")) return Atom;
    return BookOpen;
  };

  return (
    <section id="courses" className="py-20 bg-slate-50/50" data-testid="courses-section">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            Our Programs
          </div>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
            Educational <span className="text-primary italic">Pathways</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
            Comprehensive courses designed to help you achieve your academic goals and crack competitive exams.
          </motion.p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => {
            const Icon = getCourseIcon(course.title);
            const colorClass = getCourseColor(course.title);

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-[2rem] border border-slate-200/60 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/10 card-hover flex flex-col h-full"
                data-testid={`course-card-${course.id}`}
              >
                <div className={`p-8 ${colorClass} text-white relative overflow-hidden group`}>
                  {/* Decorative circle */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full group-hover:scale-110 transition-transform" />

                  <Icon className="w-12 h-12 mb-4 relative z-10" />
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-2">{course.targetClasses}</div>
                  <h3 className="text-2xl font-black leading-tight relative z-10">{course.title}</h3>
                  <p className="text-sm font-medium opacity-90 mt-2 relative z-10">{course.subtitle}</p>
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex-grow">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Course Highlights</h4>
                    <ul className="space-y-4 mb-8">
                      {(course.description || "").split("|").map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-600 text-sm font-medium leading-relaxed">{feature.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Duration</p>
                      <p className="text-sm font-bold text-slate-900">1-2 Years</p>
                    </div>
                    <Button
                      onClick={() => onSelectCourse?.(course.title)}
                      className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 font-bold shadow-lg shadow-primary/20"
                    >
                      Enquire
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
