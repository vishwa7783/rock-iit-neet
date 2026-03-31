import { useEffect, useState } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { resolveApiError, enquiryService, type Course } from "@/services/api";
import { toast } from "sonner";

interface ContactSectionProps {
  courses: Course[];
  defaultCourse?: string;
}

const getDynamicBatchOptions = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // 0-indexed month: November is 10, December is 11. 
  // "after november it should show next year like after nov 2026 batches will be 2027 - 2028 and 2027 - 2029"
  const startYear = currentMonth > 10 ? currentYear + 1 : currentYear;

  return [
    `${startYear} - ${startYear + 1}`,
    `${startYear} - ${startYear + 2}`
  ];
};

const defaultBatchOptions = getDynamicBatchOptions();

export function ContactSection({ courses, defaultCourse }: ContactSectionProps) {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    class: "",
    course: defaultCourse || "",
    batch: defaultBatchOptions[0] || "",
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

    // Manual Validation for Mandatory Fields
    if (!form.name.trim()) newErrors.name = "Full Name is required";
    if (!form.phone.trim()) newErrors.phone = "Phone Number is required";
    if (!form.class) newErrors.class = "Class selection is required";
    if (!form.course) newErrors.course = "Course selection is required";
    if (!form.batch) newErrors.batch = "Batch selection is required";
    if (!form.schoolName.trim()) newErrors.schoolName = "School Name is required";

    // Phone Validation
    if (form.phone.trim()) {
      if (form.phone.length !== 10) {
        newErrors.phone = "Phone number must be 10 digits";
      } else if (form.phone.startsWith("0")) {
        newErrors.phone = "Invalid phone number";
      }
    }

    // Optional Parent Phone Validation (if provided)
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

      const interestedIn = `${form.course} - ${form.batch}`;

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
        batch: defaultBatchOptions[0] || "",
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
    <section id="contact" className="py-16">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Begin Your Path to Excellence</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Ready to conquer IIT-JEE or NEET? Fill out the form below to enquire about our upcoming batches, expert coaching, and personalized learning programs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <div className="bg-card rounded-xl border p-6 shadow-card space-y-6">
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
                <p className="text-sm text-muted-foreground">info@rockiitneet.in</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-card rounded-xl border p-6 shadow-card space-y-4">
            <div className="space-y-1">
              <Input
                placeholder="Full Name *"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-1">
              <Input
                placeholder="Phone Number *"
                type="tel"
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value.replace(/\D/g, "").slice(0, 10) })}
                className={errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
            </div>

            <div className="space-y-1">
              <Input
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
              />
            </div>

            <div className="space-y-1">
              <Input
                placeholder="School Name *"
                value={form.schoolName}
                onChange={(event) => setForm({ ...form, schoolName: event.target.value })}
                className={errors.schoolName ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.schoolName && <p className="text-xs text-destructive">{errors.schoolName}</p>}
            </div>

            <div className="space-y-1">
              <Select value={form.class} onValueChange={(value) => setForm({ ...form, class: value })}>
                <SelectTrigger className={errors.class ? "border-destructive focus:ring-destructive" : ""}>
                  <SelectValue placeholder="Class (In which you will go this year?) *" />
                </SelectTrigger>
                <SelectContent>
                  {["6th", "7th", "8th", "9th", "10th", "11th", "12th", "12th Passed"].map((cls) => (
                    <SelectItem key={cls} value={cls}>
                      {cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.class && <p className="text-xs text-destructive">{errors.class}</p>}
            </div>

            <div className="space-y-1">
              <Select value={form.course} onValueChange={(value) => setForm({ ...form, course: value })}>
                <SelectTrigger className={errors.course ? "border-destructive focus:ring-destructive" : ""}>
                  <SelectValue placeholder="Select course *" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.title}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.course && <p className="text-xs text-destructive">{errors.course}</p>}
            </div>
            <div className="space-y-1">
              <Input
                placeholder="Father/Mother Name"
                value={form.parentName}
                onChange={(event) => setForm({ ...form, parentName: event.target.value })}
              />
            </div>

            <div className="space-y-1">
              <Input
                placeholder="Father/Mother Phone number"
                type="tel"
                value={form.parentNumber}
                onChange={(event) => setForm({ ...form, parentNumber: event.target.value.replace(/\D/g, "").slice(0, 10) })}
                className={errors.parentNumber ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.parentNumber && <p className="text-xs text-destructive">{errors.parentNumber}</p>}
            </div>
            <div className="space-y-1">
              <Select value={form.batch} onValueChange={(value) => setForm({ ...form, batch: value })}>
                <SelectTrigger className={errors.batch ? "border-destructive focus:ring-destructive" : ""}>
                  <SelectValue placeholder="Select batch *" />
                </SelectTrigger>
                <SelectContent>
                  {defaultBatchOptions.map((batch) => (
                    <SelectItem key={batch} value={batch}>
                      {batch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.batch && <p className="text-xs text-destructive">{errors.batch}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Enquiry"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
