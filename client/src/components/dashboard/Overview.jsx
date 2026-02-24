import React from 'react';
import { FaBolt, FaClipboardList, FaTools, FaClock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const Overview = () => {
  const stats = [
    {
      title: 'Total Requests',
      value: '12',
      icon: FaClipboardList,
      color: 'from-blue-400 to-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Pending',
      value: '3',
      icon: FaClock,
      color: 'from-yellow-400 to-amber-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Completed',
      value: '8',
      icon: FaCheckCircle,
      color: 'from-green-400 to-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'In Progress',
      value: '1',
      icon: FaTools,
      color: 'from-purple-400 to-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ];

  const recentRequests = [
    {
      id: 1,
      service: 'Fan not working',
      status: 'pending',
      date: '2024-02-24',
      priority: 'medium'
    },
    {
      id: 2,
      service: 'Switch board issue',
      status: 'completed',
      date: '2024-02-23',
      priority: 'low'
    },
    {
      id: 3,
      service: 'Wiring problem',
      status: 'in-progress',
      date: '2024-02-22',
      priority: 'high'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Welcome back! Here's what's happening with your electrical service requests.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</span>
              </div>
              <h3 className="text-gray-700 font-semibold">{stat.title}</h3>
            </div>
          );
        })}
      </div>

      {/* Recent Requests */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FaClipboardList className="w-5 h-5 text-blue-500" />
            Recent Requests
          </h3>
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            View All →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Service</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Priority</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentRequests.map((request) => (
                <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <FaBolt className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium text-gray-800">{request.service}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(request.priority)}`}>
                      {request.priority}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{request.date}</td>
                  <td className="py-4 px-4">
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl p-6 text-white shadow-lg">
          <FaExclamationTriangle className="w-8 h-8 mb-3" />
          <h3 className="text-lg font-bold mb-2">Emergency Service</h3>
          <p className="text-sm opacity-90 mb-4">Need immediate electrical assistance?</p>
          <button className="bg-white text-yellow-600 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-50 transition-colors">
            Request Now
          </button>
        </div>

        <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl p-6 text-white shadow-lg">
          <FaTools className="w-8 h-8 mb-3" />
          <h3 className="text-lg font-bold mb-2">Schedule Service</h3>
          <p className="text-sm opacity-90 mb-4">Book an appointment at your convenience</p>
          <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            Schedule
          </button>
        </div>

        <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-2xl p-6 text-white shadow-lg">
          <FaCheckCircle className="w-8 h-8 mb-3" />
          <h3 className="text-lg font-bold mb-2">Track Request</h3>
          <p className="text-sm opacity-90 mb-4">Monitor your service request status</p>
          <button className="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition-colors">
            Track
          </button>
        </div>
      </div>
    </div>
  );
};

export default Overview;
