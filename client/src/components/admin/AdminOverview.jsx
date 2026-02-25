import React from 'react';
import { FaBolt, FaUsers, FaTools, FaClipboardList, FaChartLine, FaExclamationTriangle, FaCheckCircle, FaClock, FaCog, FaArrowUp, FaDollarSign } from 'react-icons/fa';

const AdminOverview = () => {
  const adminStats = [
    {
      title: 'Total Users',
      value: '1,247',
      icon: FaUsers,
      color: 'from-blue-400 to-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Total Electricians',
      value: '89',
      icon: FaTools,
      color: 'from-green-400 to-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Active Requests',
      value: '156',
      icon: FaClipboardList,
      color: 'from-yellow-400 to-amber-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      change: '+18%',
      changeType: 'positive'
    },
    {
      title: 'Revenue Today',
      value: '$4,280',
      icon: FaChartLine,
      color: 'from-purple-400 to-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      change: '+23%',
      changeType: 'positive'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      user: 'John Doe',
      action: 'created a new service request',
      time: '2 minutes ago',
      type: 'request'
    },
    {
      id: 2,
      user: 'Mike Smith',
      action: 'completed electrical repair',
      time: '15 minutes ago',
      type: 'completed'
    },
    {
      id: 3,
      user: 'Sarah Wilson',
      action: 'registered as new user',
      time: '1 hour ago',
      type: 'user'
    },
    {
      id: 4,
      user: 'Admin',
      action: 'approved new electrician',
      time: '2 hours ago',
      type: 'admin'
    }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'request':
        return FaClipboardList;
      case 'completed':
        return FaCheckCircle;
      case 'user':
        return FaUsers;
      case 'admin':
        return FaCog;
      default:
        return FaBolt;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'request':
        return 'text-yellow-500';
      case 'completed':
        return 'text-green-500';
      case 'user':
        return 'text-blue-500';
      case 'admin':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div>
      {/* Add CSS animations */}
      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes icon-bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>

      {/* Enhanced Header */}
      <div className="mb-10">
        <h2 className="text-5xl font-bold mb-4">
          Welcome back, <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">Admin</span>
        </h2>
        <p className="text-gray-600 text-lg">Here's what's happening with your platform today</p>
      </div>

      {/* Enhanced Admin Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
        {adminStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className="group bg-white/98 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-100/50 p-8 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative overflow-hidden"
              style={{
                animation: `slide-up 0.6s ease-out ${0.1 * (index + 1)}s both`
              }}
            >
              {/* Shimmer effect overlay */}
              <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div 
                    className={`w-20 h-20 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-500 group-hover:rotate-6`}
                    style={{
                      animation: `icon-bounce 3s ease-in-out ${0.1 * (index + 1)}s infinite`
                    }}
                  >
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-right">
                    <span className={`text-4xl font-bold ${stat.textColor} transition-all duration-300 hover:scale-110 block mb-1`}>
                      {stat.value}
                    </span>
                    <div className={`text-sm font-bold flex items-center gap-1 ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <FaArrowUp className="w-3 h-3" />
                      {stat.change}
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-700 transition-all duration-300 group-hover:text-gray-900">
                  {stat.title}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
        {/* Enhanced Recent Activities */}
        <div className="xl:col-span-2 bg-white/98 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-100/50 p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center">
                <FaClock className="w-5 h-5 text-white" />
              </div>
              Recent Activities
            </h3>
            <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
              View All →
            </button>
          </div>

          <div className="space-y-4">
            {recentActivities.map((activity, index) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <div 
                  key={activity.id} 
                  className="flex items-center gap-4 p-5 bg-gradient-to-r from-gray-50 to-white rounded-2xl hover:from-orange-50 hover:to-white transition-all duration-300 group cursor-pointer"
                  style={{
                    animation: `slide-up 0.5s ease-out ${0.1 * (index + 1)}s both`
                  }}
                >
                  <div className={`w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 ${getActivityColor(activity.type)}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-semibold">
                      <span className="text-gray-900">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                  </div>
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enhanced Quick Stats Sidebar */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105">
            <div className="flex items-center justify-between mb-6">
              <FaUsers className="w-12 h-12 text-white/80" />
              <div className="text-right">
                <p className="text-3xl font-bold">1,247</p>
                <p className="text-blue-100 text-sm">Total Users</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-blue-100">
              <FaArrowUp className="w-4 h-4" />
              <span className="text-sm font-semibold">+12% from last month</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105">
            <div className="flex items-center justify-between mb-6">
              <FaDollarSign className="w-12 h-12 text-white/80" />
              <div className="text-right">
                <p className="text-3xl font-bold">$4,280</p>
                <p className="text-green-100 text-sm">Today's Revenue</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-green-100">
              <FaArrowUp className="w-4 h-4" />
              <span className="text-sm font-semibold">+23% from yesterday</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="group bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-3xl p-10 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <FaExclamationTriangle className="w-14 h-14 mb-6 text-white/90" />
            <h3 className="text-2xl font-bold mb-4">Pending Approvals</h3>
            <p className="text-lg opacity-90 mb-8">3 electricians waiting for approval</p>
            <button className="bg-white text-red-600 px-8 py-4 rounded-2xl font-bold hover:bg-red-50 transition-all duration-300 hover:scale-105 shadow-lg">
              Review Now
            </button>
          </div>
        </div>

        <div className="group bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-3xl p-10 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <FaUsers className="w-14 h-14 mb-6 text-white/90" />
            <h3 className="text-2xl font-bold mb-4">User Management</h3>
            <p className="text-lg opacity-90 mb-8">Manage all platform users</p>
            <button className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all duration-300 hover:scale-105 shadow-lg">
              Manage Users
            </button>
          </div>
        </div>

        <div className="group bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 rounded-3xl p-10 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <FaChartLine className="w-14 h-14 mb-6 text-white/90" />
            <h3 className="text-2xl font-bold mb-4">View Analytics</h3>
            <p className="text-lg opacity-90 mb-8">Detailed platform insights</p>
            <button className="bg-white text-green-600 px-8 py-4 rounded-2xl font-bold hover:bg-green-50 transition-all duration-300 hover:scale-105 shadow-lg">
              View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
