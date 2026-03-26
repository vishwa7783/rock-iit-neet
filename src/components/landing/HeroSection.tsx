import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground mb-6 animate-fade-in">
          🏆 Trusted by 5,000+ students across Mumbai
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 animate-slide-up">
          Top Coaching Institute for{" "}
          <span className="text-gradient">IIT JEE, NEET</span>{" "}
          & Foundation{" "}
          <span className="text-muted-foreground text-3xl md:text-5xl">(Class 6–10)</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          Expert faculty, personalized learning, and a proven track record of 1,200+ IIT/NEET selections. 
          Your journey to success starts here.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <a href="#contact">
            <Button size="lg" className="gap-2 text-base px-8">
              Enroll Now <ArrowRight className="h-4 w-4" />
            </Button>
          </a>
          <a href="#courses">
            <Button variant="outline" size="lg" className="gap-2 text-base px-8">
              <Play className="h-4 w-4" /> Book Free Demo
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
