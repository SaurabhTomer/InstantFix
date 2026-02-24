import axios from "axios";
import { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

function ForgotPassword() {

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="flex w-full items-center justify-center min-h-screen p-4 bg-blue-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8 border border-blue-200">

        <div className="flex items-center gap-4 mb-4">
          <IoIosArrowRoundBack
            size={30}
            className="text-blue-600 cursor-pointer hover:text-yellow-500"
            onClick={() => navigate("/signin")}
          />
          <h1 className="text-2xl font-bold text-blue-600">
            Forgot Password
          </h1>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Enter your Email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>

            <button
              className="w-full font-semibold py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              onClick={handleSendOtp}
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="white" /> : "Send OTP"}
            </button>
          </>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-1">
                OTP
              </label>
              <input
                type="text"
                className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Enter OTP"
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
              />
            </div>

            <button
              className="w-full font-semibold py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              onClick={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="white" /> : "Verify OTP"}
            </button>
          </>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-1">
                New Password
              </label>
              <input
                type="password"
                className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Enter New Password"
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
              />
            </div>

            <button
              className="w-full font-semibold py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              onClick={handleResetPassword}
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="white" /> : "Reset Password"}
            </button>
          </>
        )}

      </div>
    </div>
  );
}

export default ForgotPassword;