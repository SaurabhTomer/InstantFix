import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice.js";
import { Home, Calendar, Users, DollarSign, User, X, Menu, Zap, MapPin, Search, LogOut } from "lucide-react";

export default function ElectricianSidebar({ isOpen, onClose, onMenuClick }) {
  const location = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    // Show confirmation dialog
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    
    if (confirmLogout) {
      // Dispatch logout action from Redux
      dispatch(logout());
      
      // Redirect to login page
      window.location.href = '/login';
    }
  };
  
  const menuItems = [
    {
      id: 1,
      name: "Dashboard",
      icon: Home,
      path: "/electrician/dashboard",
      color: "text-blue-500"
    },
    {
      id: 2,
      name: "My Bookings",
      icon: Calendar,
      path: "/electrician/bookings",
      color: "text-gray-600"
    },
    {
      id: 3,
      name: "Get Nearby Jobs",
      icon: MapPin,
      path: "/electrician/nearby-jobs",
      color: "text-gray-600"
    },
    {
      id: 4,
      name: "Earnings",
      icon: DollarSign,
      path: "/electrician/earnings",
      color: "text-gray-600"
    },
        {
      id: 5,
      name: "Profile",
      icon: User,
      path: "/electrician/profile",
      color: "text-gray-600"
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 w-64 h-full bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <Link to="/electrician/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Zap size={16} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-bold tracking-tight text-gray-900">
                Instant<span className="text-blue-500">Fix</span>
              </span>
            </Link>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                      ${isActive 
                        ? 'bg-blue-50 text-blue-600 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <item.icon size={20} className={isActive ? 'text-blue-600' : ''} />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
