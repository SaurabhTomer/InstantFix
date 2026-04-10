import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, UserCheck, Calendar, Settings, LogOut,
  BarChart3, Shield, FileText, Bell, ChevronDown
} from "lucide-react";

export default function AdminSidebar({ isOpen, onClose, onMenuClick }) {
  const location = useLocation();
  
  const menuItems = [
    {
      id: 1,
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
      color: "text-purple-500"
    },
    {
      id: 2,
      name: "Manage Users",
      icon: Users,
      path: "/admin/users",
      color: "text-gray-600"
    },
    {
      id: 3,
      name: "Manage Electricians",
      icon: UserCheck,
      path: "/admin/electricians",
      color: "text-gray-600"
    },
    {
      id: 4,
      name: "Service Requests",
      icon: FileText,
      path: "/admin/requests",
      color: "text-gray-600"
    },
    {
      id: 5,
      name: "Analytics",
      icon: BarChart3,
      path: "/admin/analytics",
      color: "text-gray-600"
    },
    {
      id: 6,
      name: "Settings",
      icon: Settings,
      path: "/admin/settings",
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
            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <Shield size={16} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-bold tracking-tight text-gray-900">
                Admin<span className="text-purple-500">Panel</span>
              </span>
            </Link>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <ChevronDown size={20} className="transform rotate-90" />
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
                        ? 'bg-purple-50 text-purple-600 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <item.icon size={20} className={isActive ? 'text-purple-600' : ''} />
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
            onClick={() => {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('user');
              window.location.href = '/login';
            }}
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
