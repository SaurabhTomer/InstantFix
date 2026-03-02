import React, { useState, useEffect } from 'react';
import { FaBolt, FaTools, FaClipboardList, FaCalendar, FaClock, FaCheckCircle, FaExclamationTriangle, FaMapMarkerAlt, FaStar, FaSync, FaLocationArrow } from 'react-icons/fa';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { setUserData } from '../../redux/userSlice';

const ElectricianOverview = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    completedJobs: 0,
    pendingJobs: 0,
    inProgressJobs: 0,
    todayJobs: 0,
    todayCompleted: 0,
    todayEarnings: 0,
    weeklyJobs: 0
  });
  const [todayJobs, setTodayJobs] = useState([]);
  const [nearbyRequests, setNearbyRequests] = useState([]);
  const [nearbyError, setNearbyError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  // Fetch electrician data
  useEffect(() => {
    fetchElectricianData();
    
    // Set up real-time polling
    const interval = setInterval(() => {
      fetchElectricianData();
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchElectricianData = async () => {
    try {
      setLoading(true);
      
      let nearby = [];
      let nearbyError = null;
      let assigned = [];
      let completed = [];

      // Fetch nearby requests (may fail if location not set or not approved)
      try {
        const nearbyResponse = await axios.get(`${serverUrl}/api/electrician/nearby-requests`, {
          withCredentials: true
        });
        nearby = nearbyResponse.data.requests || [];
      } catch (nearbyError) {
        const errorMsg = nearbyError.response?.data?.message || 'Location/approval required';
        console.log('Nearby requests failed:', errorMsg);
        nearbyError = errorMsg;
        // Don't show toast for this expected error
      }
      
      // Fetch assigned requests
      try {
        const assignedResponse = await axios.get(`${serverUrl}/api/electrician/assigned-requests`, {
          withCredentials: true
        });
        assigned = assignedResponse.data.requests || [];
      } catch (assignedError) {
        console.error('Assigned requests error:', assignedError);
        toast.error('Failed to fetch assigned requests');
      }
      
      // Fetch completed requests
      try {
        const completedResponse = await axios.get(`${serverUrl}/api/electrician/completed-requests`, {
          withCredentials: true
        });
        completed = completedResponse.data.requests || [];
      } catch (completedError) {
        console.error('Completed requests error:', completedError);
        toast.error('Failed to fetch completed requests');
      }

      // Calculate stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayAssigned = assigned.filter(job => 
        new Date(job.createdAt) >= today
      );
      
      const todayCompleted = completed.filter(job => 
        job.completedAt && new Date(job.completedAt) >= today
      );

      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const weeklyJobs = [...assigned, ...completed].filter(job => 
        new Date(job.createdAt) >= weekAgo
      ).length;

      const newStats = {
        totalJobs: assigned.length + completed.length,
        completedJobs: completed.length,
        pendingJobs: nearby.length,
        inProgressJobs: assigned.filter(job => job.status === 'in-progress').length,
        todayJobs: todayAssigned.length,
        todayCompleted: todayCompleted.length,
        todayEarnings: todayCompleted.length * 95, // Assuming $95 per job
        weeklyJobs
      };

      setStats(newStats);
      setTodayJobs(todayAssigned);
      setNearbyRequests(nearby.slice(0, 3)); // Show only first 3
      setLastUpdated(new Date());
      
      // Store nearby error for UI display
      if (nearbyError) {
        setNearbyError(nearbyError);
      }
      
    } catch (error) {
      console.error('Error fetching electrician data:', error);
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await axios.patch(`${serverUrl}/api/electrician/requests/${requestId}/accept`, {}, {
        withCredentials: true
      });
      toast.success('Request accepted successfully');
      fetchElectricianData();
    } catch (error) {
      console.error('Error accepting request:', error);
      toast.error(error.response?.data?.message || 'Failed to accept request');
    }
  };

  const handleStartJob = async (requestId) => {
    try {
      await axios.patch(`${serverUrl}/api/electrician/requests/${requestId}/start`, {}, {
        withCredentials: true
      });
      toast.success('Job started successfully');
      fetchElectricianData();
    } catch (error) {
      console.error('Error starting job:', error);
      toast.error(error.response?.data?.message || 'Failed to start job');
    }
  };

  const handleCompleteJob = async (requestId) => {
    try {
      await axios.patch(`${serverUrl}/api/electrician/requests/${requestId}/complete`, {}, {
        withCredentials: true
      });
      toast.success('Job completed successfully');
      fetchElectricianData();
    } catch (error) {
      console.error('Error completing job:', error);
      toast.error(error.response?.data?.message || 'Failed to complete job');
    }
  };

  const handleSetLocation = async () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    try {
      toast.info('Getting your location...');
      
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Update location on backend
      const response = await axios.patch(`${serverUrl}/api/electrician/set-location`, {
        location: {
          type: "Point",
          coordinates: [longitude, latitude]
        }
      }, {
        withCredentials: true
      });

      toast.success('Location set successfully!');
      setNearbyError(null);
      
      // Refresh data to get nearby requests
      fetchElectricianData();
      
    } catch (error) {
      console.error('Error setting location:', error);
      if (error.code === 1) {
        toast.error('Location access denied. Please enable location permissions.');
      } else if (error.code === 2) {
        toast.error('Unable to retrieve your location. Please try again.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to set location');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome back, <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">{userData?.name || 'Electrician'}</span>
          </h2>
          <p className="text-gray-600">Last updated: {lastUpdated.toLocaleTimeString()}</p>
        </div>
        <button
          onClick={fetchElectricianData}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <FaSync className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Electrician Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-10">
        {[
          {
            title: 'Total Jobs',
            value: stats.totalJobs.toString(),
            icon: FaTools,
            color: 'from-blue-400 to-blue-500',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600',
            change: `+${stats.weeklyJobs} this week`,
            changeType: 'positive'
          },
          {
            title: 'Completed Today',
            value: stats.todayCompleted.toString(),
            icon: FaCheckCircle,
            color: 'from-green-400 to-green-500',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600',
            change: 'On track',
            changeType: 'positive'
          },
          {
            title: 'Pending Jobs',
            value: stats.pendingJobs.toString(),
            icon: FaClock,
            color: 'from-yellow-400 to-amber-500',
            bgColor: 'bg-yellow-50',
            textColor: 'text-yellow-600',
            change: `${stats.inProgressJobs} in progress`,
            changeType: 'warning'
          },
          {
            title: 'Earnings Today',
            value: `$${stats.todayEarnings}`,
            icon: FaBolt,
            color: 'from-purple-400 to-purple-500',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600',
            change: '+15%',
            changeType: 'positive'
          }
        ].map((stat, index) => {
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
          {todayJobs.length > 0 ? (
            todayJobs.map((job) => {
              const StatusIcon = getStatusIcon(job.status);
              return (
                <div key={job._id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className={`w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm`}>
                    <StatusIcon className={`w-6 h-6 ${
                      job.status === 'completed' ? 'text-green-500' :
                      job.status === 'in-progress' ? 'text-blue-500' : 'text-yellow-500'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-gray-800">{job.customer?.name || 'Unknown Customer'}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{job.issueType}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaMapMarkerAlt className="w-3 h-3" />
                        {job.address?.city || 'Location N/A'}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaClock className="w-3 h-3" />
                        {new Date(job.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                      <span className="font-semibold text-green-600">$95</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {job.status === 'accepted' && (
                        <button
                          onClick={() => handleStartJob(job._id)}
                          className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                        >
                          Start Job
                        </button>
                      )}
                      {job.status === 'in-progress' && (
                        <button
                          onClick={() => handleCompleteJob(job._id)}
                          className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
                        >
                          Complete Job
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <FaCalendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No jobs scheduled for today</p>
              <p className="text-sm text-gray-400 mt-1">Check nearby requests for new opportunities</p>
            </div>
          )}
        </div>
      </div>

      {/* Setup Reminder - Show when nearby requests are unavailable */}
      {nearbyError && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="bg-amber-100 rounded-full p-3 flex-shrink-0">
              <FaExclamationTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-amber-800 mb-2">Setup Required for Nearby Requests</h3>
              <p className="text-amber-700 mb-3">
                {nearbyError === 'Electrician location not set' 
                  ? 'To see nearby service requests, you need to set your location. Click below to use your current location or enter it manually in your profile.'
                  : nearbyError === 'Electrician not approved'
                  ? 'Your account is pending admin approval. Once approved, you\'ll see nearby requests.'
                  : 'Complete your profile setup to access all features.'
                }
              </p>
              <div className="flex gap-3 flex-wrap">
                {nearbyError === 'Electrician location not set' && (
                  <>
                    <button 
                      onClick={handleSetLocation}
                      className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      <FaLocationArrow className="w-4 h-4" />
                      Use Current Location
                    </button>
                    <button className="px-4 py-2 bg-white text-amber-600 border border-amber-300 rounded-lg hover:bg-amber-50 transition-colors text-sm font-medium">
                      Set Location Manually →
                    </button>
                  </>
                )}
                {nearbyError === 'Electrician not approved' && (
                  <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium">
                    Contact Support
                  </button>
                )}
                <button 
                  onClick={() => setNearbyError(null)}
                  className="px-4 py-2 text-amber-600 hover:text-amber-700 transition-colors text-sm font-medium"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
