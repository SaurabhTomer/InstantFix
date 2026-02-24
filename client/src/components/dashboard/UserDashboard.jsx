import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaBolt, FaBell, FaMapMarkerAlt, FaUserCircle, FaSpinner, FaClock, FaCheckCircle, FaTools, FaClipboardList, FaTimes, FaCheck } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import DashboardLayout from './DashboardLayout';
import Overview from './Overview';
import MyRequests from './MyRequests';
import Services from './Services';
import Profile from './Profile';
import Settings from './Settings';

const UserDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(true);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);

  // Get current location and user data from Redux
  const { currentCity, currentState, currentAddress, latitude, longitude, userData } = useSelector((state) => state.user);

  // Handle URL parameter for tab navigation
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['overview', 'requests', 'services', 'profile', 'settings'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
    // Close mobile menu if needed
  };

  // Fetch real notifications from backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `${serverUrl}/api/notifications`,
          { withCredentials: true }
        );
        
        if (response.data.success) {
          setNotifications(response.data.notifications);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        toast.error('Failed to load notifications');
      } finally {
        setIsLoadingNotifications(false);
      }
    };

    fetchNotifications();
    
    // Set up polling for real-time updates (every 30 seconds)
    const interval = setInterval(fetchNotifications, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notification-dropdown')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  // Check if location is still loading
  useEffect(() => {
    const timer = setTimeout(() => {
      // Consider location loaded after 3 seconds or if we have data
      if (currentCity || currentState) {
        setIsLocationLoading(false);
      }
    }, 3000);

    // If we already have location data, stop loading immediately
    if (currentCity || currentState) {
      setIsLocationLoading(false);
      clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  }, [currentCity, currentState]);

  // Mark notification as read
  const markNotificationAsRead = async (id) => {
    try {
      const response = await axios.patch(
        `${serverUrl}/api/notifications/${id}`,
        {},
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setNotifications(prev => 
          prev.map(notif => 
            notif._id === id ? { ...notif, isRead: true } : notif
          )
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Delete notification
  const deleteNotification = async (id) => {
    try {
      const response = await axios.delete(
        `${serverUrl}/api/notifications/${id}`,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setNotifications(prev => prev.filter(notif => notif._id !== id));
        toast.success('Notification deleted');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Format notification time
  const formatNotificationTime = (createdAt) => {
    const now = new Date();
    const notifTime = new Date(createdAt);
    const diffMs = now - notifTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return notifTime.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: notifTime.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

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
      <div className="relative z-20 bg-white/95 backdrop-blur-sm shadow-sm border-b border-yellow-200/50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Location Only */}
            <div className="flex items-center gap-4 flex-1">
              {/* Location Display */}
              <div className="hidden md:flex flex-1 max-w-lg">
                <div className="relative w-full">
                  <FaMapMarkerAlt className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-all duration-500 ${
                    isLocationLoading ? 'text-yellow-500 animate-pulse' : 'text-red-500'
                  }`} />
                  <div className={`w-full pl-10 pr-4 py-2 border rounded-lg flex items-center transition-all duration-500 ${
                    isLocationLoading 
                      ? 'border-yellow-300 bg-yellow-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}>
                    {isLocationLoading ? (
                      <div className="flex items-center gap-2">
                        <FaSpinner className="w-4 h-4 text-yellow-500 animate-spin" />
                        <span className="text-sm text-yellow-700">Detecting your location...</span>
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

            {/* Right side - Support, Notifications and User */}
            <div className="flex items-center gap-3">
              {/* Support Hours */}
              <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-all duration-300 hover:scale-105">
                <FaClock className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700">24/7 Support</span>
              </div>

              {/* Notifications */}
              <div className="relative notification-dropdown">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 hover:text-yellow-600 transition-all duration-300 hover:scale-110"
                >
                  <FaBell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span 
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
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
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="font-semibold text-gray-800">Notifications</h3>
                      {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {isLoadingNotifications ? (
                        <div className="flex items-center justify-center py-8">
                          <FaSpinner className="w-5 h-5 animate-spin text-blue-500 mr-2" />
                          <span className="text-gray-600">Loading notifications...</span>
                        </div>
                      ) : notifications.length > 0 ? (
                        notifications.map(notif => (
                          <div
                            key={notif._id}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                              !notif.isRead ? 'bg-yellow-50' : ''
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div 
                                className="flex-1 cursor-pointer"
                                onClick={() => !notif.isRead && markNotificationAsRead(notif._id)}
                              >
                                <p className="text-sm font-medium text-gray-800 mb-1">
                                  {notif.title}
                                </p>
                                <p className="text-sm text-gray-600 mb-2">
                                  {notif.message}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatNotificationTime(notif.createdAt)}
                                </p>
                              </div>
                              <div className="flex gap-1 ml-2">
                                {!notif.isRead && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      markNotificationAsRead(notif._id);
                                    }}
                                    className="text-green-600 hover:text-green-700 p-1"
                                    title="Mark as read"
                                  >
                                    <FaCheck className="w-3 h-3" />
                                  </button>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notif._id);
                                  }}
                                  className="text-red-600 hover:text-red-700 p-1"
                                  title="Delete notification"
                                >
                                  <FaTimes className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center">
                          <FaBell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">No notifications yet</p>
                          <p className="text-xs text-gray-400 mt-1">We'll notify you about updates</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-300 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                  <FaUserCircle className="w-5 h-5 text-white" />
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700">{userData?.user?.name || 'John Doe'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="relative z-10 flex">
        <DashboardLayout activeTab={activeTab} setActiveTab={handleTabChange}>
          <div className="space-y-8">
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
                    <Link 
                      to="/create-request"
                      className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white rounded-lg hover:from-yellow-500 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 inline-block"
                      style={{
                        animation: 'scale-in 0.5s ease-out'
                      }}
                    >
                      Create Request
                    </Link>
                    <button 
                      className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 hover:shadow-md"
                      style={{
                        animation: 'scale-in 0.6s ease-out'
                      }}
                    >
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
          <FaMapMarkerAlt className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-all duration-500 ${
            isLocationLoading ? 'text-yellow-500 animate-pulse' : 'text-red-500'
          }`} />
          <div className={`w-full pl-10 pr-4 py-3 border rounded-lg flex items-center shadow-lg transition-all duration-500 ${
            isLocationLoading 
              ? 'border-yellow-300 bg-yellow-50' 
              : 'border-gray-200 bg-white'
          }`}>
            {isLocationLoading ? (
              <div className="flex items-center gap-2">
                <FaSpinner className="w-4 h-4 text-yellow-500 animate-spin" />
                <span className="text-sm text-yellow-700">Detecting location...</span>
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

export default UserDashboard;
