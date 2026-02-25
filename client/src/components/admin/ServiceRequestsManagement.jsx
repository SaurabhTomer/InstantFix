import React, { useState } from 'react';
import { FaClipboardList, FaSearch, FaFilter, FaEye, FaEdit, FaCheckCircle, FaTimesCircle, FaClock, FaExclamationTriangle, FaCalendarAlt, FaUser, FaMapMarkerAlt, FaTools, FaStar, FaDollarSign, FaDownload, FaSync } from 'react-icons/fa';

const ServiceRequestsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const serviceRequests = [
    {
      id: 'SR001',
      customerName: 'John Doe',
      customerEmail: 'john.doe@example.com',
      customerPhone: '+1 234 567 8900',
      electricianName: 'Robert Chen',
      electricianEmail: 'robert.chen@example.com',
      issueType: 'Residential Wiring',
      description: 'Need to install new electrical outlets in the living room and kitchen',
      status: 'in-progress',
      priority: 'medium',
      amount: 250,
      createdAt: '2024-02-15T10:30:00Z',
      updatedAt: '2024-02-15T14:20:00Z',
      address: '123 Main St, New York, NY',
      rating: null,
      paymentStatus: 'pending'
    },
    {
      id: 'SR002',
      customerName: 'Jane Smith',
      customerEmail: 'jane.smith@example.com',
      customerPhone: '+1 234 567 8901',
      electricianName: 'Maria Garcia',
      electricianEmail: 'maria.garcia@example.com',
      issueType: 'Commercial Electrical',
      description: 'Emergency repair needed for office lighting system',
      status: 'completed',
      priority: 'high',
      amount: 500,
      createdAt: '2024-02-14T09:15:00Z',
      updatedAt: '2024-02-14T16:45:00Z',
      address: '456 Oak Ave, Los Angeles, CA',
      rating: 5,
      paymentStatus: 'paid'
    },
    {
      id: 'SR003',
      customerName: 'Mike Johnson',
      customerEmail: 'mike.j@example.com',
      customerPhone: '+1 234 567 8902',
      electricianName: null,
      electricianEmail: null,
      issueType: 'Industrial Electrical',
      description: 'Factory machinery electrical maintenance required',
      status: 'pending',
      priority: 'high',
      amount: 1200,
      createdAt: '2024-02-15T08:00:00Z',
      updatedAt: '2024-02-15T08:00:00Z',
      address: '789 Pine Rd, Chicago, IL',
      rating: null,
      paymentStatus: 'pending'
    },
    {
      id: 'SR004',
      customerName: 'Sarah Wilson',
      customerEmail: 'sarah.w@example.com',
      customerPhone: '+1 234 567 8903',
      electricianName: 'James Wilson',
      electricianEmail: 'james.wilson@example.com',
      issueType: 'HVAC Electrical',
      description: 'AC unit not working, need electrical diagnosis',
      status: 'accepted',
      priority: 'low',
      amount: 150,
      createdAt: '2024-02-13T11:30:00Z',
      updatedAt: '2024-02-14T09:00:00Z',
      address: '321 Elm St, Houston, TX',
      rating: null,
      paymentStatus: 'pending'
    },
    {
      id: 'SR005',
      customerName: 'David Kim',
      customerEmail: 'david.kim@example.com',
      customerPhone: '+1 234 567 8904',
      electricianName: 'Lisa Anderson',
      electricianEmail: 'lisa.anderson@example.com',
      issueType: 'Emergency Services',
      description: 'Power outage in residential building',
      status: 'completed',
      priority: 'urgent',
      amount: 800,
      createdAt: '2024-02-12T22:15:00Z',
      updatedAt: '2024-02-13T02:30:00Z',
      address: '654 Maple Dr, Phoenix, AZ',
      rating: 4,
      paymentStatus: 'paid'
    }
  ];

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
      request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.issueType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.electricianName && request.electricianName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || request.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleStatusUpdate = (requestId, newStatus) => {
    console.log(`Updating request ${requestId} to ${newStatus}`);
    // Handle status update logic here
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
          <p className="text-gray-600 mt-1">Monitor and manage all service requests across the platform</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2">
            <FaDownload />
            Export
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
            <FaSync />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-800">{serviceRequests.length}</p>
            </div>
            <FaClipboardList className="w-8 h-8 text-purple-500 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {serviceRequests.filter(r => r.status === 'pending').length}
              </p>
            </div>
            <FaExclamationTriangle className="w-8 h-8 text-yellow-500 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">
                {serviceRequests.filter(r => r.status === 'in-progress').length}
              </p>
            </div>
            <FaTools className="w-8 h-8 text-blue-500 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {serviceRequests.filter(r => r.status === 'completed').length}
              </p>
            </div>
            <FaCheckCircle className="w-8 h-8 text-green-500 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-purple-600">
                ${serviceRequests.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
              </p>
            </div>
            <FaDollarSign className="w-8 h-8 text-purple-500 opacity-50" />
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
                  <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{request.id}</div>
                      <div className="text-xs text-gray-500">{formatDate(request.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.customerName}</div>
                      <div className="text-xs text-gray-500">{request.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.issueType}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <FaMapMarkerAlt className="w-3 h-3" />
                        {request.address.split(',')[1]}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {request.electricianName ? (
                        <div>
                          <div className="text-sm text-gray-900">{request.electricianName}</div>
                          {request.rating && (
                            <div className="flex items-center gap-1">
                              <FaStar className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-600">{request.rating}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Not assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(request.priority)}`}>
                        {request.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${request.amount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPaymentStatusColor(request.paymentStatus)}`}>
                        {request.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(request)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="View Details"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900 transition-colors"
                          title="Edit"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        {request.status === 'pending' && (
                          <button
                            onClick={() => handleStatusUpdate(request.id, 'accepted')}
                            className="text-yellow-600 hover:text-yellow-900 transition-colors"
                            title="Accept"
                          >
                            <FaCheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {(request.status === 'accepted' || request.status === 'in-progress') && (
                          <button
                            onClick={() => handleStatusUpdate(request.id, 'completed')}
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
                      <p className="font-medium">{selectedRequest.customerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{selectedRequest.customerEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{selectedRequest.customerPhone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-medium">{selectedRequest.address}</p>
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
