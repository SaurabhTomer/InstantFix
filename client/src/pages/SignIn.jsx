import { useState } from "react";
import { FaRegEye, FaRegEyeSlash, FaSignInAlt, FaEnvelope, FaLock, FaBolt, FaTools, FaShieldAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { toast } from "react-toastify";

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      return toast.warning("All fields are required");
    }

    setLoading(true);

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      // console.log(result.data.user.role);

      dispatch(setUserData(result.data));
      if(result?.data?.user?.role === "ADMIN"){
        navigate("/admin");
      }
      else if(result?.data?.user?.role === "USER"){
        navigate("user");
      }
      else if(result?.data?.user?.approvalStatus === "pending" ) {
        navigate("/")
        toast.warn("wait for admin approval...")
      }
      else if(result?.data?.user?.approvalStatus === "approved" ) {
        navigate("/electrician")
      }
      else{
        navigate("/");
      }
      toast.success("Login Successful...");

      // navigate("/user"); 

    } catch (error) {
      toast.error(error?.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-yellow-50 via-amber-50 to-blue-50 relative overflow-hidden">
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
        
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
            <FaSignInAlt className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent">
          InstantFix
        </h1>

        <p className="text-gray-600 text-center mb-8">
          Welcome back! Sign in to access ⚡ electrical services
        </p>

        {/* Email */}
        <div className="mb-5">
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

        {/* Password */}
        <div className="mb-5">
          <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
            <FaLock className="w-4 h-4 text-blue-500" />
            Password
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />

            <button
              type="button"
              className="absolute right-3 top-3.5 text-gray-400 hover:text-blue-500 transition-colors"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>
        </div>

        {/* Forgot Password */}
        <div className="text-right mb-6">
          <span
            className="text-blue-600 font-semibold hover:text-blue-700 cursor-pointer transition-colors"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password? →
          </span>
        </div>

        {/* Submit */}
        <button
          className="w-full font-bold py-4 rounded-xl transition-all duration-200 bg-gradient-to-r from-yellow-400 to-amber-500 text-white hover:from-yellow-500 hover:to-amber-600 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none"
          onClick={handleSignIn}
          disabled={loading}
        >
          {loading ? <ClipLoader size={20} color="white" /> : "Sign In"}
        </button>

        <p className="text-center mt-8 text-gray-600">
          New to InstantFix?
          <span
            className="text-blue-600 font-bold ml-2 hover:text-blue-700 cursor-pointer transition-colors"
            onClick={() => navigate("/signup")}
          >
            Create Account →
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignIn;