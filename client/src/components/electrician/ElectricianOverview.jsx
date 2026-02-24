import React from 'react';
import { FaBolt, FaTools, FaClipboardList, FaCalendar, FaClock, FaCheckCircle, FaExclamationTriangle, FaMapMarkerAlt, FaStar } from 'react-icons/fa';

const ElectricianOverview = () => {
  const electricianStats = [
    {
      title: 'Total Jobs',
      value: '47',
      icon: FaTools,
      color: 'from-blue-400 to-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      change: '+5 this week',
      changeType: 'positive'
    },
    {
      title: 'Completed Today',
      value: '3',
      icon: FaCheckCircle,
      color: 'from-green-400 to-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      change: 'On track',
      changeType: 'positive'
    },
    {
      title: 'Pending Jobs',
      value: '2',
      icon: FaClock,
      color: 'from-yellow-400 to-amber-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      change: '2 urgent',
      changeType: 'warning'
    },
    {
      title: 'Earnings Today',
      value: '$285',
      icon: FaBolt,
      color: 'from-purple-400 to-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      change: '+15%',
      changeType: 'positive'
    }
  ];

  const todayJobs = [
    {
      id: 1,
      customer: 'John Doe',
      service: 'Fan Repair',
      location: '123 Main St, NY',
      time: '09:00 AM',
      status: 'completed',
      payment: '$85'
    },
    {
      id: 2,
      customer: 'Sarah Smith',
      service: 'Switch Installation',
      location: '456 Oak Ave, NY',
      time: '11:30 AM',
      status: 'completed',
      payment: '$120'
    },
    {
      id: 3,
      customer: 'Mike Wilson',
      service: 'Circuit Repair',
      location: '789 Pine Rd, NY',
      time: '02:00 PM',
      status: 'in-progress',
      payment: '$80'
    },
    {
      id: 4,
      customer: 'Emma Davis',
      service: 'Light Installation',
      location: '321 Elm St, NY',
      time: '04:30 PM',
      status: 'pending',
      payment: '$95'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return FaCheckCircle;
      case 'in-progress':
        return FaTools;
      case 'pending':
        return FaClock;
      default:
        return FaClipboardList;
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
          Welcome back, <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">Mike</span>
        </h2>
      </div>

      {/* Electrician Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-10">
        {electricianStats.map((stat, index) => {
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
                    stat.changeType === 'positive' ? 'text-green-600' : 
                    stat.changeType === 'warning' ? 'text-yellow-600' : 'text-red-600'
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

      {/* Today's Jobs */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <FaCalendar className="w-6 h-6 text-green-500" />
            Today's Schedule
          </h3>
          <button className="text-green-600 hover:text-green-700 font-medium text-sm">
            View Full Schedule →
          </button>
        </div>

        <div className="space-y-4">
          {todayJobs.map((job) => {
            const StatusIcon = getStatusIcon(job.status);
            return (
              <div key={job.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className={`w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm`}>
                  <StatusIcon className={`w-6 h-6 ${
                    job.status === 'completed' ? 'text-green-500' :
                    job.status === 'in-progress' ? 'text-blue-500' : 'text-yellow-500'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-gray-800">{job.customer}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{job.service}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FaMapMarkerAlt className="w-3 h-3" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaClock className="w-3 h-3" />
                      {job.time}
                    </span>
                    <span className="font-semibold text-green-600">{job.payment}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-8 text-white shadow-lg hover:shadow-xl transition-shadow">
          <FaTools className="w-10 h-10 mb-4" />
          <h3 className="text-xl font-bold mb-3">Start New Job</h3>
          <p className="text-base opacity-90 mb-6">Begin work on your next service request</p>
          <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors">
            Start Working
          </button>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white shadow-lg hover:shadow-xl transition-shadow">
          <FaCalendar className="w-10 h-10 mb-4" />
          <h3 className="text-xl font-bold mb-3">Update Schedule</h3>
          <p className="text-base opacity-90 mb-6">Manage your availability and appointments</p>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            Manage Calendar
          </button>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg hover:shadow-xl transition-shadow">
          <FaStar className="w-10 h-10 mb-4" />
          <h3 className="text-xl font-bold mb-3">My Performance</h3>
          <p className="text-base opacity-90 mb-6">View your ratings and work statistics</p>
          <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
            View Stats
          </button>
        </div>
      </div>
    </div>
  );
};

export default ElectricianOverview;
