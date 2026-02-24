import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
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
      console.log(result.data);

      dispatch(setUserData(result.data));

      toast.success("Login Successful...");

      navigate("/"); 

    } catch (error) {
      toast.error(error?.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-blue-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8 border border-blue-200">

        <h1 className="text-3xl font-bold mb-2 text-blue-600">
          Instantfix
        </h1>

        <p className="text-gray-600 mb-8">
          Sign in to continue
        </p>

        {/* Email */}
        <div className="mb-4">
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

        {/* Password */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Password
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full border border-blue-200 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />

            <button
              type="button"
              className="absolute right-3 top-3.5 text-gray-500"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>
        </div>

        {/* Forgot Password */}
        <div
          className="text-right mb-4 cursor-pointer text-blue-600 font-medium hover:text-yellow-500"
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password?
        </div>

        {/* Submit */}
        <button
          className="w-full font-semibold py-2 rounded-lg transition duration-200 bg-blue-600 text-white hover:bg-blue-700"
          onClick={handleSignIn}
          disabled={loading}
        >
          {loading ? <ClipLoader size={20} color="white" /> : "Sign In"}
        </button>

        <p
          className="text-center mt-6 cursor-pointer"
          onClick={() => navigate("/signup")}
        >
          Want to create a new account?
          <span className="text-blue-600 font-semibold ml-1 hover:text-yellow-500">
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignIn;