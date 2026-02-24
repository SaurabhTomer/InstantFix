import axios from "axios";
import { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaKey, FaEnvelope, FaLock, FaClock, FaCheckCircle, FaBolt, FaTools, FaShieldAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useEffect } from "react";

function ForgotPassword() {

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const navigate = useNavigate();

  // Send OTP
  const handleSendOtp = async () => {
    if (!email) return toast.warning("Email is required");

    setLoading(true);
    try {
      await axios.post(
        `${serverUrl}/api/auth/send-otp`,
        { email },
        { withCredentials: true }
      );

      toast.success("OTP sent to your email 📩");
      setStep(2);
      setTimer(5 * 60);   // 👈 start 60 sec timer

    } catch (error) {
      toast.error(error?.response?.data?.message || "Send OTP failed");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) return toast.warning("Enter OTP");

    setLoading(true);
    try {
      await axios.post(
        `${serverUrl}/api/auth/verify-otp`,
        { email, otp },
        { withCredentials: true }
      );

      toast.success("OTP verified ✅");
      setStep(3);
      

    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  //resend otp
  const handleResendOtp = async () => {
  if (timer > 0) return;

  setLoading(true);
  try {
    await axios.post(
      `${serverUrl}/api/auth/resend-otp`,
      { email },
      { withCredentials: true }
    );

    toast.success("OTP Resent Successfully 🔁");
    setTimer(5 * 60);

  } catch (error) {
    toast.error(error?.response?.data?.message || "Resend failed");
  } finally {
    setLoading(false);
  }
};

  // Reset Password
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword)
      return toast.warning("All fields required");

    if (newPassword !== confirmPassword)
      return toast.warning("Passwords do not match");

    setLoading(true);
    try {
      await axios.post(
        `${serverUrl}/api/auth/reset-password`,
        { email, newPassword },
        { withCredentials: true }
      );

      toast.success("Password reset successful 🎉");
      navigate("/signin");

    } catch (error) {
      toast.error(error?.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };


        useEffect(() => {
    let interval;

    if (timer > 0) {
        interval = setInterval(() => {
        setTimer((prev) => prev - 1);
        }, 1000);
    }

    return () => clearInterval(interval);
    }, [timer]);
  return (
    <div className="flex w-full items-center justify-center min-h-screen p-4 bg-gradient-to-br from-yellow-50 via-amber-50 to-blue-50 relative overflow-hidden">
      {/* Background decoration */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fbbf24' fill-opacity='0.05'%3E%3Cpath d='M30 30l15-15v30L30 30zm0 0L15 45V15l15 15z'/%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-md p-8 border border-yellow-200/50 relative z-10">
        {/* Top decorative icons */}
        <div className="flex justify-center gap-8 mb-4">
          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
            <FaBolt className="w-4 h-4 text-yellow-500" />
          </div>
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <FaTools className="w-4 h-4 text-blue-500" />
          </div>
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <FaShieldAlt className="w-4 h-4 text-green-500" />
          </div>
        </div>
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform"
               onClick={() => navigate("/signin")}>
            <IoIosArrowRoundBack size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent">
              Forgot Password
            </h1>
            <p className="text-gray-600 text-sm">Reset your InstantFix account</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-yellow-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white' : 'bg-gray-200'}`}>
              1
            </div>
            <span className="text-xs font-medium">Email</span>
          </div>
          <div className={`flex-1 h-0.5 mx-2 ${step >= 2 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-yellow-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white' : 'bg-gray-200'}`}>
              2
            </div>
            <span className="text-xs font-medium">OTP</span>
          </div>
          <div className={`flex-1 h-0.5 mx-2 ${step >= 3 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-yellow-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 3 ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white' : 'bg-gray-200'}`}>
              3
            </div>
            <span className="text-xs font-medium">Reset</span>
          </div>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
                <FaEnvelope className="w-8 h-8 text-white" />
              </div>
              <p className="text-gray-600">Enter your email to receive OTP</p>
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                <FaEnvelope className="w-4 h-4 text-blue-500" />
                Email Address
              </label>
              <input
                type="email"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                placeholder="Enter your email address"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>

            <button
              className="w-full font-bold py-4 rounded-xl transition-all duration-200 bg-gradient-to-r from-yellow-400 to-amber-500 text-white hover:from-yellow-500 hover:to-amber-600 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none"
              onClick={handleSendOtp}
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="white" /> : "Send OTP"}
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
                <FaKey className="w-8 h-8 text-white" />
              </div>
              <p className="text-gray-600">Enter the OTP sent to your email</p>
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                <FaKey className="w-4 h-4 text-blue-500" />
                One-Time Password
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-center text-lg font-mono"
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
              />
            </div>

            <button
              className="w-full font-bold py-4 rounded-xl transition-all duration-200 bg-gradient-to-r from-yellow-400 to-amber-500 text-white hover:from-yellow-500 hover:to-amber-600 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none"
              onClick={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="white" /> : "Verify OTP"}
            </button>

            <div className="text-center">
              {timer > 0 ? (
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <FaClock className="w-4 h-4" />
                  <span className="text-sm">
                    Resend OTP in <span className="text-yellow-600 font-bold">{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span>
                  </span>
                </div>
              ) : (
                <button
                  className="text-yellow-600 font-bold hover:text-yellow-700 transition-colors flex items-center gap-2 mx-auto"
                  onClick={handleResendOtp}
                >
                  <FaClock className="w-4 h-4" />
                  Resend OTP
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
                <FaCheckCircle className="w-8 h-8 text-white" />
              </div>
              <p className="text-gray-600">Create your new password</p>
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                <FaLock className="w-4 h-4 text-blue-500" />
                New Password
              </label>
              <input
                type="password"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                placeholder="Enter new password"
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                <FaLock className="w-4 h-4 text-blue-500" />
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                placeholder="Confirm new password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
              />
            </div>

            <button
              className="w-full font-bold py-4 rounded-xl transition-all duration-200 bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none"
              onClick={handleResetPassword}
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="white" /> : "Reset Password"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;