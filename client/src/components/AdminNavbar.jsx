import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const serverUrl = "http://localhost:3000/api";

function AdminNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const admin = useSelector((state) => state.user.userData);
  
  const adminData = {
    name: admin?.name || "Admin User",
    avatar: admin?.name ? admin.name.charAt(0).toUpperCase() : "AD"
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
          <Link to="/dashboard/admin" className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg mr-3"></div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">InstantFix Admin</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/dashboard/admin" 
              className="text-purple-600 hover:text-purple-600 font-medium transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              to="/dashboard/admin/electricians/pending" 
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              Pending
            </Link>
            <Link 
              to="/dashboard/admin/electricians" 
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              Electricians
            </Link>
            <Link 
              to="/dashboard/admin/electricians" 
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              Directory
            </Link>
            <Link 
              to="/dashboard/admin/electricians/pending" 
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              Approvals
            </Link>
          </div>

          {/* Admin Profile */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-purple-600 transition-colors">
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
                className="flex items-center space-x-3 text-gray-700 hover:text-purple-600 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                  {adminData.avatar}
                </div>
                <span className="hidden md:block font-medium">{adminData.name}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2">
                  <Link 
                    to="/dashboard/admin/profile" 
                    className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                  >
                    🛡️ Admin Profile
                  </Link>
                  <Link 
                    to="/dashboard/admin/settings" 
                    className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
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
            className="md:hidden text-gray-700 hover:text-purple-600"
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
                to="/dashboard/admin" 
                className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
              >
                Dashboard
              </Link>
              <Link 
                to="/dashboard/admin/electricians/pending" 
                className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
              >
                Pending
              </Link>
              <Link 
                to="/dashboard/admin/electricians" 
                className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
              >
                Electricians
              </Link>
              <Link 
                to="/dashboard/admin/electricians" 
                className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
              >
                Directory
              </Link>
              <Link 
                to="/dashboard/admin/electricians/pending" 
                className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
              >
                Approvals
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default AdminNavbar;
