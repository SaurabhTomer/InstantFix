import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Clock, User, Settings, HelpCircle, LogOut, X, Menu, Zap } from "lucide-react";

export default function UserSidebar({ isOpen, onClose, onMenuClick }) {
  const location = useLocation();
  
  const menuItems = [
    {
      id: 1,
      name: "Dashboard",
      icon: Home,
      path: "/user/dashboard",
      color: "text-amber-500"
    },
    {
      id: 2,
      name: "My Bookings",
      icon: Clock,
      path: "/user/bookings",
      color: "text-gray-600"
    },
    {
      id: 3,
      name: "Profile",
      icon: User,
      path: "/user/profile",
      color: "text-gray-600"
    },
    {
      id: 4,
      name: "Settings",
      icon: Settings,
      path: "/user/settings",
      color: "text-gray-600"
    },
    {
      id: 5,
      name: "Help & Support",
      icon: HelpCircle,
      path: "/user/help",
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
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <Menu size={20} />
            </button>
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-amber-400 rounded-xl flex items-center justify-center">
                <Zap size={16} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-bold tracking-tight text-gray-900">
                Instant<span className="text-amber-500">Fix</span>
              </span>
            </Link>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center text-sm font-semibold text-white">
              AK
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Amit Kumar</h3>
              <p className="text-sm text-gray-500">amit.kumar@example.com</p>
            </div>
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
                        ? 'bg-amber-50 text-amber-600 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <item.icon size={20} className={isActive ? 'text-amber-600' : ''} />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
