import React, { useState } from 'react';
import { FaClipboardList, FaBolt, FaClock, FaCheckCircle, FaTools, FaSearch, FaFilter, FaEye } from 'react-icons/fa';

const MyRequests = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const requests = [
    {
      id: 'SR001',
      service: 'Fan not working',
      description: 'Ceiling fan in bedroom not working, making noise',
      status: 'pending',
      priority: 'medium',
      date: '2024-02-24',
      time: '10:30 AM',
      electrician: 'Not Assigned',
      address: '123 Main St, Apt 4B',
      images: 2
    },
    {
      id: 'SR002',
      service: 'Switch board issue',
      description: 'Kitchen switch board sparking, needs immediate attention',
      status: 'completed',
      priority: 'high',
      date: '2024-02-23',
      time: '2:15 PM',
      electrician: 'John Smith',
      address: '123 Main St, Apt 4B',
      images: 3
    },
    {
      id: 'SR003',
      service: 'Wiring problem',
      description: 'Living room wiring needs to be checked',
      status: 'in-progress',
      priority: 'high',
      date: '2024-02-22',
      time: '9:00 AM',
      electrician: 'Mike Johnson',
      address: '123 Main St, Apt 4B',
      images: 1
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
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

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || request.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

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
              placeholder="Search by service name or request ID..."
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
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <div key={request.id} className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Request Info */}
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <FaBolt className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-800">{request.service}</h3>
                      <span className="text-sm text-gray-500 font-mono">{request.id}</span>
                    </div>
                    <p className="text-gray-600 mb-3">{request.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-gray-500">
                        <FaClock className="w-4 h-4" />
                        {request.date} at {request.time}
                      </span>
                      <span className="text-gray-500">
                        <strong>Electrician:</strong> {request.electrician}
                      </span>
                      <span className="text-gray-500">
                        <strong>Images:</strong> {request.images}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex flex-col items-end gap-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(request.priority)}`}>
                    {request.priority}
                  </span>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <FaEye className="w-4 h-4" />
                  View Details
                </button>
              </div>
            </div>

            {/* Address */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <strong>Service Address:</strong> {request.address}
              </p>
            </div>
          </div>
        ))}
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
        <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-bold rounded-xl hover:from-yellow-500 hover:to-amber-600 transform hover:scale-105 transition-all shadow-lg">
          <FaBolt className="w-5 h-5" />
          Create New Request
        </button>
      </div>
    </div>
  );
};

export default MyRequests;
