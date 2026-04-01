import { motion } from "framer-motion";
import { Star, Award, ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

interface HeroSectionProps {
  onEnroll?: () => void;
}

export function HeroSection({ onEnroll }: HeroSectionProps) {

  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 pb-16 hero-pattern overflow-hidden">
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-6"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-2 shadow-sm shadow-orange-100">
              <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span className="text-xs sm:text-sm font-bold text-orange-700 uppercase tracking-wider">4.7★ Rated on Google (109+ Reviews)</span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
              Achieve Top Ranks in{" "}
              <span className="gradient-text">IIT-JEE & NEET</span>{" "}
              with Proven Coaching
            </motion.h1>

            <motion.p variants={fadeUp} className="text-base sm:text-lg font-bold text-primary italic uppercase tracking-widest flex items-center gap-2">
              <span className="h-0.5 w-8 bg-primary"></span>
              ROCK - Result Oriented Class by KK Rai
            </motion.p>

            <motion.p variants={fadeUp} className="text-lg text-slate-600 max-w-xl leading-relaxed">
              Expert Faculty | Personal Attention | High-Impact Results — Your path to premier engineering and medical colleges starts here in Navi Mumbai.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button
                size="lg"
                onClick={onEnroll}
                className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 h-14 text-lg font-bold shadow-xl shadow-primary/30 animate-pulse-glow"
              >
                Enquire Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <a href="#courses">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 h-14 text-lg font-bold border-2 border-primary text-primary hover:bg-primary/5 transition-all shadow-lg shadow-primary/5"
                >
                  View Courses
                </Button>
              </a>
            </motion.div>


          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-6 -left-6 w-72 h-72 bg-primary/10 rounded-3xl -z-10 animate-fade-in" />
              <div className="absolute -bottom-6 -right-6 w-72 h-72 bg-blue-500/10 rounded-full -z-10 blur-3xl" />

              <div className="relative group overflow-hidden rounded-[2rem] shadow-2xl shadow-primary/20">
                <img
                  src="https://images.pexels.com/photos/3231359/pexels-photo-3231359.jpeg"
                  alt="Students Studying at ROCK"
                  className="w-full h-[540px] object-cover transform transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute -bottom-6 -right-6 bg-white p-5 rounded-2xl shadow-2xl border border-slate-100"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-900 leading-tight">500+</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Top Selections</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 -left-10 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-xl border border-white/50"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Play className="w-4 h-4 text-white fill-current translate-x-0.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 pr-2">Interactive Learning</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
