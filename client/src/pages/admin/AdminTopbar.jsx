import { useDispatch, useSelector } from "react-redux"
import { toggleTheme } from "../../store/themeSlice"
import { MdLightMode, MdDarkMode } from "react-icons/md"
import { useLocation } from "react-router-dom"

const pageTitles = {
  "/admin/overview":  "Overview",
  "/admin/users":     "Users Management",
  "/admin/approvals": "Electrician Approvals",
  "/admin/requests":  "All Requests",
  "/admin/stats":     "Stats & Analytics",
}

export default function AdminTopbar() {
  const dispatch = useDispatch()
  const mode = useSelector(s => s.theme.mode)
  const user = useSelector(s => s.auth.user)
  const { pathname } = useLocation()
  const title = pageTitles[pathname] || "Admin"

  return (
    <header className="h-16 px-6 flex items-center justify-between
      bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">

      <h1 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h1>

      <div className="flex items-center gap-4">
        {/* Dark mode toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600
            dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
        >
          {mode === "dark" ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
        </button>

        {/* Admin info */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center
            justify-center text-gray-900 font-bold text-sm">
            {user?.name?.[0]?.toUpperCase() || "A"}
          </div>
          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
            {user?.name || "Admin"}
          </span>
        </div>
      </div>
    </header>
  )
}