import React, { useState, useEffect } from 'react';
import { FaTools, FaBolt, FaLightbulb, FaPlug, FaFan, FaCalendar, FaMapMarkerAlt, FaUser, FaCheckCircle, FaExclamationTriangle, FaSpinner, FaClock } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { setRequestCounts } from '../../redux/userSlice';

const Services = () => {
  const [userRequests, setUserRequests] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const statusColumns = [
    { 
      id: 'pending', 
      name: 'Pending', 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: FaClock 
    },
    { 
      id: 'accepted', 
      name: 'Accepted', 
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: FaCheckCircle 
    },
    { 
      id: 'in-progress', 
      name: 'In Progress', 
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: FaSpinner 
    },
    { 
      id: 'completed', 
      name: 'Completed', 
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: FaCheckCircle 
    },
    { 
      id: 'cancelled', 
      name: 'Cancelled', 
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: FaExclamationTriangle 
    }
  ];


  const getServiceIcon = (serviceType) => {
    switch (serviceType?.toLowerCase()) {
      case 'fan':
      case 'fan installation':
      case 'fan repair':
        return FaFan;
      case 'light':
      case 'lighting':
      case 'led':
        return FaLightbulb;
      case 'wiring':
      case 'switch':
      case 'circuit':
        return FaBolt;
      case 'appliance':
      case 'ac':
      case 'geyser':
        return FaPlug;
      default:
        return FaTools;
    }
  };

  // Helper function to format address
  const formatAddress = (address) => {
    if (!address) return 'Address not provided';
    if (typeof address === 'string') return address;
    return `${address.street || ''}, ${address.city || ''}, ${address.state || ''} ${address.pincode || ''}`.trim();
  };

  // Fetch user requests
  useEffect(() => {
    const fetchUserRequests = async () => {
      try {
        const response = await axios.get(
          `${serverUrl}/api/service/by-status`,
          { withCredentials: true }
        );
        // console.log(response);
        
        if (response.data.success) {
          setUserRequests(response.data.requests || {});
          // Save counts to Redux
          if (response.data.counts) {
            dispatch(setRequestCounts(response.data.counts));
          }
        }
      } catch (error) {
        console.error('Error fetching user requests:', error);
        toast.error('Failed to load your requests');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRequests();
  }, [dispatch]);

  // Group requests by status
  const getRequestsByStatus = (status) => {
    return userRequests[status] || [];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FaSpinner className="w-8 h-8 text-yellow-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">My Service Requests</h2>
        <p className="text-gray-600">Track and manage all your electrical service requests</p>
      </div>

      {/* Status Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statusColumns.map((column) => {
          const Icon = column.icon;
          const requests = getRequestsByStatus(column.id);
          
          return (
            <div key={column.id} className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Column Header */}
              <div className={`p-4 ${column.color} border-b-2`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5" />
                    <h3 className="font-bold">{column.name}</h3>
                  </div>
                  <span className="bg-white/30 px-2 py-1 rounded-full text-xs font-semibold">
                    {requests.length}
                  </span>
                </div>
              </div>

              {/* Requests in Column */}
              <div className="p-3 space-y-3 max-h-96 overflow-y-auto">
                {requests.map((request) => {
                  const ServiceIcon = getServiceIcon(request.issueType);
                  
                  return (
                    <div key={request._id} className="bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors cursor-pointer">
                      {/* Service Icon and Type */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-lg flex items-center justify-center">
                          <ServiceIcon className="w-4 h-4 text-yellow-600" />
                        </div>
                        <h4 className="font-semibold text-sm text-gray-800 truncate">
                          {request.issueType || 'Electrical Service'}
                        </h4>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {request.description || 'No description provided'}
                      </p>

                      {/* Request Details */}
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-1 text-gray-500">
                          <FaMapMarkerAlt className="w-3 h-3 text-red-500" />
                          <span className="truncate">{formatAddress(request.address)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <FaCalendar className="w-3 h-3 text-blue-500" />
                          <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                        </div>
                        {request.electrician?.name && (
                          <div className="flex items-center gap-1 text-gray-500">
                            <FaUser className="w-3 h-3 text-green-500" />
                            <span className="truncate">{request.electrician.name}</span>
                          </div>
                        )}
                        {request.estimatedPrice && (
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                            <span className="text-gray-500">Price:</span>
                            <span className="font-semibold text-green-600">${request.estimatedPrice}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Empty State for Column */}
                {requests.length === 0 && (
                  <div className="text-center py-6">
                    <Icon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">No {column.name.toLowerCase()} requests</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall Empty State */}
      {!isLoading && (!userRequests.pending?.length && !userRequests.accepted?.length && !userRequests['in-progress']?.length && !userRequests.completed?.length && !userRequests.cancelled?.length) && (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
          <FaTools className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No service requests yet</h3>
          <p className="text-gray-500 mb-4">Create your first service request to get started</p>
          <button 
            onClick={() => window.location.href = '/create-request'}
            className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-semibold rounded-xl hover:from-yellow-500 hover:to-amber-600 transition-all"
          >
            Create Your First Request
          </button>
        </div>
      )}
    </div>
  );
};

export default Services;
