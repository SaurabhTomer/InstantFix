// src/pages/User/UserLayout.jsx
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu, Bell, Zap, X } from "lucide-react";
import { Link } from "react-router-dom";
import UserSidebar from "./UserSidebar";
import UserDashboard from "./UserDashboard";
import MyBookings from "./MyBookings";
import RequestDetails from "./RequestDetails";
import BookRequest from "./BookRequest";
import UserProfile from "./UserProfile";
import socket from "../../socket";

export default function UserLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const { user } = useSelector((state) => state.auth);

  const addToast = (msg) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
  };

  useEffect(() => {
    socket.on("request_update", (data) => addToast(data.message));
    socket.on("payment_success",  (data) => addToast(data.message));
    return () => {
      socket.off("request_update");
      socket.off("payment_success");
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast notifications */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} className="flex items-start gap-3 bg-white border border-amber-200 shadow-lg rounded-xl px-4 py-3 max-w-xs">
            <Bell size={16} className="text-amber-500 mt-0.5 shrink-0" />
            <p className="text-sm text-gray-700 flex-1">{t.msg}</p>
            <button onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}>
              <X size={14} className="text-gray-400 hover:text-gray-700" />
            </button>
          </div>
        ))}
      </div>

      <UserSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Sticky Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Logo — mobile pe */}
          <Link to="/user/dashboard" className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 bg-amber-400 rounded-xl flex items-center justify-center">
              <Zap size={16} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900">
              Instant<span className="text-amber-500">Fix</span>
            </span>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <Menu size={20} />
          </button>

          {/* Desktop Logo */}
          <Link to="/user/dashboard" className="hidden lg:flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-400 rounded-xl flex items-center justify-center">
              <Zap size={16} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900">
              Instant<span className="text-amber-500">Fix</span>
            </span>
          </Link>

          <div className="flex-1" />

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />
            </button>
            <Link
              to="/user/profile"
              className="w-9 h-9 bg-amber-400 rounded-full flex items-center justify-center text-sm font-semibold text-white hover:bg-amber-500 transition-colors"
            >
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Link>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main>
        <Routes>
          <Route index element={<UserDashboard />} />
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="bookings" element={<MyBookings />} />
          <Route path="bookings/:requestId" element={<RequestDetails />} />
          <Route path="book-request" element={<BookRequest />} />
          <Route path="profile" element={<UserProfile />} />
        </Routes>
      </main>
    </div>
  );
}