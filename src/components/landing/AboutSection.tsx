import { motion } from "framer-motion";
import { Star, CheckCircle2 } from "lucide-react";

export function AboutSection() {
    return (
        <section id="about" className="py-20 overflow-hidden">
            <div className="container">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="relative">
                            {/* Decorative background for image */}
                            <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-primary/20 rounded-3xl -z-10" />

                            <img
                                src="https://lh3.googleusercontent.com/p/AF1QipPMcgIHLoHilK-otnXcSWZFl38vOwgwFOk-96Mr=s1600"
                                alt="ROCK IIT NEET Classroom"
                                className="rounded-3xl shadow-2xl w-full h-[450px] object-cover"
                            />

                            <div className="absolute -bottom-6 -left-6 bg-primary text-white p-6 rounded-2xl shadow-xl shadow-primary/30">
                                <p className="text-5xl font-black">10+</p>
                                <p className="text-sm font-bold opacity-90 uppercase tracking-widest">Years of Excellence</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                            Our Legacy
                        </div>

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
                            About <span className="text-primary italic">ROCK IIT NEET</span>
                        </h2>

                        <p className="text-lg text-slate-600 leading-relaxed font-medium">
                            Founded with a vision to provide quality coaching to students in Navi Mumbai,
                            ROCK IIT NEET has been shaping the future of aspiring engineers and doctors
                            for over a decade.
                        </p>

                        <p className="text-slate-600 leading-relaxed">
                            Our approach is simple yet effective — build strong fundamentals, nurture curiosity,
                            and provide personalized guidance to every student. We believe every student has the
                            potential to succeed, and our job is to unlock it through expert mentorship and result-oriented training.
                        </p>

                        <div className="flex items-center gap-6 pt-4">
                            <div className="flex items-center gap-1.5">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <div className="border-l border-slate-200 pl-6">
                                <p className="font-black text-slate-900 text-xl">4.7/5 on Google</p>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Based on 109+ reviews</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <div className="flex items-center gap-2 bg-slate-100/80 backdrop-blur-sm px-5 py-2.5 rounded-full border border-slate-200/60">
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                                <span className="text-sm font-bold text-slate-700">JustDial 4.5★ Rated</span>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-100/80 backdrop-blur-sm px-5 py-2.5 rounded-full border border-slate-200/60">
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                                <span className="text-sm font-bold text-slate-700">Sulekha Recommended</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
