import { useState } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="contact" className="py-20 bg-muted/50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Get In Touch</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Have questions? Reach out to us or fill the form below</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold">Address</h4>
                <p className="text-sm text-muted-foreground">123 Education Lane, Andheri West, Mumbai 400058</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold">Phone</h4>
                <p className="text-sm text-muted-foreground">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold">Email</h4>
                <p className="text-sm text-muted-foreground">info@eduelite.in</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-card rounded-xl border p-6 shadow-card space-y-4">
            <Input placeholder="Full Name" required />
            <Input placeholder="Phone Number" type="tel" required />
            <Input placeholder="Email (optional)" type="email" />
            <Textarea placeholder="Your message or query..." rows={3} />
            <Button type="submit" className="w-full" disabled={submitted}>
              {submitted ? "✓ Submitted!" : "Send Enquiry"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
