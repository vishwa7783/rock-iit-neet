import { motion } from "framer-motion";
import { FileText, Target, Users, Award } from "lucide-react";

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export function StudentBenefits() {
    const benefits = [
        { icon: FileText, title: "Comprehensive Study Material", desc: "Detailed notes, formula sheets, and topic-wise compilations crafted by KK Rai." },
        { icon: Target, title: "Weekly Mock Tests", desc: "Regular assessments with detailed performance analysis and error correction." },
        { icon: Users, title: "Doubt Clearing Sessions", desc: "Daily sessions with dedicated mentors to ensure no student is left behind." },
        { icon: Award, title: "Performance Tracking", desc: "Regular progress reports and personal counseling for career guidance." }
    ];

    return (
        <section className="py-20 bg-slate-900 text-white overflow-hidden" data-testid="benefits-section">
            <div className="container">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                        Student Experience
                    </div>
                    <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-black mb-4">
                        What <span className="text-primary italic">Students Get</span>
                    </motion.h2>
                    <motion.p variants={fadeUp} className="text-lg opacity-70 max-w-2xl mx-auto font-medium">
                        Everything you need to succeed in your academic journey and secure your future.
                    </motion.p>
                </motion.div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {benefits.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/5 backdrop-blur-sm p-8 rounded-[2rem] border border-white/10 hover:bg-white/10 transition-all card-hover group text-center"
                        >
                            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-primary/10">
                                <item.icon className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                            <p className="text-sm opacity-60 leading-relaxed font-medium">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
