import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import { Zap } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const t        = useTheme();

  return (
    <nav className={`sticky top-0 z-50 ${t.nav} backdrop-blur border-b ${t.border} px-6 py-4 flex items-center justify-between transition-colors duration-300`}>
      <Link to="/" className="flex items-center gap-2.5">
        <div className="w-9 h-9 bg-yellow-400 rounded-xl flex items-center justify-center">
          <Zap size={18} className="text-black" />
        </div>
        <span className={`text-xl font-bold tracking-tight ${t.text}`}>
          Instant<span className="text-yellow-400">Fix</span>
        </span>
      </Link>

      <div className="flex items-center gap-3">
        {/* Toggle */}
        <button
          onClick={t.toggle}
          className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${t.isDark ? "bg-yellow-400" : "bg-black/20"}`}
        >
          <div className={`w-5 h-5 rounded-full absolute top-0.5 transition-all duration-300 flex items-center justify-center text-xs
            ${t.isDark ? "translate-x-6 bg-[#0a0a0a]" : "translate-x-0.5 bg-white shadow"}`}>
            {t.isDark ? "🌙" : "☀️"}
          </div>
        </button>

        <button onClick={() => navigate("/login")}
          className={`px-4 py-2 text-sm font-medium ${t.muted2} hover:text-yellow-400 transition-colors hidden sm:block`}>
          Login
        </button>
        <button onClick={() => navigate("/register")}
          className="px-5 py-2 text-sm font-semibold bg-yellow-400 text-black rounded-xl hover:bg-yellow-300 transition-colors">
          Get Started
        </button>
      </div>
    </nav>
  );
}