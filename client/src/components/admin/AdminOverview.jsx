import React from 'react';
import { FaBolt, FaUsers, FaTools, FaClipboardList, FaChartLine, FaExclamationTriangle, FaCheckCircle, FaClock, FaCog } from 'react-icons/fa';

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
      `}</style>

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">
          Welcome back, <span className="bg-gradient-to-r from-red-500 to-orange-600 bg-clip-text text-transparent">Admin</span>
        </h2>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-10">
        {adminStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              style={{
                animation: `slide-up 0.5s ease-out ${0.1 * (index + 1)}s both`
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <div 
                  className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300`}
                  style={{
                    animation: `icon-bounce 2s ease-in-out ${0.1 * (index + 1)}s infinite`
                  }}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-right">
                  <span className={`text-3xl font-bold ${stat.textColor} transition-transform duration-300 hover:scale-110`}>
                    {stat.value}
                  </span>
                  <div className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 transition-colors duration-300 hover:text-gray-900">
                {stat.title}
              </h3>
            </div>
          );
        })}
      </div>

      {/* Recent Activities */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-4 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <FaClock className="w-4 h-4 text-orange-500" />
            Recent Activities
          </h3>
          <button className="text-orange-600 hover:text-orange-700 font-medium text-sm">
            View All →
          </button>
        </div>

        <div className="space-y-3">
          {recentActivities.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            return (
              <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className={`w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm`}>
                  <Icon className={`w-4 h-4 ${getActivityColor(activity.type)}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">
                    <span className="font-semibold">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-8">
        <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl p-8 text-white shadow-lg hover:shadow-xl transition-shadow">
          <FaExclamationTriangle className="w-10 h-10 mb-4" />
          <h3 className="text-xl font-bold mb-3">Pending Approvals</h3>
          <p className="text-base opacity-90 mb-6">3 electricians waiting for approval</p>
          <button className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors">
            Review Now
          </button>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white shadow-lg hover:shadow-xl transition-shadow">
          <FaUsers className="w-10 h-10 mb-4" />
          <h3 className="text-xl font-bold mb-3">User Management</h3>
          <p className="text-base opacity-90 mb-6">Manage all platform users</p>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            Manage Users
          </button>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white shadow-lg hover:shadow-xl transition-shadow">
          <FaChartLine className="w-10 h-10 mb-4" />
          <h3 className="text-xl font-bold mb-3">View Analytics</h3>
          <p className="text-base opacity-90 mb-6">Detailed platform insights</p>
          <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors">
            View Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
