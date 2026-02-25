import React from 'react';
import { FaBolt, FaHome, FaTools, FaClipboardList, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { serverUrl } from '../../App';
import { setUserData } from '../../redux/userSlice';


const DashboardLayout = ({ children, activeTab, setActiveTab }) => {
  const dispatch = useDispatch();
  const {userData} = useSelector((state) => state.user)
  
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: FaHome },
    { id: 'requests', label: 'My Requests', icon: FaClipboardList },
    { id: 'services', label: 'Services', icon: FaTools },
    { id: 'profile', label: 'Profile', icon: FaUser },
    { id: 'settings', label: 'Settings', icon: FaCog },
  ];

  
const handleLogout = async () => {
  try {
    const response = await axios.get(
      `${serverUrl}/api/auth/logout`,
      { withCredentials: true }
    );

    toast.success("Logged out successfully!");
    
    // Clear Redux state
    dispatch(setUserData(null));
    
    // Redirect to login page
    window.location.href = '/login';

  } catch (error) {
    // console.error("Logout error:", error);
    toast.error(error.response?.data?.message || "Logout failed");
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-blue-50">
      {/* Background decoration */}
      <div 
        className="fixed inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fbbf24' fill-opacity='0.05'%3E%3Cpath d='M30 30l15-15v30L30 30zm0 0L15 45V15l15 15z'/%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>

      <div className="flex relative z-10">
        {/* Sidebar */}
        <div className="w-64 bg-white/95 backdrop-blur-sm shadow-xl min-h-screen border-r border-yellow-200/50">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                <FaBolt className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent">
                  InstantFix
                </h1>
                <p className="text-xs text-gray-600">User Dashboard</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        activeTab === item.id
                          ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-yellow-50 hover:text-yellow-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Section */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
                  <FaUser className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{userData?.user?.name}</p>
                  <p className="text-xs text-gray-600">{userData?.user?.email}</p>
                </div>
              </div>
              <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <FaSignOutAlt className="w-4 h-4" />
                <span onClick={handleLogout}>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
