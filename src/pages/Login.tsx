import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import {
  GraduationCap,
  Phone,
  Shield,
  UserCog,
  Users,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Badge } from "@/components/ui/badge";
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
        userRoleLabel: `Student · Course #${matchedUser.user.courseId}`,
        phone: matchedUser.user.phone,
        batch: String(matchedUser.user.batchId),
        course: String(matchedUser.user.courseId),
      });
      navigate("/student/dashboard");
      return;
    }

    setSession({
      role: "teacher",
      userId: matchedUser.user.id,
      userName: matchedUser.user.name,
      userRoleLabel: "Teacher",
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
    <div className="min-h-screen flex flex-col font-sans selection:bg-primarySelection selection:text-white">
      <Navbar />

      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[#f8fafc]" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-blue-400/5 blur-[100px]" />
      </div>

      <main className="flex-1 flex items-center justify-center p-6 py-12 lg:py-20">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-0 overflow-hidden rounded-[2.5rem] border bg-white shadow-2xl shadow-slate-200/50">

          {/* Left Side: Branding & Info */}
          <div className="relative overflow-hidden bg-slate-900 p-10 lg:p-16 flex flex-col justify-between text-white hidden lg:flex">
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
              <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full bg-primary blur-[120px]" />
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium backdrop-blur-sm text-blue-200 mb-8">
                <Shield className="h-3.5 w-3.5" />
                ROCK IIT-NEET
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold leading-[1.1] mb-6">
                Master Your Future with <span className="text-primary italic">ROCK IIT-NEET</span>.
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                The all-in-one digital companion for IIT-JEE, NEET, and Foundation excellence. Study smarter, track better.
              </p>
            </div>

            <div className="relative z-10 flex justify-center lg:justify-start">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm w-full max-w-[220px]">
                <Users className="h-6 w-6 text-primary mb-3" />
                <div className="text-3xl font-bold">2,500+</div>
                <div className="text-xs text-slate-500 font-medium uppercase tracking-wider text-center lg:text-left">Success Students</div>
              </div>
            </div>
          </div>

          {/* Right Side: Login Form */}
          <div className="p-10 lg:p-16 flex flex-col justify-center">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-slate-900 leading-tight">Welcome Back</h2>
              <p className="text-slate-500 mt-2 font-medium">Please enter your credentials to access the portal.</p>
            </div>

            <div className="space-y-6">
              {!otpSent ? (
                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="space-y-2.5">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Mobile Number</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-400 group-focus-within:text-primary transition-colors pr-3 border-r">
                        <span className="text-sm font-bold">+91</span>
                      </div>
                      <Input
                        placeholder="Enter 10-digit number"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))}
                        type="tel"
                        className="pl-20 h-14 rounded-2xl border-slate-200 focus-visible:ring-primary focus-visible:border-primary transition-all bg-slate-50/50"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-600 text-sm animate-in zoom-in-95 duration-200">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
                      {error}
                    </div>
                  )}

                  <Button
                    className="w-full h-14 rounded-2xl text-base font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all"
                    onClick={handleSendOtp}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Validating...
                      </div>
                    ) : (
                      "Sign In with OTP"
                    )}
                  </Button>

                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center text-slate-200"><span className="w-full border-t" /></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400 font-bold tracking-widest leading-none">OR</span></div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-14 rounded-2xl gap-2 font-bold border-slate-200 hover:bg-slate-50 text-slate-700 transition-all border-dashed"
                    onClick={continueAsAdmin}
                  >
                    <UserCog className="h-4 w-4 text-slate-400" /> Continue as Admin
                  </Button>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-start gap-4">
                    <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                      <Shield className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-900 leading-none mb-1">Verify your identity</p>
                      <p className="text-xs text-blue-700/70">OTP sent to +91 {phone.slice(0, 5)} {phone.slice(5)}</p>
                      <button onClick={() => setOtpSent(false)} className="text-xs text-blue-600 font-bold hover:underline mt-2">
                        Change number
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-semibold text-slate-700 block text-center">Verification Code</label>
                    <div className="flex justify-center">
                      <InputOTP maxLength={6} value={otp} onChange={setOtp} className="gap-3">
                        <InputOTPGroup className="gap-2 sm:gap-3">
                          {[0, 1, 2, 3, 4, 5].map((index) => (
                            <InputOTPSlot
                              key={index}
                              index={index}
                              className="h-12 w-10 sm:h-14 sm:w-12 rounded-xl border-slate-200 font-bold text-lg focus:ring-primary focus:border-primary transition-all bg-slate-50/50 shadow-sm"
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    <div className="flex justify-center">
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 font-bold px-3 py-1">
                        Demo Code: {DEMO_OTP}
                      </Badge>
                    </div>
                  </div>

                  {matchedUser && (
                    <div className="text-center p-3 rounded-xl bg-slate-50 text-slate-600 text-xs font-medium border border-slate-100">
                      Welcome, <span className="text-primary font-bold">{matchedUser.user.name}</span>
                    </div>
                  )}

                  {error && (
                    <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm text-center font-medium animate-in shake duration-300">
                      {error}
                    </div>
                  )}

                  <Button
                    className="w-full h-14 rounded-2xl text-base font-bold shadow-xl shadow-primary/20 transition-all mt-2"
                    onClick={handleVerify}
                    disabled={loading}
                  >
                    Complete Sign In
                  </Button>
                </div>
              )}

              <div className="pt-4 text-center">
                <Link to="/" className="text-sm font-bold text-slate-400 hover:text-primary transition-colors inline-flex items-center gap-1.5">
                  <span className="text-lg">←</span> Back to Homepage
                </Link>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
