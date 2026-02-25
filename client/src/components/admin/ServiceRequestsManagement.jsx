import React, { useState, useEffect } from 'react';
import { FaClipboardList, FaSearch, FaFilter, FaEye, FaEdit, FaCheckCircle, FaTimesCircle, FaClock, FaExclamationTriangle, FaCalendarAlt, FaUser, FaMapMarkerAlt, FaTools, FaStar, FaDollarSign, FaDownload, FaSync } from 'react-icons/fa';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { selectAdminStats, fetchAdminStats, incrementStat, decrementStat } from '../../redux/adminSlice';

const ServiceRequestsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  const dispatch = useDispatch();
  const adminStats = useSelector(selectAdminStats);

  // Fetch service requests from backend
  useEffect(() => {
    fetchServiceRequests();
    
    // Set up real-time polling for updates
    const interval = setInterval(() => {
      fetchServiceRequests();
    }, 30000); // Poll every 30 seconds for real-time updates

    return () => clearInterval(interval);
  }, []);

  // Also fetch when filters change
  useEffect(() => {
    fetchServiceRequests();
  }, [filterStatus, filterPriority]);

  const fetchServiceRequests = async () => {
    try {
      setLoading(true);
      // Build query parameters for filtering
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (filterPriority !== 'all') params.append('priority', filterPriority);
      
      // Use the real admin API endpoint
      const response = await axios.get(`${serverUrl}/api/admin/service-requests${params.toString() ? '?' + params.toString() : ''}`, {
        withCredentials: true
      });
      
      const requests = response.data.data?.requests || response.data.requests || [];
      setServiceRequests(requests);
      setLastUpdated(new Date());
      
      // Show real-time update notification
      if (requests.length > 0) {
        const pendingCount = requests.filter(r => r.status === 'pending').length;
        const inProgressCount = requests.filter(r => r.status === 'in-progress').length;
        const completedCount = requests.filter(r => r.status === 'completed').length;
        
        console.log(`Real-time update: ${pendingCount} pending, ${inProgressCount} in-progress, ${completedCount} completed`);
      }
    } catch (error) {
      console.error('Error fetching service requests:', error);
      toast.error('Failed to fetch service requests');
      
      // Only use fallback data if API completely fails
      if (!error.response || error.response.status >= 500) {
        setServiceRequests([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      await axios.patch(`${serverUrl}/api/admin/service-requests/${requestId}/status`, 
        { status: newStatus }, 
        { withCredentials: true }
      );
      toast.success(`Request status updated to ${newStatus}`);
      
      // Update Redux stats
      if (newStatus === 'completed') {
        dispatch(decrementStat({ stat: 'inProgressRequests' }));
        dispatch(incrementStat({ stat: 'completedRequests' }));
      } else if (newStatus === 'in-progress') {
        dispatch(decrementStat({ stat: 'pendingRequests' }));
        dispatch(incrementStat({ stat: 'inProgressRequests' }));
      }
      
      fetchServiceRequests(); // Refresh data
      dispatch(fetchAdminStats());
    } catch (error) {
      console.error('Error updating request status:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleAssignElectrician = async (requestId, electricianId) => {
    try {
      await axios.patch(`${serverUrl}/api/admin/service-requests/${requestId}/assign`, 
        { electricianId }, 
        { withCredentials: true }
      );
      toast.success('Electrician assigned successfully');
      fetchServiceRequests(); // Refresh data
      dispatch(fetchAdminStats());
    } catch (error) {
      console.error('Error assigning electrician:', error);
      toast.error(error.response?.data?.message || 'Failed to assign electrician');
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
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'accepted':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return FaCheckCircle;
      case 'in-progress':
        return FaTools;
      case 'accepted':
        return FaClock;
      case 'pending':
        return FaExclamationTriangle;
      case 'cancelled':
        return FaTimesCircle;
      default:
        return FaClock;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredRequests = serviceRequests.filter(request => {
    const matchesSearch = 
      (request.customer?.name && request.customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (request.customer?.email && request.customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (request.issueType && request.issueType.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (request._id && request._id.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || request.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  return (
    <div>
      {/* Add CSS animations */}
      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaClipboardList className="w-6 h-6 text-purple-500" />
            Service Requests Management
          </h2>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-gray-600">Monitor and manage all service requests across the platform</p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
              <button
                onClick={fetchServiceRequests}
                className="text-purple-500 hover:text-purple-600 transition-colors"
                title="Refresh data"
              >
                ↻
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2">
            <FaDownload />
            Export
          </button>
          <button 
            onClick={fetchServiceRequests}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <FaSync />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-800">{adminStats.totalServiceRequests || serviceRequests.length}</p>
              <p className="text-xs text-gray-500 mt-1">All time</p>
            </div>
            <FaClipboardList className="w-8 h-8 text-purple-500 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-blue-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">
                {adminStats.inProgressRequests || serviceRequests.filter(r => r.status === 'in-progress').length}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {adminStats.totalServiceRequests > 0 ? Math.round((adminStats.inProgressRequests / adminStats.totalServiceRequests) * 100) : 0}% active
              </p>
            </div>
            <FaClock className="w-8 h-8 text-blue-500 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-yellow-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {adminStats.pendingRequests || serviceRequests.filter(r => r.status === 'pending').length}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {adminStats.pendingRequests > 0 ? '⚠️ Action needed' : '✅ All processed'}
              </p>
            </div>
            <FaExclamationTriangle className="w-8 h-8 text-yellow-500 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-green-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {adminStats.completedRequests || serviceRequests.filter(r => r.status === 'completed').length}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {adminStats.totalServiceRequests > 0 ? Math.round((adminStats.completedRequests / adminStats.totalServiceRequests) * 100) : 0}% success rate
              </p>
            </div>
            <FaCheckCircle className="w-8 h-8 text-green-500 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-red-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-red-600">
                {serviceRequests.filter(r => r.priority === 'high').length}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {serviceRequests.filter(r => r.priority === 'high' && r.status !== 'completed').length > 0 ? '🔥 Urgent' : '✅ No urgent'}
              </p>
            </div>
            <FaExclamationTriangle className="w-8 h-8 text-red-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search requests by ID, customer, electrician, or service type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400 w-4 h-4" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Electrician
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => {
                const StatusIcon = getStatusIcon(request.status);
                return (
                  <tr key={request._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{request._id}</div>
                      <div className="text-xs text-gray-500">{formatDate(request.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.customer?.name || 'Unknown'}</div>
                      <div className="text-xs text-gray-500">{request.customer?.email || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.issueType}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <FaMapMarkerAlt className="w-3 h-3" />
                        {request.address?.city || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {request.electrician ? (
                        <div>
                          <div className="text-sm text-gray-900">{request.electrician.name}</div>
                          <div className="text-xs text-gray-500">{request.electrician.email}</div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Not assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${request.amount || 0}</div>
                      <div className="text-xs text-gray-500">{request.paymentStatus || 'pending'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowDetailsModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="View Details"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowDetailsModal(true);
                          }}
                          className="text-green-600 hover:text-green-900 transition-colors"
                          title="Edit Status"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        {request.status === 'pending' && (
                          <button
                            onClick={() => handleStatusUpdate(request._id, 'in-progress')}
                            className="text-yellow-600 hover:text-yellow-900 transition-colors"
                            title="Start Work"
                          >
                            <FaClock className="w-4 h-4" />
                          </button>
                        )}
                        {request.status === 'in-progress' && (
                          <button
                            onClick={() => handleStatusUpdate(request._id, 'completed')}
                            className="text-green-600 hover:text-green-900 transition-colors"
                            title="Mark Complete"
                          >
                            <FaCheckCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Request Details - {selectedRequest.id}</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FaUser className="w-4 h-4" />
                    Customer Information
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">{selectedRequest.customer?.name || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{selectedRequest.customer?.email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{selectedRequest.customer?.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-medium">
                        {selectedRequest.address ? 
                          `${selectedRequest.address.street || ''}, ${selectedRequest.address.city || ''}, ${selectedRequest.address.state || ''} ${selectedRequest.address.pincode || ''}`.trim() 
                          : 'N/A'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Service Details */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FaTools className="w-4 h-4" />
                    Service Details
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div>
                      <p className="text-sm text-gray-600">Service Type</p>
                      <p className="font-medium">{selectedRequest.issueType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Description</p>
                      <p className="font-medium">{selectedRequest.description}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Priority</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(selectedRequest.priority)}`}>
                        {selectedRequest.priority}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Amount</p>
                      <p className="font-medium text-lg">${selectedRequest.amount}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Electrician Information */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FaTools className="w-4 h-4" />
                    Electrician Information
                  </h4>
                  {selectedRequest.electricianName ? (
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-medium">{selectedRequest.electricianName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{selectedRequest.electricianEmail}</p>
                      </div>
                      {selectedRequest.rating && (
                        <div>
                          <p className="text-sm text-gray-600">Rating</p>
                          <div className="flex items-center gap-1">
                            <FaStar className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="font-medium">{selectedRequest.rating}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">No electrician assigned yet</p>
                    </div>
                  )}
                </div>

                {/* Status and Timeline */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FaClock className="w-4 h-4" />
                    Status & Timeline
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Current Status</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedRequest.status)}`}>
                        {selectedRequest.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Status</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPaymentStatusColor(selectedRequest.paymentStatus)}`}>
                        {selectedRequest.paymentStatus}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Created</p>
                      <p className="font-medium">{formatDate(selectedRequest.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Last Updated</p>
                      <p className="font-medium">{formatDate(selectedRequest.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                Edit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceRequestsManagement;
