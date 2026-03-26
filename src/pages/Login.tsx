import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Phone, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const Login = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = () => {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setOtpSent(true);
      setLoading(false);
    }, 1000);
  };

  const handleVerify = () => {
    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/student/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-2xl mb-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-gradient">EduElite</span>
          </Link>
          <p className="text-muted-foreground">Login to your student portal</p>
        </div>

        <div className="bg-card rounded-xl border p-8 shadow-card">
          {!otpSent ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Mobile Number</label>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1.5 px-3 border rounded-md bg-muted text-sm font-medium shrink-0">
                    <Phone className="h-3.5 w-3.5" /> +91
                  </div>
                  <Input
                    placeholder="Enter 10-digit number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    type="tel"
                  />
                </div>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button className="w-full" onClick={handleSendOtp} disabled={loading}>
                {loading ? "Sending..." : "Send OTP"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <Shield className="h-10 w-10 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">OTP sent to +91 {phone}</p>
                <button onClick={() => setOtpSent(false)} className="text-xs text-primary hover:underline">Change number</button>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-center">Enter OTP</label>
                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                    <InputOTPGroup>
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <InputOTPSlot key={i} index={i} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>
              {error && <p className="text-sm text-destructive text-center">{error}</p>}
              <Button className="w-full" onClick={handleVerify} disabled={loading}>
                {loading ? "Verifying..." : "Verify & Login"}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Didn't receive OTP? <button className="text-primary hover:underline">Resend</button>
              </p>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          <Link to="/" className="hover:text-primary transition-colors">← Back to Homepage</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
