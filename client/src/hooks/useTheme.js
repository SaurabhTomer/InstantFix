import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from '../store/authSlice';

export const useTheme = () => {
  const dispatch = useDispatch();
  const isDark   = useSelector((s) => s.auth.isDark);

  const t = {
    isDark,
    bg:      isDark ? "bg-[#0a0a0a]"       : "bg-[#f8f7f2]",
    bgAlt:   isDark ? "bg-[#111111]"        : "bg-white",
    bgCard:  isDark ? "bg-white/[0.03]"     : "bg-white",
    border:  isDark ? "border-white/[0.07]" : "border-black/[0.08]",
    text:    isDark ? "text-white"          : "text-[#0a0a0a]",
    muted:   isDark ? "text-white/40"       : "text-black/40",
    muted2:  isDark ? "text-white/60"       : "text-black/60",
    nav:     isDark ? "bg-[#0a0a0a]/90"     : "bg-[#f8f7f2]/90",
    input:   isDark
      ? "bg-white/[0.04] border-white/[0.08] text-white placeholder-white/20 focus:border-yellow-400/60 focus:bg-white/[0.06]"
      : "bg-black/[0.04] border-black/[0.08] text-black placeholder-black/30 focus:border-yellow-500/60 focus:bg-black/[0.02]",
    labelClass: isDark
      ? "block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2"
      : "block text-xs font-semibold text-black/40 uppercase tracking-wider mb-2",
    errorBox: isDark
      ? "bg-red-500/10 border border-red-500/20 text-red-400"
      : "bg-red-50 border border-red-200 text-red-600",
    successBox: isDark
      ? "bg-green-500/10 border border-green-500/20 text-green-400"
      : "bg-green-50 border border-green-200 text-green-600",
    infoBox: isDark
      ? "bg-yellow-400/[0.07] border border-yellow-400/20 text-yellow-400/90"
      : "bg-yellow-50 border border-yellow-300 text-yellow-700",
    toggle: () => dispatch(toggleTheme()),
  };

  return t;
};