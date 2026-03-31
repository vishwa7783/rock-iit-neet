import { Users, UserCog, BookOpen, CreditCard } from "lucide-react";

const iconMap: Record<string, React.ElementType> = { Users, UserCog, BookOpen, CreditCard };

interface StatItem {
  label: string;
  value: string;
  icon: keyof typeof iconMap;
}

interface StatsSectionProps {
  stats: StatItem[];
}

export function StatsSection({ stats }: StatsSectionProps) {
  return (
    <section id="stats" className="py-8">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => {
            const Icon = iconMap[s.icon];
            return (
              <div key={i} className="bg-card rounded-xl border p-5 shadow-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <Icon className="h-7 w-7 mb-3 text-primary" />
                <div className="text-3xl font-extrabold">{s.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
