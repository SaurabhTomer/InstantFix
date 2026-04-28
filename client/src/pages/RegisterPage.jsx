import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { setUser, setToken } from "../store/authSlice";
import { Eye, EyeOff, Loader2, Zap } from "lucide-react";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/register",
        { name, email, phone, password, role },
        { withCredentials: true }
      );
      
      if (role === "electrician") {
        // Electricians need to wait for approval
        navigate("/pending-approval");
      } else {
        // Customers get logged in immediately
        dispatch(setUser(data.user));
        dispatch(setToken(data.accessToken));
        navigate("/user/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-lg">
          {/* Logo - moved inside the main card */}
          <Link to="/" className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 bg-yellow-400 rounded-xl flex items-center justify-center">
              <Zap size={18} className="text-black" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Instant<span className="text-yellow-400">Fix</span>
            </span>
          </Link>

          <h1 className="text-2xl font-extrabold mb-1 tracking-tight">Create account</h1>
          <p className="text-sm text-gray-600 mb-8">Join us to get started with your electrical services.</p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl text-sm bg-red-50 text-red-600 border border-red-200">
              {error}
            </div>
          )}

          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none transition-all focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none transition-all focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1234567890"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none transition-all focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none transition-all focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
              >
                <option value="customer">Customer</option>
                <option value="electrician">Electrician</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-11 text-sm outline-none transition-all focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </form>

          {/* Sign Up Button - moved outside form but still in the main card */}
          <button
            type="button"
            disabled={loading}
            onClick={handleRegister}
            className="w-full py-3.5 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-xl text-sm transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account →"
            )}
          </button>

          {/* Sign In Link - moved inside the main card */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}