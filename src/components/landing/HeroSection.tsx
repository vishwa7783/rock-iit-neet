import { ArrowRight, Play, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.png";

interface HeroSectionProps {
  onEnroll?: () => void;
}

export function HeroSection({ onEnroll }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-16 pb-12 md:pt-24 md:pb-20">
      {/* Background with Image and Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="Hero background"
          className="w-full h-full object-cover opacity-20 grayscale-[20%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/60" />
      </div>

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-start text-left space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full border bg-primary/5 px-4 py-1.5 text-sm font-semibold text-primary">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Trusted by 5,000+ Students Across Mumbai
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-black leading-[1.1] tracking-tight">
                Unlock Your Potential with <span className="text-primary italic">ROCK IIT-NEET</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                Experience India's most comprehensive coaching for IIT-JEE, NEET, and Foundation courses. Our expert faculty and structured curriculum empower you to achieve your academic dreams.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-5">
              <Button size="lg" className="rounded-full h-14 px-10 text-lg font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform" onClick={onEnroll}>
                Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <a href="#courses">
                <Button variant="outline" size="lg" className="rounded-full h-14 px-10 text-lg font-semibold hover:bg-muted/50 transition-colors">
                  <Play className="mr-2 h-5 w-5 fill-current" /> Explore Courses
                </Button>
              </a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4">
              {[
                "Expert Faculty",
                "Personalized Batches",
                "Live Doubt Solving"
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block relative animate-fade-in-right">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-400/20 rounded-2xl blur-2xl" />
            <div className="relative glass-morphism rounded-2xl border p-8 shadow-2xl space-y-6">
              {[
                { title: "Expert Faculty", desc: "Learn from top educators with years of experience." },
                { title: "Small Batches", desc: "Personalized attention ensuring better results." },
                { title: "Success Material", desc: "Comprehensive study guides and regular mock tests." },
              ].map((card, idx) => (
                <div key={card.title} className={`p-4 rounded-xl border bg-card/50 hover:bg-card transition-colors ${idx === 0 ? "border-primary/30" : ""}`}>
                  <h4 className="font-bold text-lg mb-1">{card.title}</h4>
                  <p className="text-sm text-muted-foreground">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
