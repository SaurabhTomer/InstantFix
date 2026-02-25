import React from 'react';
import { FaBolt, FaHome, FaUsers, FaTools, FaClipboardList, FaChartLine, FaCog, FaSignOutAlt, FaUserCheck } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { serverUrl } from '../../App';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../../redux/userSlice';
import { fetchAdminProfile, fetchAdminStats, selectAdminProfile, selectAdminStats } from '../../redux/adminSlice';

const AdminDashboardLayout = ({ children, activeTab, setActiveTab }) => {
  const dispatch = useDispatch();
  const adminProfile = useSelector(selectAdminProfile);
  const adminStats = useSelector(selectAdminStats);
  
  // Fetch admin data on component mount
  React.useEffect(() => {
    dispatch(fetchAdminProfile());
    dispatch(fetchAdminStats());
    
    // Set up polling for stats every 30 seconds
    const interval = setInterval(() => {
      dispatch(fetchAdminStats());
    }, 30000);
    
    return () => clearInterval(interval);
  }, [dispatch]);
  
  const menuItems = [
    { id: 'overview', label: 'Admin Overview', icon: FaHome },
    { id: 'users', label: 'Users Management', icon: FaUsers },
    { id: 'electricians', label: 'Electricians', icon: FaTools },
    { id: 'approvals', label: 'Approvals', icon: FaUserCheck },
    { id: 'requests', label: 'All Requests', icon: FaClipboardList },
    { id: 'analytics', label: 'Analytics', icon: FaChartLine },
    { id: 'settings', label: 'Admin Settings', icon: FaCog },
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
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to home page (login)
      window.location.href = '/';

    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50">
      {/* Premium background decoration */}
      <div 
        className="fixed inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23dc2626' fill-opacity='0.1'%3E%3Cpath d='M40 40l20-20v40L40 40zm0 0L20 60V20l20 20z'/%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>

      <div className="flex relative z-10">
        {/* Enhanced Sidebar */}
        <div className="w-72 bg-white/98 backdrop-blur-xl shadow-2xl min-h-screen border-r border-red-100/50">
          {/* Logo Section */}
          <div className="p-8 border-b border-gray-100/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-xl hover:scale-105 transition-transform duration-300">
                <FaBolt className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-600 bg-clip-text text-transparent">
                  InstantFix
                </h1>
                <p className="text-sm text-gray-600 font-medium">Admin Dashboard</p>
              </div>
            </div>
          </div>

          {/* Enhanced Navigation Menu */}
          <nav className="p-6">
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Main Menu</h3>
              <ul className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                          activeTab === item.id
                            ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-xl transform scale-105'
                            : 'text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 hover:text-red-700 hover:shadow-md hover:transform hover:scale-102'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-gray-500 group-hover:text-red-600'} transition-colors duration-300`} />
                        <span className="font-semibold text-sm">{item.label}</span>
                        {activeTab === item.id && (
                          <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>

          {/* Enhanced Admin Section */}
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100/50">
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 shadow-inner">
              {/* Admin Profile */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                  {adminProfile.avatar ? (
                    <img src={adminProfile.avatar} alt="Admin" className="w-12 h-12 rounded-full" />
                  ) : (
                    <FaCog className="w-6 h-6 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800">
                    {adminProfile.name || 'Admin User'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {adminProfile.email || 'admin@instantfix.com'}
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-100 rounded-xl transition-all duration-300 hover:shadow-md"
              >
                <FaSignOutAlt className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content - Full Width */}
        <div className="flex-1 min-w-0">
          <div className="w-full h-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
