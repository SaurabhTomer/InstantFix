import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice.js";
import { useNavigate } from "react-router-dom";
import {
  Home, Calendar, MapPin, User, LogOut, Zap, Bell, Menu, X, Shield
} from "lucide-react";
import ElectricianDashboard from "./ElectricianDashboard";
import MyBookings from "./MyBookings";
import NearbyJobs from "./NearbyJobs";
import JobDetails from "./JobDetails";
import ElectricianProfile from "./ElectricianProfile";

function ElectricianSidebar({ isOpen, onClose }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const menuItems = [
    { id: 1, name: "Dashboard",    icon: Home,     path: "/electrician/dashboard" },
    { id: 2, name: "My Bookings",  icon: Calendar, path: "/electrician/bookings" },
    { id: 3, name: "Nearby Jobs",  icon: MapPin,   path: "/electrician/nearby-jobs" },
    { id: 4, name: "Profile",      icon: User,     path: "/electrician/profile" },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm" onClick={onClose} />
      )}

      <aside className={`
        fixed top-0 left-0 z-50 h-full w-56
        bg-white border-r border-gray-100
        flex flex-col
        transform transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
          <Link to="/electrician/dashboard" className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
              <Zap size={13} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-bold tracking-tight text-gray-900">
              Instant<span className="text-blue-500">Fix</span>
            </span>
          </Link>
          <button onClick={onClose} className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100">
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-3 mb-3">Menu</p>
          <ul className="space-y-0.5">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150
                      ${isActive ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}`}
                  >
                    <item.icon size={16} className={isActive ? "text-blue-600" : "text-gray-400"} strokeWidth={isActive ? 2.5 : 2} />
                    <span>{item.name}</span>
                    {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />}
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
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut size={16} strokeWidth={2} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default function ElectricianLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <ElectricianSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="hidden lg:block" />

          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />
            </button>
            <Link to="/electrician/profile" className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-xs font-semibold text-blue-700">
                {user?.name?.charAt(0)?.toUpperCase() || 'E'}
              </span>
            </Link>
            <span className="text-sm text-gray-500 hidden sm:block">
              <span className="font-medium text-gray-900">{user?.name || 'Electrician'}</span>
            </span>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Routes>
            <Route index element={<ElectricianDashboard />} />
            <Route path="dashboard" element={<ElectricianDashboard />} />
            <Route path="bookings" element={<MyBookings />} />
            <Route path="nearby-jobs" element={<NearbyJobs />} />
            <Route path="job-details/:requestId" element={<JobDetails />} />
            <Route path="profile" element={<ElectricianProfile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}