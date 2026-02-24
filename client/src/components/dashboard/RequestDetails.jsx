import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaTools, FaBolt, FaLightbulb, FaPlug, FaFan, FaCalendar, FaMapMarkerAlt, FaUser, FaCheckCircle, FaExclamationTriangle, FaSpinner, FaClock, FaArrowLeft, FaEdit, FaTrash, FaImage, FaPhone, FaEnvelope, FaDollarSign, FaClipboardCheck, FaTimesCircle, FaStar, FaCommentDots, FaHistory, FaPlay, FaStop, FaBan, FaThumbsUp, FaExclamation } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { updateRequestCount } from '../../redux/userSlice';

const RequestDetails = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [request, setRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  const getServiceIcon = (serviceType) => {
    switch (serviceType?.toLowerCase()) {
      case 'fan':
        return FaFan;
      case 'light':
        return FaLightbulb;
      case 'switch':
        return FaBolt;
      case 'wiring':
        return FaBolt;
      case 'other':
        return FaTools;
      default:
        return FaTools;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return FaClock;
      case 'accepted':
        return FaCheckCircle;
      case 'in-progress':
        return FaPlay;
      case 'completed':
        return FaStop;
      case 'cancelled':
        return FaBan;
      default:
        return FaClock;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusGradient = (status) => {
    switch (status) {
      case 'pending':
        return 'from-yellow-400 to-amber-500';
      case 'accepted':
        return 'from-blue-400 to-indigo-500';
      case 'completed':
        return 'from-green-400 to-emerald-500';
      case 'in-progress':
        return 'from-purple-400 to-pink-500';
      case 'cancelled':
        return 'from-red-400 to-pink-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  // Helper function to format address according to backend model
  const formatAddress = (address) => {
    if (!address) return 'Address not provided';
    if (typeof address === 'string') return address;
    return `${address.street || ''}, ${address.city || ''}, ${address.state || ''} ${address.pincode || ''}`.trim();
  };

  // Format date with time
  const formatDateTime = (date) => {
    if (!date) return 'Not available';
    const d = new Date(date);
    return `${d.toLocaleDateString()} at ${d.toLocaleTimeString()}`;
  };

  // Calculate duration
  const calculateDuration = (startDate, endDate) => {
    if (!startDate) return 'Not started';
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const diff = end - start;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return 'Less than 1 hour';
  };

  // Handle request cancellation
  const handleCancelRequest = async () => {
    setIsCancelling(true);
    try {
      const response = await axios.patch(
        `${serverUrl}/api/service/${requestId}/cancel`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success('Request cancelled successfully');
        // Update the request state with the cancelled request from backend
        setRequest(response.data.request);
        
        // Update Redux state - decrement pending count and increment cancelled count
        dispatch(updateRequestCount({ 
          fromStatus: 'pending', 
          toStatus: 'cancelled' 
        }));
      } else {
        toast.error(response.data.message || 'Failed to cancel request');
      }
    } catch (error) {
      console.error('Cancel request error:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel request');
    } finally {
      setIsCancelling(false);
    }
  };

  // Fetch request details
  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        const response = await axios.get(
          `${serverUrl}/api/service/my-request/${requestId}`,
          { withCredentials: true }
        );
        
        if (response.data.success) {
          setRequest(response.data.request);
        } else {
          toast.error('Request not found');
          navigate('/user');
        }
      } catch (error) {
        console.error('Error fetching request details:', error);
        toast.error('Failed to load request details');
        navigate('/user');
      } finally {
        setIsLoading(false);
      }
    };

    if (requestId) {
      fetchRequestDetails();
    }
  }, [requestId, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FaSpinner className="w-8 h-8 text-yellow-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading request details...</p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex items-center justify-center h-64 py-20">
        <div className="text-center">
          <FaTools className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Request not found</h3>
          <button 
            onClick={() => navigate('/user')}
            className="px-6 py-20 bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-semibold rounded-xl hover:from-yellow-500 hover:to-amber-600 transition-all"
          >
            Back 
          </button>
        </div>
      </div>
    );
  }

  const ServiceIcon = getServiceIcon(request.issueType);
  const StatusIcon = getStatusIcon(request.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-blue-50">
      {/* Background decoration */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fbbf24' fill-opacity='0.05'%3E%3Cpath d='M30 30l15-15v30L30 30zm0 0L15 45V15l15 15z'/%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>

      {/* Header with Back Button */}
      <div className="relative z-10 mb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <button 
            onClick={() => navigate('/user')}
            className="group flex items-center gap-2 text-gray-600 hover:text-yellow-600 mb-6 transition-all duration-300 transform hover:translate-x-1"
          >
            <FaArrowLeft className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
              Request Details
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Track and manage your electrical service request with real-time updates
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column - Main Request Info */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Request Header Card */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-yellow-200/50 p-6 transform hover:scale-[1.01] transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className={`w-16 h-16 bg-gradient-to-br ${getStatusGradient(request.status)} rounded-xl flex items-center justify-center shadow-lg`}>
                      <ServiceIcon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border border-white shadow-lg bg-gradient-to-br ${getStatusGradient(request.status)}`}>
                        <StatusIcon className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-bold text-gray-800">{request.issueType || 'Electrical Service'}</h2>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(request.status)}`}>
                        <StatusIcon className="w-3 h-3 inline mr-1" />
                        {request.status || 'pending'}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3 leading-relaxed text-sm">{request.description || 'No description provided'}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                        <FaClipboardCheck className="w-3 h-3 text-yellow-500" />
                        <span className="font-mono font-medium">#{request._id?.slice(-8)}</span>
                      </span>
                      <span className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded-full">
                        <FaCalendar className="w-3 h-3 text-blue-500" />
                        <span>{formatDateTime(request.createdAt)}</span>
                      </span>
                      {request.startedAt && (
                        <span className="flex items-center gap-1 bg-purple-100 px-2 py-1 rounded-full">
                          <FaPlay className="w-3 h-3 text-purple-500" />
                          <span>Started: {formatDateTime(request.startedAt)}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline Card */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-yellow-200/50 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                    <FaHistory className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Request Timeline</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-sm">Request Created</p>
                      <p className="text-xs text-gray-600">{formatDateTime(request.createdAt)}</p>
                    </div>
                  </div>
                  
                  {request.startedAt && (
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm">Work Started</p>
                        <p className="text-xs text-gray-600">{formatDateTime(request.startedAt)}</p>
                      </div>
                    </div>
                  )}
                  
                  {request.completedAt && (
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm">Work Completed</p>
                        <p className="text-xs text-gray-600">{formatDateTime(request.completedAt)}</p>
                        <p className="text-xs text-gray-500">Duration: {calculateDuration(request.startedAt, request.completedAt)}</p>
                      </div>
                    </div>
                  )}
                  
                  {request.rejectedAt && (
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm">Request Rejected</p>
                        <p className="text-xs text-gray-600">{formatDateTime(request.rejectedAt)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Service Information Card */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-yellow-200/50 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center shadow-lg">
                    <FaTools className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Service Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-4 border border-yellow-200/50">
                    <label className="text-xs font-semibold text-yellow-700 block mb-1">Issue Type</label>
                    <div className="flex items-center gap-2">
                      <ServiceIcon className="w-5 h-5 text-yellow-600" />
                      <p className="text-gray-800 font-bold text-sm">{request.issueType || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200/50">
                    <label className="text-xs font-semibold text-blue-700 block mb-1">Request Status</label>
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(request.status)}`}>
                      <StatusIcon className="w-3 h-3" />
                      {request.status || 'pending'}
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-gray-50 rounded-xl p-4">
                  <label className="text-xs font-semibold text-gray-700 block mb-2">Description</label>
                  <p className="text-gray-800 leading-relaxed text-sm">{request.description || 'No description provided'}</p>
                </div>
              </div>

              {/* Service Address Card */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-yellow-200/50 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                    <FaMapMarkerAlt className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Service Address</h3>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-4 border border-red-200/50">
                  <div className="flex items-start gap-2">
                    <FaMapMarkerAlt className="w-4 h-4 text-red-500 mt-1" />
                    <p className="text-gray-800 text-sm leading-relaxed flex-1">{formatAddress(request.address)}</p>
                  </div>
                </div>
              </div>

              {/* Images Section */}
              {request.images && request.images.length > 0 && (
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-yellow-200/50 p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg">
                      <FaImage className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Service Images</h3>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-bold">
                      {request.images.length} photos
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {request.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-video rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                          <img
                            src={image}
                            alt={`Service image ${index + 1}`}
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => window.open(image, '_blank')}
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-end justify-center pb-4">
                          <div className="text-center">
                            <p className="text-white font-bold text-lg mb-1">Image {index + 1}</p>
                            <p className="text-white text-sm">Click to view full size</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Status & Actions */}
            <div className="space-y-4">
              
              {/* Status Card */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-yellow-200/50 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-8 h-8 bg-gradient-to-br ${getStatusGradient(request.status)} rounded-lg flex items-center justify-center shadow-lg`}>
                    <StatusIcon className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Status</h3>
                </div>
                
                <div className={`text-center p-4 rounded-xl bg-gradient-to-br ${getStatusGradient(request.status)} text-white mb-4`}>
                  <StatusIcon className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-lg font-bold mb-1">{request.status?.toUpperCase() || 'PENDING'}</p>
                  <p className="text-xs opacity-90">
                    {request.status === 'pending' && 'Waiting for electrician assignment'}
                    {request.status === 'accepted' && 'Electrician assigned and on the way'}
                    {request.status === 'in-progress' && 'Work is currently in progress'}
                    {request.status === 'completed' && 'Service has been completed'}
                    {request.status === 'cancelled' && 'Request has been cancelled'}
                  </p>
                </div>

                {request.updatedAt && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Last Updated</label>
                    <p className="text-gray-800 font-medium text-sm">{formatDateTime(request.updatedAt)}</p>
                  </div>
                )}
              </div>

              {/* Electrician Card */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-yellow-200/50 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg">
                    <FaUser className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Electrician</h3>
                </div>
                
                {request.electrician?.name ? (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-200/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                        <FaUser className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-800 text-sm">{request.electrician.name}</p>
                        <p className="text-xs text-gray-600">Professional Electrician</p>
                      </div>
                    </div>
                    {request.electrician.phone && (
                      <div className="flex items-center gap-2 bg-white rounded-lg p-2 mb-1">
                        <FaPhone className="w-3 h-3 text-green-500" />
                        <span className="text-gray-800 font-medium text-xs">{request.electrician.phone}</span>
                      </div>
                    )}
                    {request.electrician.avatar && (
                      <div className="flex items-center gap-2 bg-white rounded-lg p-2">
                        <FaImage className="w-3 h-3 text-blue-500" />
                        <span className="text-gray-800 font-medium text-xs">Profile Available</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center">
                    <FaUser className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 font-medium text-sm">Not assigned yet</p>
                    <p className="text-xs text-gray-400 mt-1">We'll assign the best electrician soon</p>
                  </div>
                )}
              </div>

              {/* Actions Card */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-yellow-200/50 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
                    <FaTools className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Actions</h3>
                </div>
                
                <div className="space-y-2">
                  {request.status === 'pending' && (
                    <button 
                      onClick={handleCancelRequest}
                      disabled={isCancelling}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-md disabled:opacity-50 disabled:transform-none text-sm"
                    >
                      {isCancelling ? (
                        <>
                          <FaSpinner className="w-4 h-4 animate-spin" />
                          Cancelling...
                        </>
                      ) : (
                        <>
                          <FaTimesCircle className="w-4 h-4" />
                          Cancel Request
                        </>
                      )}
                    </button>
                  )}
                  
                  {request.status === 'completed' && (
                    <button 
                      onClick={() => toast.info('Rating functionality coming soon')}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-bold rounded-xl hover:from-yellow-600 hover:to-amber-600 transition-all duration-300 transform hover:scale-105 shadow-md text-sm"
                    >
                      <FaStar className="w-4 h-4" />
                      Rate Service
                    </button>
                  )}
                  
                  <button 
                    onClick={() => window.print()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 shadow-md text-sm"
                  >
                    <FaClipboardCheck className="w-4 h-4" />
                    Print Details
                  </button>
                  
                  <button 
                    onClick={() => navigate('/user')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 text-sm"
                  >
                    <FaArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;
