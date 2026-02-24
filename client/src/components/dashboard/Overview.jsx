import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaBolt, FaClipboardList, FaTools, FaClock, FaCheckCircle, FaExclamationTriangle, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';

const Overview = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { requestCounts, userData } = useSelector((state) => state.user);
  const [recentRequests, setRecentRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Calculate total requests from Redux
  const totalRequests = requestCounts.pending + requestCounts.accepted + 
                        requestCounts['in-progress'] + requestCounts.completed + 
                        requestCounts.cancelled;

  // Fetch recent requests
  useEffect(() => {
    const fetchRecentRequests = async () => {
      try {
        const response = await axios.get(
          `${serverUrl}/api/service/by-status`,
          { withCredentials: true }
        );
        
        if (response.data.success) {
          // Flatten all requests and sort by date (most recent first)
          const allRequests = [
            ...response.data.requests.pending,
            ...response.data.requests.accepted,
            ...response.data.requests['in-progress'],
            ...response.data.requests.completed,
            ...response.data.requests.cancelled
          ];
          
          // Sort by creation date (newest first) and take first 5
          const sortedRequests = allRequests
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);
          
          setRecentRequests(sortedRequests);
        }
      } catch (error) {
        console.error('Error fetching recent requests:', error);
        toast.error('Failed to load recent requests');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentRequests();
  }, []);

  const stats = [
    {
      title: 'Total Requests',
      value: totalRequests.toString(),
      icon: FaClipboardList,
      color: 'from-blue-400 to-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      animationDelay: '0.1s'
    },
    {
      title: 'Pending',
      value: requestCounts.pending.toString(),
      icon: FaClock,
      color: 'from-yellow-400 to-amber-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      animationDelay: '0.2s'
    },
    {
      title: 'Completed',
      value: requestCounts.completed.toString(),
      icon: FaCheckCircle,
      color: 'from-green-400 to-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      animationDelay: '0.3s'
    },
    {
      title: 'In Progress',
      value: requestCounts['in-progress'].toString(),
      icon: FaTools,
      color: 'from-purple-400 to-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      animationDelay: '0.4s'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
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
          Welcome back, <span className="bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent">
            {userData?.user?.name || 'User'}
          </span>
        </h2>
        <p className="text-gray-600">Here's what's happening with your electrical service requests today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              style={{
                animation: `slide-up 0.5s ease-out ${stat.animationDelay} both`
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div 
                  className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300`}
                  style={{
                    animation: `icon-bounce 2s ease-in-out ${stat.animationDelay} infinite`
                  }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-2xl font-bold ${stat.textColor} transition-transform duration-300 hover:scale-110`}>
                  {stat.value}
                </span>
              </div>
              <h3 className="text-gray-700 font-semibold transition-colors duration-300 hover:text-gray-900">
                {stat.title}
              </h3>
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
          <button 
            onClick={() => navigate('?tab=requests')}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
          >
            View All →
          </button>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600">Loading recent requests...</span>
            </div>
          ) : recentRequests.length === 0 ? (
            <div className="text-center py-8">
              <FaClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No recent requests found</p>
              <button 
                onClick={() => navigate('?tab=create-request')}
                className="mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Create your first request →
              </button>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Service</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map((request) => (
                  <tr key={request._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <FaBolt className="w-4 h-4 text-yellow-500" />
                        <span className="font-medium text-gray-800">{request.issueType || 'Electrical Service'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{formatDate(request.createdAt)}</td>
                    <td className="py-4 px-4">
                      <button 
                        onClick={() => navigate(`/user/requests/${request._id}`)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                      >
                        <FaEye className="w-3 h-3" />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl p-6 text-white shadow-lg">
          <FaExclamationTriangle className="w-8 h-8 mb-3" />
          <h3 className="text-lg font-bold mb-2">Emergency Service</h3>
          <p className="text-sm opacity-90 mb-4">Need immediate electrical assistance?</p>
          <button 
            onClick={() => navigate('?tab=create-request')}
            className="bg-white text-yellow-600 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-50 transition-colors"
          >
            Request Now
          </button>
        </div>

        <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl p-6 text-white shadow-lg">
          <FaTools className="w-8 h-8 mb-3" />
          <h3 className="text-lg font-bold mb-2">Schedule Service</h3>
          <p className="text-sm opacity-90 mb-4">Book an appointment at your convenience</p>
          <button 
            onClick={() => navigate('?tab=create-request')}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Schedule
          </button>
        </div>

        <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-2xl p-6 text-white shadow-lg">
          <FaCheckCircle className="w-8 h-8 mb-3" />
          <h3 className="text-lg font-bold mb-2">Track Request</h3>
          <p className="text-sm opacity-90 mb-4">Monitor your service request status</p>
          <button 
            onClick={() => navigate('?tab=requests')}
            className="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition-colors"
          >
            Track
          </button>
        </div>
      </div>
    </div>
  );
};

export default Overview;
