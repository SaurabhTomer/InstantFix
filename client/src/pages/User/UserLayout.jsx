// src/pages/User/UserLayout.jsx
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu, Bell, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import UserSidebar from "./UserSidebar";
import UserDashboard from "./UserDashboard";
import MyBookings from "./MyBookings";
import RequestDetails from "./RequestDetails";
import BookRequest from "./BookRequest";
import UserProfile from "./UserProfile";

export default function UserLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50">
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