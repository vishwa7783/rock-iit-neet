import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { resolveApiError, enquiryService, type Course } from "@/services/api";
import { toast } from "sonner";

interface ContactSectionProps {
  courses: Course[];
  defaultCourse?: string;
}

export function ContactSection({ courses, defaultCourse }: ContactSectionProps) {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    class: "",
    course: defaultCourse || "",
    parentName: "",
    parentNumber: "",
    schoolName: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!defaultCourse) return;
    setForm((current) => ({ ...current, course: defaultCourse }));
  }, [defaultCourse]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = "Full Name is required";
    if (!form.phone.trim()) newErrors.phone = "Phone Number is required";
    if (!form.class) newErrors.class = "Class selection is required";
    if (!form.course) newErrors.course = "Course selection is required";
    if (!form.schoolName.trim()) newErrors.schoolName = "School Name is required";

    if (form.phone.trim()) {
      if (form.phone.length !== 10) {
        newErrors.phone = "Phone number must be 10 digits";
      } else if (form.phone.startsWith("0")) {
        newErrors.phone = "Invalid phone number";
      }
    }

    if (form.parentNumber.trim()) {
      if (form.parentNumber.length !== 10) {
        newErrors.parentNumber = "Phone number must be 10 digits";
      } else if (form.parentNumber.startsWith("0")) {
        newErrors.parentNumber = "Invalid phone number";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill all mandatory fields");
      return;
    }

    setErrors({});

    try {
      setSubmitting(true);
      const interestedIn = form.course;

      await enquiryService.create({
        name: form.name,
        phone: form.phone,
        email: form.email || `${form.phone}@rockiitneet.local`,
        interestedIn: interestedIn,
        grade: form.class,
        parentName: form.parentName,
        parentNumber: form.parentNumber,
        schoolName: form.schoolName,
      });

      toast.success("Enquiry submitted successfully!");
      setForm({
        name: "",
        phone: "",
        email: "",
        class: "",
        course: defaultCourse || courses[0]?.title || "",
        parentName: "",
        parentNumber: "",
        schoolName: "",
      });
    } catch (error) {
      toast.error(resolveApiError(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-white overflow-hidden" data-testid="contact-section">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-12"
          >
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                Enquire Now
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight mb-6">
                Ready to <span className="text-primary italic">Transform</span> Your Career?
              </h2>
              <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-xl">
                Take the first step towards your dream engineering or medical seat. Complete the form, and our academic experts will get in touch to guide you.
              </p>
            </div>

            <div className="space-y-8">
              <a
                href="https://maps.app.goo.gl/sS9B1jU4s5B5kLjz9"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-6 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all shadow-sm">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Visit Our Center</h4>
                  <p className="text-slate-600 font-medium">A-81/33, ROCK TOWER, Sector 12, Kharghar, Panvel, Maharashtra 410210</p>
                  <span className="text-xs font-black text-primary uppercase tracking-[0.2em] mt-2 block">Open Directions →</span>
                </div>
              </a>

              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Call Us</h4>
                  <p className="text-2xl font-black text-slate-900 leading-none mt-1">9820297938</p>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2">Available 9:00 AM - 8:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Email Us</h4>
                  <p className="text-xl font-black text-slate-900 mt-1">info@rockiitneet.in</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-[2.5rem] border border-slate-200/60 p-8 sm:p-10 shadow-2xl shadow-primary/5"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Student Name *</label>
                    <Input
                      placeholder="Enter full name"
                      value={form.name}
                      onChange={(event) => setForm({ ...form, name: event.target.value })}
                      className={`h-12 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white transition-all ${errors.name ? "border-destructive ring-destructive" : ""}`}
                    />
                    {errors.name && <p className="text-[10px] font-bold text-destructive pl-1 uppercase tracking-wider">{errors.name}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Student Mobile *</label>
                    <Input
                      placeholder="10 digit number"
                      type="tel"
                      value={form.phone}
                      onChange={(event) => setForm({ ...form, phone: event.target.value.replace(/\D/g, "").slice(0, 10) })}
                      className={`h-12 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white transition-all ${errors.phone ? "border-destructive ring-destructive" : ""}`}
                    />
                    {errors.phone && <p className="text-[10px] font-bold text-destructive pl-1 uppercase tracking-wider">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Target Class *</label>
                    <Select value={form.class} onValueChange={(value) => setForm({ ...form, class: value })}>
                      <SelectTrigger className={`h-12 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white transition-all ${errors.class ? "border-destructive ring-destructive" : ""}`}>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {["6th", "7th", "8th", "9th", "10th", "11th", "12th", "12th Passed"].map((cls) => (
                          <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Target Course *</label>
                    <Select value={form.course} onValueChange={(value) => setForm({ ...form, course: value })}>
                      <SelectTrigger className={`h-12 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white transition-all ${errors.course ? "border-destructive ring-destructive" : ""}`}>
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.title}>{course.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">School Name *</label>
                  <Input
                    placeholder="Current school / college name"
                    value={form.schoolName}
                    onChange={(event) => setForm({ ...form, schoolName: event.target.value })}
                    className={`h-12 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white transition-all ${errors.schoolName ? "border-destructive ring-destructive" : ""}`}
                  />
                  {errors.schoolName && <p className="text-[10px] font-bold text-destructive pl-1 uppercase tracking-wider">{errors.schoolName}</p>}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Father/Mother Name</label>
                    <Input
                      placeholder="Parent's full name"
                      value={form.parentName}
                      onChange={(event) => setForm({ ...form, parentName: event.target.value })}
                      className="h-12 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Parent Mobile</label>
                    <Input
                      placeholder="10 digit number"
                      type="tel"
                      value={form.parentNumber}
                      onChange={(event) => setForm({ ...form, parentNumber: event.target.value.replace(/\D/g, "").slice(0, 10) })}
                      className={`h-12 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white transition-all ${errors.parentNumber ? "border-destructive ring-destructive" : ""}`}
                    />
                    {errors.parentNumber && <p className="text-[10px] font-bold text-destructive pl-1 uppercase tracking-wider">{errors.parentNumber}</p>}
                  </div>
                </div>



                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full h-14 rounded-xl bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-95"
                    disabled={submitting}
                  >
                    {submitting ? "Processing..." : "Submit Enquiry"}
                    {!submitting && <Send className="w-5 h-5 ml-2" />}
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-2 pt-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fast Response Guaranteed</p>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
