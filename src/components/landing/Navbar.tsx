import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "About", href: "/#about" },
  { label: "Courses", href: "/#courses" },
  { label: "Why Us", href: "/#why-us" },
  { label: "Testimonials", href: "/#testimonials" },
  { label: "Contact", href: "/#contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-white/80 backdrop-blur-md shadow-md py-2"
          : "bg-transparent py-4"
        }`}
    >
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl group">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <span className="text-primary font-extrabold tracking-tight">ROCK IIT NEET</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors relative group"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </a>
          ))}
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button
                variant="ghost"
                size="sm"
                className="font-bold text-slate-600 hover:text-primary hover:bg-primary/5"
              >
                Login
              </Button>
            </Link>
            <a href="/#contact">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 font-bold shadow-lg shadow-primary/20 animate-pulse-glow">
                Enquire
              </Button>
            </a>
          </div>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-slate-600" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-white p-4 shadow-xl overflow-hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-base font-semibold text-slate-600 hover:text-primary transition-colors"
                >
                  {l.label}
                </a>
              ))}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link to="/login" onClick={() => setOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full font-bold border-slate-200"
                  >
                    Login
                  </Button>
                </Link>
                <a href="/#contact" onClick={() => setOpen(false)}>
                  <Button className="w-full bg-primary font-bold">
                    Enquire
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
