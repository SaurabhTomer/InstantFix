import { NavLink, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { clearAuth } from "../../store/authSlice"
import axios from "axios"
import {
  MdDashboard, MdPeople, MdElectricBolt,
  MdListAlt, MdBarChart, MdLogout
} from "react-icons/md"

const links = [
  { to: "/admin/overview",  icon: <MdDashboard size={20} />,    label: "Overview" },
  { to: "/admin/users",     icon: <MdPeople size={20} />,       label: "Users" },
  { to: "/admin/approvals", icon: <MdElectricBolt size={20} />, label: "Approvals" },
  { to: "/admin/requests",  icon: <MdListAlt size={20} />,      label: "All Requests" },
  { to: "/admin/stats",     icon: <MdBarChart size={20} />,     label: "Stats" },
]

export default function AdminSidebar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true })
    } catch {}
    dispatch(clearAuth())
    navigate("/login", { replace: true })
  }

  return (
    <aside className="w-64 min-h-screen bg-gray-900 dark:bg-gray-950 text-white flex flex-col fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-700">
        <span className="text-xl font-bold text-yellow-400">⚡ InstantFix</span>
        <p className="text-xs text-gray-400 mt-0.5">Admin Panel</p>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all
              ${isActive
                ? "bg-yellow-400 text-gray-900"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            {l.icon}
            {l.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm
            text-red-400 hover:bg-gray-800 transition-all"
        >
          <MdLogout size={20} /> Logout
        </button>
      </div>
    </aside>
  )
}