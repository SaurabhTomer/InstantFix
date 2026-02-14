import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const serverUrl = "http://localhost:3000/api";

function ElectricianNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const electrician = {
    name: "Mike Wilson",
    avatar: "MW"
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${serverUrl}/auth/logout`, {}, { withCredentials: true });
    } catch (err) {
    } finally {
      setIsMenuOpen(false);
      navigate("/login");
    }
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard/electrician" className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-blue-500 rounded-lg mr-3"></div>
            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">InstantFix Pro</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/dashboard/electrician" 
              className="text-green-600 hover:text-green-600 font-medium transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              to="/dashboard/electrician/jobs" 
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              Available Jobs
            </Link>
            <Link 
              to="/dashboard/electrician/assigned" 
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              Assigned Jobs
            </Link>
            <Link 
              to="/dashboard/electrician/completed" 
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              Completed
            </Link>
          </div>

          {/* Electrician Profile */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-green-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {/* User Menu */}
            <div className="relative">
              <button 
                onClick={toggleMenu}
                className="flex items-center space-x-3 text-gray-700 hover:text-green-600 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {electrician.avatar}
                </div>
                <span className="hidden md:block font-medium">{electrician.name}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2">
                  <Link 
                    to="/dashboard/electrician/profile" 
                    className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                  >
                    👨‍🔧 My Profile
                  </Link>
                  <Link 
                    to="/dashboard/electrician/settings" 
                    className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                  >
                    🔐 Change Password
                  </Link>
                  <hr className="my-2 border-gray-100" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMenu}
            className="md:hidden text-gray-700 hover:text-green-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              <Link 
                to="/dashboard/electrician" 
                className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors"
              >
                Dashboard
              </Link>
              <Link 
                to="/dashboard/electrician/jobs" 
                className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors"
              >
                Available Jobs
              </Link>
              <Link 
                to="/dashboard/electrician/assigned" 
                className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors"
              >
                Assigned Jobs
              </Link>
              <Link 
                to="/dashboard/electrician/completed" 
                className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors"
              >
                Completed
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default ElectricianNavbar;
