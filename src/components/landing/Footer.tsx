import { GraduationCap, MapPin, Phone, Mail, Instagram, Facebook, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-20 pb-10 border-t border-white/5 overflow-hidden">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight italic">ROCK IIT NEET</span>
            </Link>
            <p className="text-slate-400 font-medium leading-relaxed">
              Mumbai's most trusted coaching institute for medical and engineering entrance exams.
              Result oriented coaching by KK Rai.
            </p>
            <div className="flex items-center gap-4">
              {[Instagram, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:text-white hover:scale-110 transition-all group">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-sm mb-6">Our Courses</h4>
            <ul className="space-y-4">
              {["IIT-JEE Mains & Advanced", "NEET (Medical)", "MHT-CET Coaching", "Foundation (8th-10th)", "School Boards (6th-12th)"].map((item) => (
                <li key={item}>
                  <a href="/#courses" className="text-slate-400 hover:text-primary font-medium transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-sm mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {[
                { label: "About Academy", href: "/#about" },
                { label: "Why Choose Us", href: "/#why-us" },
                { label: "Success Stories", href: "/#results" },
                { label: "Contact Us", href: "/#contact" },
                { label: "Student Portal", href: "/login" },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-slate-400 hover:text-primary font-medium transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-sm mb-6">Visit Us</h4>
            <div className="space-y-6">
              <a
                href="https://maps.app.goo.gl/sS9B1jU4s5B5kLjz9"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 group"
              >
                <MapPin className="w-5 h-5 text-primary mt-1 group-hover:scale-110 transition-transform" />
                <p className="text-slate-400 font-medium leading-relaxed">
                  A-81/33, ROCK TOWER, Sector 12, Kharghar, Panvel, Maharashtra 410210
                </p>
              </a>
              <div className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-primary" />
                <p className="text-slate-200 font-black text-lg">9820297938</p>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-primary" />
                <p className="text-slate-400 font-medium italic">info@rockiitneet.in</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
            © {new Date().getFullYear()} ROCK IIT NEET. Proudly shaping futures.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-xs font-bold text-slate-500 hover:text-primary uppercase tracking-widest">Privacy Policy</a>
            <a href="#" className="text-xs font-bold text-slate-500 hover:text-primary uppercase tracking-widest">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
