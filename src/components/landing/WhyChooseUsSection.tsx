import { GraduationCap, UserCheck, ClipboardCheck, FileText, MessageCircle, Star } from "lucide-react";
import { whyChooseUs } from "@/data/dummy";

const iconMap: Record<string, React.ElementType> = { GraduationCap, UserCheck, ClipboardCheck, FileText, MessageCircle, Star };

export function WhyChooseUsSection() {
  return (
    <section id="why-us" className="py-20 bg-muted/50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Why Choose <span className="text-gradient">EduElite?</span></h2>
          <p className="text-muted-foreground max-w-xl mx-auto">What sets us apart from the rest</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyChooseUs.map((item, i) => {
            const Icon = iconMap[item.icon];
            return (
              <div
                key={i}
                className="bg-card rounded-xl border p-6 shadow-card hover:shadow-card-hover transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-secondary/10 text-secondary mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
