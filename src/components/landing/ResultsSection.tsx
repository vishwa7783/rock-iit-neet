import { motion } from "framer-motion";
import { Star } from "lucide-react";

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const getAvatarInitials = (name: string) => {
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.toUpperCase();
};

const getAvatarColor = (name: string) => {
    const colors = [
        'bg-blue-500',
        'bg-green-500',
        'bg-purple-500',
        'bg-pink-500',
        'bg-indigo-500',
        'bg-orange-500'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
};

export function ResultsSection() {
    const testimonials = [
        {
            name: "Rahul Sharma",
            result: "AIR 2847 in JEE Advanced",
            quote: "The faculty at ROCK IITian's made complex concepts simple. Their dedication and personal attention helped me crack JEE."
        },
        {
            name: "Priya Patel",
            result: "NEET Score: 685/720",
            quote: "The systematic approach to NEET preparation and regular tests helped me improve consistently. Forever grateful!"
        },
        {
            name: "Amit Desai",
            result: "98.6% in 12th Boards",
            quote: "The integrated approach for boards and competitive exams saved my time and effort. Highly recommend!"
        }
    ];

    const stats = [
        { value: "500+", label: "Students Selected" },
        { value: "95%", label: "Success Rate" },
        { value: "50+", label: "IIT Selections" },
        { value: "100+", label: "Medical Seats" }
    ];

    return (
        <section id="results" className="py-20" data-testid="results-section">
            <div className="container">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            variants={fadeUp}
                            className="text-center p-8 bg-blue-900 text-white rounded-[2rem] shadow-xl shadow-blue-900/20"
                        >
                            <p className="text-4xl sm:text-5xl font-black mb-2">{stat.value}</p>
                            <p className="text-xs font-bold uppercase tracking-widest opacity-70">{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="text-center mb-14"
                >
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                        Testimonials
                    </div>
                    <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
                        Transformational <span className="text-primary italic">Outcomes</span>
                    </motion.h2>
                    <motion.p variants={fadeUp} className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
                        Our students' success stories speak for themselves. Join the league of high achievers.
                    </motion.p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-8 rounded-[2rem] border border-slate-200/60 shadow-sm hover:shadow-2xl hover:shadow-primary/5 card-hover group"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg ${getAvatarColor(item.name)} group-hover:scale-110 transition-transform`}>
                                    {getAvatarInitials(item.name)}
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 text-lg">{item.name}</h4>
                                    <p className="text-sm text-primary font-bold uppercase tracking-wider">{item.result}</p>
                                </div>
                            </div>
                            <p className="text-slate-600 italic font-medium leading-relaxed mb-6">"{item.quote}"</p>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
