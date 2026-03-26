import { GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t bg-card py-12">
      <div className="container">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg mb-3">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="text-gradient">EduElite</span>
            </div>
            <p className="text-sm text-muted-foreground">Mumbai's premier coaching institute for IIT JEE, NEET & Foundation courses.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Programs</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#courses" className="hover:text-primary transition-colors">IIT JEE Coaching</a></li>
              <li><a href="#courses" className="hover:text-primary transition-colors">NEET Coaching</a></li>
              <li><a href="#courses" className="hover:text-primary transition-colors">Foundation (6-10)</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#why-us" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#stats" className="hover:text-primary transition-colors">Results</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
              <li><Link to="/login" className="hover:text-primary transition-colors">Student Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Andheri West, Mumbai</li>
              <li>+91 98765 43210</li>
              <li>info@eduelite.in</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} EduElite. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
