import React, { useState } from 'react';
import { FaUsers, FaSearch, FaFilter, FaEye, FaBan, FaCheckCircle, FaClock, FaCog, FaEdit } from 'react-icons/fa';

const UsersManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showUserDetails, setShowUserDetails] = useState(null);

  const users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 234 567 8900',
      status: 'active',
      joinDate: '2024-01-15',
      totalRequests: 12,
      completedRequests: 8,
      address: '123 Main St, New York, NY'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1 234 567 8901',
      status: 'active',
      joinDate: '2024-01-20',
      totalRequests: 8,
      completedRequests: 6,
      address: '456 Oak Ave, Los Angeles, CA'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.j@example.com',
      phone: '+1 234 567 8902',
      status: 'suspended',
      joinDate: '2024-02-01',
      totalRequests: 5,
      completedRequests: 3,
      address: '789 Pine Rd, Chicago, IL'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah.w@example.com',
      phone: '+1 234 567 8903',
      status: 'active',
      joinDate: '2024-02-10',
      totalRequests: 3,
      completedRequests: 1,
      address: '321 Elm St, Houston, TX'
    },
    {
      id: 5,
      name: 'Tom Brown',
      email: 'tom.brown@example.com',
      phone: '+1 234 567 8904',
      status: 'pending',
      joinDate: '2024-02-20',
      totalRequests: 0,
      completedRequests: 0,
      address: '654 Maple Dr, Phoenix, AZ'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return FaCheckCircle;
      case 'suspended':
        return FaBan;
      case 'pending':
        return FaClock;
      default:
        return FaUsers;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleUserAction = (userId, action) => {
    console.log(`User ${userId}: ${action}`);
    // Here you would implement the actual action
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Users Management</h2>
        <p className="text-gray-600">Manage and monitor all platform users</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500 w-5 h-5" />
            <select
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-800">{users.length}</p>
            </div>
            <FaUsers className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{users.filter(u => u.status === 'active').length}</p>
            </div>
            <FaCheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Suspended</p>
              <p className="text-2xl font-bold text-red-600">{users.filter(u => u.status === 'suspended').length}</p>
            </div>
            <FaBan className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{users.filter(u => u.status === 'pending').length}</p>
            </div>
            <FaClock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FaUsers className="w-5 h-5 text-blue-500" />
            All Users
          </h3>
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
            <FaCog className="w-4 h-4" />
            <span className="text-sm">Sort</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Contact</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Join Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Requests</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const StatusIcon = getStatusIcon(user.status);
                return (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-semibold text-gray-800">{user.name}</p>
                        <p className="text-sm text-gray-600">ID: #{user.id.toString().padStart(4, '0')}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm text-gray-800">{user.email}</p>
                        <p className="text-sm text-gray-600">{user.phone}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.status)}`}>
                        <StatusIcon className="w-3 h-3" />
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{user.joinDate}</td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        <p className="text-gray-800">{user.totalRequests} total</p>
                        <p className="text-green-600">{user.completedRequests} completed</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setShowUserDetails(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        {user.status === 'active' ? (
                          <button 
                            onClick={() => handleUserAction(user.id, 'suspend')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Suspend User"
                          >
                            <FaBan className="w-4 h-4" />
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleUserAction(user.id, 'activate')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Activate User"
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

      {/* User Details Modal */}
      {showUserDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">User Details</h3>
              <button 
                onClick={() => setShowUserDetails(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold">{showUserDetails.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold">{showUserDetails.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-semibold">{showUserDetails.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-semibold">{showUserDetails.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Join Date</p>
                <p className="font-semibold">{showUserDetails.joinDate}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
