import React, { useState, useEffect } from 'react';
import { FaBolt, FaBell, FaMapMarkerAlt, FaUserCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import DashboardLayout from './DashboardLayout';
import Overview from './Overview';
import MyRequests from './MyRequests';
import Services from './Services';
import Profile from './Profile';
import Settings from './Settings';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Get current location from Redux
  const { currentCity, currentState, currentAddress } = useSelector((state) => state.user);

  // Mock data for notifications
  useEffect(() => {
    // Simulate fetching notifications
    const mockNotifications = [
      { id: 1, message: 'Your service request #SR001 has been approved', time: '2 hours ago', read: false },
      { id: 2, message: 'Electrician John Smith is on his way', time: '30 minutes ago', read: false },
      { id: 3, message: 'Service completed for request #SR002', time: '1 day ago', read: true },
    ];
    setNotifications(mockNotifications);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Close mobile menu if needed
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />;
      case 'requests':
        return <MyRequests />;
      case 'services':
        return <Services />;
      case 'profile':
        return <Profile />;
      case 'settings':
        return <Settings />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Top Navigation Bar */}
      <div className="relative z-20 bg-white/95 backdrop-blur-sm shadow-sm border-b border-yellow-200/50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Location Only */}
            <div className="flex items-center gap-4 flex-1">
              {/* Location Display */}
              <div className="hidden md:flex flex-1 max-w-lg">
                <div className="relative w-full">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500 w-4 h-4" />
                  <div className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 flex items-center">
                    <span className="text-sm text-gray-700">
                      {currentCity && currentState ? `${currentCity}, ${currentState}` : 'Location not available'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Notifications and User */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 hover:text-yellow-600 transition-colors"
                >
                  <FaBell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-800">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map(notif => (
                          <div
                            key={notif.id}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                              !notif.read ? 'bg-yellow-50' : ''
                            }`}
                            onClick={() => markNotificationAsRead(notif.id)}
                          >
                            <p className="text-sm text-gray-800">{notif.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          No notifications
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
                  <FaUserCircle className="w-5 h-5 text-white" />
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700">John Doe</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="relative z-10 flex">
        <DashboardLayout activeTab={activeTab} setActiveTab={handleTabChange}>
          <div className="space-y-6">
            {/* Page Header */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 capitalize">
                    {activeTab === 'overview' && 'Dashboard Overview'}
                    {activeTab === 'requests' && 'My Service Requests'}
                    {activeTab === 'services' && 'Available Services'}
                    {activeTab === 'profile' && 'My Profile'}
                    {activeTab === 'settings' && 'Settings'}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {activeTab === 'overview' && 'Welcome back! Here\'s what\'s happening with your electrical services.'}
                    {activeTab === 'requests' && 'Track and manage all your electrical service requests.'}
                    {activeTab === 'services' && 'Browse and book professional electrical services.'}
                    {activeTab === 'profile' && 'Manage your personal information and preferences.'}
                    {activeTab === 'settings' && 'Customize your account settings and preferences.'}
                  </p>
                </div>
                
                {/* Quick Actions */}
                {activeTab === 'overview' && (
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white rounded-lg hover:from-yellow-500 hover:to-amber-600 transition-all shadow-lg">
                      Create Request
                    </button>
                    <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      View History
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Dynamic Content */}
            {renderContent()}
          </div>
        </DashboardLayout>
      </div>

      {/* Mobile Location Display */}
      <div className="md:hidden fixed bottom-20 left-4 right-4 z-30">
        <div className="relative">
          <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500 w-4 h-4" />
          <div className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-white shadow-lg flex items-center">
            <span className="text-sm text-gray-700">
              {currentCity && currentState ? `${currentCity}, ${currentState}` : 'Location not available'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
