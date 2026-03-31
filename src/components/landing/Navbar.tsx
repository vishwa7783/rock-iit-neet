import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Courses", href: "#courses" },
  { label: "Why Us", href: "#why-us" },
  { label: "Results", href: "#stats" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <GraduationCap className="h-7 w-7 text-sidebar-primary" />
          <span>Rock IIT NEET</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm font-medium text-sidebar-foreground/75 hover:text-sidebar-foreground transition-colors"
            >
              {l.label}
            </a>
          ))}
          <Link to="/login">
            <Button
              variant="outline"
              size="sm"
              className="border-sidebar-border bg-transparent text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              Login
            </Button>
          </Link>
          <a href="#contact">
            <Button size="sm" className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90">
              Enroll Now
            </Button>
          </a>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-sidebar-foreground" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-sidebar-border bg-sidebar p-4 animate-fade-in">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm font-medium text-sidebar-foreground/75 hover:text-sidebar-foreground"
            >
              {l.label}
            </a>
          ))}
          <div className="flex gap-2 mt-3">
            <Link to="/login">
              <Button
                variant="outline"
                size="sm"
                className="border-sidebar-border bg-transparent text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
              >
                Login
              </Button>
            </Link>
            <a href="#contact">
              <Button size="sm" className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90">
                Enroll Now
              </Button>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
