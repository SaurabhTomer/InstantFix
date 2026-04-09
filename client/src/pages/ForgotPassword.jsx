import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { setOtpSent, setOtpVerified, setResetDone, clearForgotPassword } from "../store/authSlice";
import { Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";

export default function ForgotPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { otpSent, otpVerified, resetDone } = useSelector((s) => s.auth);

  const [method, setMethod]           = useState("email");
  const [email, setEmail]             = useState("");
  const [phone, setPhone]             = useState("");
  const [otp, setOtp]                 = useState("");
  const [password, setPassword]       = useState("");
  const [confirmPassword, setConfirm] = useState("");
  const [showPass, setShowPass]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError]             = useState("");
  const [loading, setLoading]         = useState(false);

  const identifier = method === "email" ? { email } : { phone };

  const inputClass = "w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none transition-all focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100";

  const handleSendOTP = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password/send-otp", { method, ...identifier });
      dispatch(setOtpSent(true));
    } catch (err) { setError(err.response?.data?.message || "Something went wrong"); }
    finally { setLoading(false); }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password/verify-otp", { method, otp, ...identifier });
      dispatch(setOtpVerified(true));
    } catch (err) { setError(err.response?.data?.message || "Something went wrong"); }
    finally { setLoading(false); }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault(); setError("");
    if (password !== confirmPassword) return setError("Passwords do not match");
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password/reset-password", { method, password, confirmPassword, ...identifier });
      dispatch(setResetDone(true));
    } catch (err) { setError(err.response?.data?.message || "Something went wrong"); }
    finally { setLoading(false); }
  };

  const steps    = ["Send OTP", "Verify OTP", "New Password"];
  const curStep  = resetDone ? 3 : otpVerified ? 2 : otpSent ? 1 : 0;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Steps */}
        {!resetDone && (
          <div className="flex items-center gap-2 mb-10">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 transition-all ${
                  i < curStep  ? "bg-yellow-400 text-black" :
                  i === curStep ? "bg-yellow-400/20 border border-yellow-400/50 text-yellow-400" :
                  "bg-gray-200 text-gray-400"
                }`}>
                  {i < curStep ? "" : i + 1}
                </div>
                <span className="text-xs font-medium hidden sm:block text-gray-700">{s}</span>
                {i < steps.length - 1 && (
                  <div className="h-px flex-1 bg-gray-200" />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-lg">
          {resetDone ? (
            <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 size={32} className="text-green-500" />
                </div>
                <h2 className="text-xl font-extrabold mb-2">Password reset!</h2>
                <p className="text-sm text-gray-600 mb-8">Your password has been updated successfully.</p>
               <button onClick={() => { dispatch(clearForgotPassword()); navigate("/login"); }}
                  className="w-full py-3.5 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-xl text-sm transition-all">
                  Back to Login →
                </button>
              </div>

            ) : otpVerified ? (
              <>
                <h1 className="text-2xl font-extrabold mb-1 tracking-tight">New password</h1>
                <p className="text-sm text-gray-600 mb-8">Choose a strong password for your account.</p>
                {error && <div className="mb-5 px-4 py-3 rounded-xl text-sm bg-red-50 text-red-600 border border-red-200">{error}</div>}
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <div className="relative">
                      <input type={showPass ? "text" : "password"} value={password}
                        onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters" required
                        className={inputClass + " pr-11"} />
                      <button type="button" onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors">
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                    <div className="relative">
                      <input type={showConfirm ? "text" : "password"} value={confirmPassword}
                        onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter password" required
                        className={inputClass + " pr-11"} />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors">
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full py-3.5 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-xl text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
                    {loading ? <span><Loader2 size={16} className="animate-spin" /> Resetting...</span> : "Reset Password →"}
                  </button>
                </form>
              </>

            ) : otpSent ? (
              <>
                <h1 className="text-2xl font-extrabold mb-1 tracking-tight">Enter OTP</h1>
                <p className="text-sm text-gray-600 mb-8">We sent a 6-digit code to your {method}.</p>
                {error && <div className="mb-5 px-4 py-3 rounded-xl text-sm bg-red-50 text-red-600 border border-red-200">{error}</div>}
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">6-digit OTP</label>
                    <input value={otp} onChange={(e) => setOtp(e.target.value)}
                      placeholder="1 2 3 4 5 6" maxLength={6} required
                      className={inputClass + " text-center text-xl tracking-[0.5em] font-bold"} />
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full py-3.5 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-xl text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
                    {loading ? <span><Loader2 size={16} className="animate-spin" /> Verifying...</span> : "Verify OTP →"}
                  </button>
                  <button type="button" onClick={() => dispatch(setOtpSent(false))}
                    className="w-full py-3 text-sm text-gray-600 hover:text-yellow-400 transition-colors">
                    ← Change {method}
                  </button>
                </form>
              </>

            ) : (
              <>
                <h1 className="text-2xl font-extrabold mb-1 tracking-tight">Forgot password?</h1>
                <p className="text-sm text-gray-600 mb-8">No worries, we'll send you a reset code.</p>
                {error && <div className="mb-5 px-4 py-3 rounded-xl text-sm bg-red-50 text-red-600 border border-red-200">{error}</div>}
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Send code via</label>
                    <div className="grid grid-cols-2 gap-2 bg-gray-100 rounded-2xl p-1 mb-2">
                      {["email", "phone"].map((m) => (
                        <button key={m} type="button" onClick={() => setMethod(m)}
                          className={`py-2.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                            method === m ? "bg-yellow-400 text-black" : "text-gray-600 hover:text-gray-800"
                          }`}>
                          {m === "email" ? "📧 Email" : "📱 Phone"}
                        </button>
                      ))}
                    </div>
                  </div>
                  {method === "email"
                    ? <div><label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com" required className={inputClass} /></div>
                    : <div><label className="block text-sm font-medium text-gray-700 mb-2">Phone number</label>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210" required className={inputClass} /></div>
                  }
                  <button type="submit" disabled={loading}
                    className="w-full py-3.5 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-xl text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
                    {loading ? <span><Loader2 size={16} className="animate-spin" /> Sending...</span> : "Send OTP →"}
                  </button>
                </form>
              </>
            )}
          </div>

          {!resetDone && (
            <p className="text-center text-sm text-gray-600 mt-6">
              Remember your password?{" "}
              <Link to="/login" className="text-yellow-400 hover:text-yellow-300 font-medium">Sign in</Link>
            </p>
          )}
        </div>
    </div>
  );
}