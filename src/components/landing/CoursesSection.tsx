import { Atom, Stethoscope, BookOpen, ArrowRight } from "lucide-react";
import { courses } from "@/data/dummy";

const iconMap: Record<string, React.ElementType> = { Atom, Stethoscope, BookOpen };

export function CoursesSection() {
  return (
    <section id="courses" className="py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Our Programs</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Choose the program that best fits your academic goals</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {courses.map((c, i) => {
            const Icon = iconMap[c.icon];
            return (
              <div
                key={c.id}
                className="group relative bg-card rounded-xl border p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 animate-slide-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">{c.classes}</div>
                <h3 className="text-xl font-bold mb-1">{c.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{c.description}</p>
                <a href="#contact" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all">
                  Learn More <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
