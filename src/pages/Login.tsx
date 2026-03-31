import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Phone, Shield, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { resolveApiError, setSession, studentService, teacherService, type Student, type Teacher } from "@/services/api";

const DEMO_OTP = "123456";

type MatchedUser =
  | { role: "student"; user: Student }
  | { role: "teacher"; user: Teacher };

const Login = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [matchedUser, setMatchedUser] = useState<MatchedUser | null>(null);

  const handleSendOtp = async () => {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const [students, teachers] = await Promise.all([studentService.getAll(), teacherService.getAll()]);
      const student = students.find((item) => item.phone === phone);
      const teacher = teachers.find((item) => item.phone === phone);

      if (student) {
        setMatchedUser({ role: "student", user: student });
        setOtpSent(true);
        return;
      }

      if (teacher) {
        setMatchedUser({ role: "teacher", user: teacher });
        setOtpSent(true);
        return;
      }

      setError("No student or teacher account exists for this mobile number");
    } catch (requestError) {
      setError(resolveApiError(requestError));
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = () => {
    if (otp !== DEMO_OTP) {
      setError("Enter the demo OTP 123456 to continue");
      return;
    }

    if (!matchedUser) {
      setError("Please restart login and try again");
      return;
    }

    if (matchedUser.role === "student") {
      setSession({
        role: "student",
        userId: matchedUser.user.id,
        userName: matchedUser.user.name,
        userRoleLabel: `Student · ${matchedUser.user.course}`,
        phone: matchedUser.user.phone,
        batch: matchedUser.user.batch,
        course: matchedUser.user.course,
      });
      navigate("/student/dashboard");
      return;
    }

    setSession({
      role: "teacher",
      userId: matchedUser.user.id,
      userName: matchedUser.user.name,
      userRoleLabel: matchedUser.user.role,
      phone: matchedUser.user.phone,
    });
    navigate("/employee/dashboard");
  };

  const continueAsAdmin = () => {
    setSession({
      role: "admin",
      userName: "Admin User",
      userRoleLabel: "Administrator",
    });
    navigate("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.08),transparent_35%),radial-gradient(circle_at_bottom_right,hsl(var(--secondary)/0.08),transparent_30%)]" />

      <div className="border-b bg-card/90 backdrop-blur">
        <div className="container flex h-16 items-center">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-lg">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span>Rock IIT NEET</span>
          </Link>
        </div>
      </div>

      <div className="container py-10 lg:py-16">
        <div className="grid lg:grid-cols-[1.1fr_440px] gap-8 items-start">
          <div className="bg-card rounded-xl border shadow-card p-8 lg:p-10">
            <div className="inline-flex items-center gap-2 rounded-md border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              Admin-style access panel
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mt-5">One clean access point for students, teachers, and admin.</h1>
            <p className="text-muted-foreground mt-4 max-w-2xl">
              The login flow uses the same structured card layout and muted admin styling so it feels consistent with the dashboard experience.
            </p>

            <div className="grid sm:grid-cols-3 gap-4 mt-8">
              {[
                { label: "Student Login", value: "Live lookup" },
                { label: "Teacher Login", value: "Live lookup" },
                { label: "Admin Access", value: "Direct entry" },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border bg-muted/40 p-4">
                  <div className="text-sm text-muted-foreground">{item.label}</div>
                  <div className="text-lg font-semibold mt-1">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-xl border p-8 shadow-card space-y-4">
            <div className="mb-2">
              <h2 className="text-2xl font-bold">Portal Login</h2>
              <p className="text-sm text-muted-foreground mt-1">Login with a mobile number that exists in the backend.</p>
            </div>
            {!otpSent ? (
              <>
                <div>
                  <label className="text-sm font-medium mb-2 block">Mobile Number</label>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1.5 px-3 border rounded-md bg-muted text-sm font-medium shrink-0">
                      <Phone className="h-3.5 w-3.5" /> +91
                    </div>
                    <Input
                      placeholder="Enter 10-digit number"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))}
                      type="tel"
                    />
                  </div>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button className="w-full" onClick={handleSendOtp} disabled={loading}>
                  {loading ? "Checking account..." : "Send OTP"}
                </Button>
                <Button type="button" variant="outline" className="w-full gap-2" onClick={continueAsAdmin}>
                  <UserCog className="h-4 w-4" /> Continue as Admin
                </Button>
              </>
            ) : (
              <>
                <div className="text-center rounded-lg border bg-muted/40 p-4">
                  <Shield className="h-10 w-10 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">OTP prepared for +91 {phone}</p>
                  <p className="text-xs text-muted-foreground mt-1">Demo OTP: {DEMO_OTP}</p>
                  <button onClick={() => setOtpSent(false)} className="text-xs text-primary hover:underline mt-2">
                    Change number
                  </button>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block text-center">Enter OTP</label>
                  <div className="flex justify-center">
                    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                      <InputOTPGroup>
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                          <InputOTPSlot key={index} index={index} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>
                {matchedUser && (
                  <p className="text-center text-xs text-muted-foreground">
                    Signing in as {matchedUser.user.name} ({matchedUser.role})
                  </p>
                )}
                {error && <p className="text-sm text-destructive text-center">{error}</p>}
                <Button className="w-full" onClick={handleVerify} disabled={loading}>
                  Verify & Login
                </Button>
              </>
            )}

            <p className="text-center text-xs text-muted-foreground pt-2">
              <Link to="/" className="hover:text-primary transition-colors">← Back to Homepage</Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
