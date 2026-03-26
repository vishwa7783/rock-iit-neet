import { Users, Trophy, TrendingUp, Award } from "lucide-react";
import { stats } from "@/data/dummy";

const iconMap: Record<string, React.ElementType> = { Users, Trophy, TrendingUp, Award };

export function StatsSection() {
  return (
    <section id="stats" className="py-16 bg-hero-gradient">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => {
            const Icon = iconMap[s.icon];
            return (
              <div key={i} className="text-center animate-count-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <Icon className="h-8 w-8 mx-auto mb-3 text-primary-foreground/80" />
                <div className="text-3xl md:text-4xl font-extrabold text-primary-foreground">{s.value}</div>
                <div className="text-sm text-primary-foreground/70 mt-1">{s.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
