import { motion } from "framer-motion";
import { Users, Target, BookOpen, Award, Clock, FileText } from "lucide-react";

const values = [
  { icon: Users, title: "Experienced Faculty", desc: "IIT/NIT alumni with 10+ years of teaching experience" },
  { icon: Target, title: "Small Batch Size", desc: "Maximum 25 students per batch for personal attention" },
  { icon: BookOpen, title: "Concept-Driven Learning", desc: "Focus on understanding over rote memorization" },
  { icon: Clock, title: "Regular Doubt Sessions", desc: "Daily doubt clearing with dedicated mentors" },
  { icon: Award, title: "Proven Track Record", desc: "Consistent top ranks in JEE & NEET every year" },
  { icon: FileText, title: "Quality Study Material", desc: "Comprehensive notes and 5000+ practice problems" }
];

export function WhyChooseUsSection() {
  return (
    <section id="why-us" className="py-20 bg-slate-50/50" data-testid="why-choose-section">
      <div className="container overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            Our Advantage
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
            Why Choose <span className="text-primary italic">ROCK IIT NEET?</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
            We don't just teach — we mentor, guide, and transform students into high-performing achievers.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-primary/5 card-hover group"
            >
              <div className="value-icon mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed text-sm font-medium">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
