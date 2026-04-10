import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/authSlice";
import {
  LayoutDashboard, Users, UserCheck, FileText, LogOut, Shield, X
} from "lucide-react";

export default function AdminSidebar({ isOpen, onClose }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const menuItems = [
    { id: 1, name: "Dashboard",           icon: LayoutDashboard, path: "/admin/dashboard" },
    { id: 2, name: "Manage Users",        icon: Users,           path: "/admin/users" },
    { id: 3, name: "Manage Electricians", icon: UserCheck,       path: "/admin/electricians" },
    { id: 4, name: "Service Requests",    icon: FileText,        path: "/admin/requests" },
  ];

  const handleLogout = () => {
    // localStorage.clear();
    dispatch(logout()); // ye localStorage bhi clear karega
    navigate("/login");
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-56
          bg-white border-r border-gray-100
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
          <Link to="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-purple-600 rounded-lg flex items-center justify-center">
              <Shield size={13} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-bold tracking-tight text-gray-900">
              Admin<span className="text-purple-600">Panel</span>
            </span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-3 mb-3">
            Menu
          </p>
          <ul className="space-y-0.5">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path ||
                (item.path === "/admin/dashboard" && location.pathname === "/admin");
              return (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150
                      ${isActive
                        ? "bg-purple-50 text-purple-700 font-medium"
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      }
                    `}
                  >
                    <item.icon
                      size={16}
                      className={isActive ? "text-purple-600" : "text-gray-400"}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                    <span>{item.name}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-500" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-150"
          >
            <LogOut size={16} strokeWidth={2} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}