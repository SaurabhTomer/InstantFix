import React, { useState, useEffect } from 'react';
import { FaClipboardList, FaBolt, FaClock, FaCheckCircle, FaTools, FaSearch, FaFilter, FaEye, FaSpinner, FaCalendar, FaMapMarkerAlt, FaUser, FaExclamationTriangle, FaFan, FaLightbulb, FaPlug } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { setRequestCounts } from '../../redux/userSlice';

const MyRequests = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [userRequests, setUserRequests] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const statusOptions = [
    { id: 'all', name: 'All Status', color: 'bg-gray-100 text-gray-800' },
    { id: 'pending', name: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'accepted', name: 'Accepted', color: 'bg-blue-100 text-blue-800' },
    { id: 'in-progress', name: 'In Progress', color: 'bg-purple-100 text-purple-800' },
    { id: 'completed', name: 'Completed', color: 'bg-green-100 text-green-800' },
    { id: 'cancelled', name: 'Cancelled', color: 'bg-red-100 text-red-800' }
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return FaClock;
      case 'accepted':
        return FaCheckCircle;
      case 'in-progress':
        return FaSpinner;
      case 'completed':
        return FaCheckCircle;
      case 'cancelled':
        return FaExclamationTriangle;
      default:
        return FaClock;
    }
  };

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

  // Get all requests as flat array for filtering
  const getAllRequests = () => {
    const allRequests = [];
    Object.keys(userRequests).forEach(status => {
      if (userRequests[status]) {
        allRequests.push(...userRequests[status]);
      }
    });
    return allRequests;
  };

  const filteredRequests = getAllRequests().filter(request => {
    const matchesSearch = 
      request.issueType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request._id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || request.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

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

      {/* Search and Filter */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by issue type, description, or request ID..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500 w-5 h-5" />
            <select
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              {statusOptions.map(status => (
                <option key={status.id} value={status.id}>{status.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => {
          const ServiceIcon = getServiceIcon(request.issueType);
          const StatusIcon = getStatusIcon(request.status);
          
          return (
            <div key={request._id} className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Request Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <ServiceIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-800">{request.issueType || 'Electrical Service'}</h3>
                        <span className="text-sm text-gray-500 font-mono">#{request._id?.slice(-8)}</span>
                      </div>
                      <p className="text-gray-600 mb-3">{request.description || 'No description provided'}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-gray-500">
                          <FaCalendar className="w-4 h-4" />
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                        {request.electrician?.name && (
                          <span className="text-gray-500">
                            <strong>Electrician:</strong> {request.electrician.name}
                          </span>
                        )}
                        {request.images && request.images.length > 0 && (
                          <span className="text-gray-500">
                            <strong>Images:</strong> {request.images.length}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="flex flex-col items-end gap-3">
                  <div className="flex items-center gap-2">
                    <StatusIcon className="w-4 h-4" />
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                      {request.status || 'pending'}
                    </span>
                  </div>
                  <button 
                    onClick={() => navigate(`/user/requests/${request._id}`)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FaEye className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </div>

              {/* Address */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaMapMarkerAlt className="w-4 h-4 text-red-500" />
                  <strong>Service Address:</strong> {formatAddress(request.address)}
                </div>
                {request.estimatedPrice && (
                  <div className="mt-2 text-sm">
                    <span className="text-gray-500"><strong>Estimated Price:</strong></span>
                    <span className="ml-2 font-semibold text-green-600">${request.estimatedPrice}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredRequests.length === 0 && (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
          <FaClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No requests found</h3>
          <p className="text-gray-500">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filter criteria' 
              : 'You haven\'t created any service requests yet'}
          </p>
        </div>
      )}

      {/* Create New Request Button */}
      <div className="mt-8 text-center">
        <button 
          onClick={() => window.location.href = '/create-request'}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-bold rounded-xl hover:from-yellow-500 hover:to-amber-600 transform hover:scale-105 transition-all shadow-lg"
        >
          <FaBolt className="w-5 h-5" />
          Create New Request
        </button>
      </div>
    </div>
  );
};

export default MyRequests;
