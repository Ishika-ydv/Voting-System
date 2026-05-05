import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

import { verifyOtp, sendOtp } from "../../api/authApi";
import OTPInput from "../../components/auth/OTPInput";
import Button from "../../components/common/Button";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(600); // 10 min
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendBlocked, setResendBlocked] = useState(false);

  const { state } = useLocation();
  const navigate = useNavigate();

  const email = state?.email;

  // 🚨 Guard: no email → redirect
  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  // ⏳ Countdown timer
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = () => {
    const mins = String(Math.floor(timer / 60)).padStart(2, "0");
    const secs = String(timer % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  // 🔥 Auto-submit when OTP is complete
  useEffect(() => {
    if (otp.length === 6) {
      handleVerify();
    }
  }, [otp]);

  // ✅ Verify OTP
  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter complete OTP");
      return;
    }

    setLoading(true);

    try {
      await verifyOtp({ email, otp });

      toast.success("Email verified successfully 🎉");
      navigate("/login");
    } catch (err) {
      const message = err?.response?.data?.message;

      if (message?.toLowerCase().includes("expired")) {
        toast.error("OTP expired. Please resend OTP.");
      } else if (message?.toLowerCase().includes("too many")) {
        toast.error("Too many attempts. Try again later.");
      } else {
        toast.error(message || "Invalid OTP");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Resend OTP with cooldown
  const handleResend = async () => {
    if (resendBlocked || timer > 0) return;

    setResendLoading(true);
    setResendBlocked(true);

    try {
      await sendOtp(email);

      toast.success("OTP sent again");
      setTimer(600); // reset timer
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to resend OTP"
      );
    } finally {
      setResendLoading(false);

      // ⛔ prevent spam resend
      setTimeout(() => setResendBlocked(false), 10000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md text-center">

        {/* Title */}
        <h1 className="text-2xl font-bold mb-2">Verify your email</h1>

        <p className="text-sm text-gray-500 mb-6">
          OTP sent to <span className="font-medium">{email}</span>
        </p>

        {/* OTP Input */}
        <OTPInput value={otp} onChange={setOtp} />

        {/* Timer */}
        <p
          className={`text-sm mt-4 ${
            timer < 60 ? "text-red-500" : "text-gray-400"
          }`}
        >
          Expires in {formatTime()}
        </p>

        {/* Verify Button */}
        <Button
          onClick={handleVerify}
          disabled={loading}
          className="w-full mt-5"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </Button>

        {/* Resend OTP */}
        <button
          onClick={handleResend}
          disabled={timer > 0 || resendLoading || resendBlocked}
          className={`mt-3 text-sm transition ${
            timer > 0 || resendBlocked
              ? "text-gray-400 cursor-not-allowed"
              : "text-blue-600 hover:underline"
          }`}
        >
          {resendLoading
            ? "Resending..."
            : timer > 0
            ? `Resend available in ${formatTime()}`
            : "Resend OTP"}
        </button>
      </div>
    </div>
  );
}