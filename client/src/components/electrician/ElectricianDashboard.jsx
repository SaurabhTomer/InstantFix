import React, { useState, useEffect } from 'react';
import { FaBolt, FaBell, FaMapMarkerAlt, FaUserCircle, FaSpinner } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import ElectricianDashboardLayout from './ElectricianDashboardLayout';
import ElectricianOverview from './ElectricianOverview';

const ElectricianDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(true);

  // Get current location from Redux
  const { currentCity, currentState, currentAddress, latitude, longitude } = useSelector((state) => state.user);

  // Check if location is still loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentCity || currentState) {
        setIsLocationLoading(false);
      }
    }, 3000);

    if (currentCity || currentState) {
      setIsLocationLoading(false);
      clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  }, [currentCity, currentState]);

  // Mock electrician notifications
  useEffect(() => {
    const mockNotifications = [
      { id: 1, message: 'New service request assigned to you', time: '5 minutes ago', read: false },
      { id: 2, message: 'Customer rated your service 5 stars', time: '1 hour ago', read: false },
      { id: 3, message: 'Payment received for job #1234', time: '2 hours ago', read: true },
      { id: 4, message: 'Schedule reminder: Job at 3:00 PM', time: '3 hours ago', read: false },
    ];
    setNotifications(mockNotifications);
  }, []);

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
        return <ElectricianOverview />;
      case 'jobs':
        return <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">My Jobs</h3>
          <p className="text-gray-600">Jobs management component coming soon...</p>
        </div>;
      case 'schedule':
        return <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">My Schedule</h3>
          <p className="text-gray-600">Schedule management component coming soon...</p>
        </div>;
      case 'requests':
        return <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Service Requests</h3>
          <p className="text-gray-600">Service requests component coming soon...</p>
        </div>;
      case 'settings':
        return <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Settings</h3>
          <p className="text-gray-600">Settings component coming soon...</p>
        </div>;
      default:
        return <ElectricianOverview />;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Add CSS keyframes for animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>

      {/* Top Navigation Bar */}
      <div className="relative z-20 bg-white/95 backdrop-blur-sm shadow-sm border-b border-green-200/50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Location Only */}
            <div className="flex items-center gap-4 flex-1">
              {/* Location Display */}
              <div className="hidden md:flex flex-1 max-w-lg">
                <div className="relative w-full">
                  <FaMapMarkerAlt className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-all duration-500 ${
                    isLocationLoading ? 'text-green-500 animate-pulse' : 'text-green-500'
                  }`} />
                  <div className={`w-full pl-10 pr-4 py-2 border rounded-lg flex items-center transition-all duration-500 ${
                    isLocationLoading 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}>
                    {isLocationLoading ? (
                      <div className="flex items-center gap-2">
                        <FaSpinner className="w-4 h-4 text-green-500 animate-spin" />
                        <span className="text-sm text-green-700">Detecting location...</span>
                      </div>
                    ) : (
                      <span 
                        className="text-sm text-gray-700"
                        style={{
                          animation: 'fade-in 0.5s ease-out'
                        }}
                      >
                        {currentAddress ? currentAddress : 
                         currentCity && currentState ? `${currentCity}, ${currentState}` : 
                         'Location not available'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Status, Notifications and User */}
            <div className="flex items-center gap-3">
              {/* Available Status Badge */}
              <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-700">Available</span>
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 hover:text-green-600 transition-all duration-300 hover:scale-110"
                >
                  <FaBell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span 
                      className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center"
                      style={{
                        animation: 'scale-in 0.3s ease-out'
                      }}
                    >
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
                              !notif.read ? 'bg-green-50' : ''
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
              <div className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-300 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                  <FaUserCircle className="w-5 h-5 text-white" />
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700">Mike Johnson</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="relative z-10 flex">
        <ElectricianDashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
          <div className="p-6 space-y-6">
            {/* Page Header */}
            <div 
              className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6"
              style={{
                animation: 'slide-in 0.4s ease-out'
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p 
                    className="text-gray-600"
                    style={{
                      animation: 'fade-in 0.6s ease-out'
                    }}
                  >
                    {activeTab === 'overview' && 'Manage your electrical service work and schedule'}
                    {activeTab === 'jobs' && 'Track and manage all your assigned jobs'}
                    {activeTab === 'schedule' && 'View and manage your work schedule'}
                    {activeTab === 'requests' && 'Browse and accept new service requests'}
                    {activeTab === 'settings' && 'Configure your profile and preferences'}
                  </p>
                </div>
              </div>
            </div>

            {/* Dynamic Content */}
            {renderContent()}
          </div>
        </ElectricianDashboardLayout>
      </div>

      {/* Mobile Location Display */}
      <div className="md:hidden fixed bottom-20 left-4 right-4 z-30">
        <div className="relative">
          <FaMapMarkerAlt className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-all duration-500 ${
            isLocationLoading ? 'text-green-500 animate-pulse' : 'text-green-500'
          }`} />
          <div className={`w-full pl-10 pr-4 py-3 border rounded-lg flex items-center shadow-lg transition-all duration-500 ${
            isLocationLoading 
              ? 'border-green-300 bg-green-50' 
              : 'border-gray-200 bg-white'
          }`}>
            {isLocationLoading ? (
              <div className="flex items-center gap-2">
                <FaSpinner className="w-4 h-4 text-green-500 animate-spin" />
                <span className="text-sm text-green-700">Detecting location...</span>
              </div>
            ) : (
              <span 
                className="text-sm text-gray-700"
                style={{
                  animation: 'fade-in 0.5s ease-out'
                }}
              >
                {currentAddress ? currentAddress : 
                 currentCity && currentState ? `${currentCity}, ${currentState}` : 
                 'Location not available'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectricianDashboard;
