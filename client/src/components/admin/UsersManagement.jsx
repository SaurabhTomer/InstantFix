import React, { useState, useEffect } from 'react';
import { FaUsers, FaSearch, FaFilter, FaEye, FaBan, FaCheckCircle, FaClock, FaCog, FaEdit, FaSync } from 'react-icons/fa';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { selectAdminStats, fetchAdminStats, incrementStat, decrementStat } from '../../redux/adminSlice';

const UsersManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showUserDetails, setShowUserDetails] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  const dispatch = useDispatch();
  const adminStats = useSelector(selectAdminStats);

  // Fetch users from backend
  useEffect(() => {
    fetchUsers();
    
    // Set up real-time polling for updates
    const interval = setInterval(() => {
      fetchUsers();
    }, 30000); // Poll every 30 seconds for real-time updates

    return () => clearInterval(interval);
  }, [filterStatus]);

  // Also fetch when filters change
  useEffect(() => {
    fetchUsers();
  }, [filterStatus]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Build query parameters for filtering
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      
      const response = await axios.get(`${serverUrl}/api/admin/users${params.toString() ? '?' + params.toString() : ''}`, {
        withCredentials: true
      });
      
      const fetchedUsers = response.data.data?.users || response.data.users || [];
      setUsers(fetchedUsers);
      setLastUpdated(new Date());
      
      // Show real-time update notification
      if (fetchedUsers.length > 0) {
        const activeCount = fetchedUsers.filter(u => u.status === 'active').length;
        const suspendedCount = fetchedUsers.filter(u => u.status === 'suspended').length;
        
        console.log(`Real-time update: ${activeCount} active, ${suspendedCount} suspended users`);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (userId, newStatus) => {
    try {
      await axios.patch(`${serverUrl}/api/admin/users/${userId}/status`, 
        { status: newStatus }, 
        { withCredentials: true }
      );
      toast.success(`User status updated to ${newStatus}`);
      
      // Update Redux stats
      if (newStatus === 'suspended') {
        dispatch(decrementStat({ stat: 'totalUsers' }));
      } else if (newStatus === 'active') {
        dispatch(incrementStat({ stat: 'totalUsers' }));
      }
      
      fetchUsers(); // Refresh data
      dispatch(fetchAdminStats());
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleViewDetails = (user) => {
    setShowUserDetails(user);
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
    const matchesSearch = 
      (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleUserAction = (userId, action) => {
    handleStatusUpdate(userId, action);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Users Management</h2>
          <p className="text-gray-600">Manage and monitor all platform users</p>
        </div>
        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <FaSync className="w-4 h-4" />
          Refresh
        </button>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-800">{users.length}</p>
            </div>
            <FaUsers className="w-10 h-10 text-blue-500" />
          </div>
        </div>
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-3xl font-bold text-green-600">{users.filter(u => u.status === 'active').length}</p>
            </div>
            <FaCheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </div>
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Suspended</p>
              <p className="text-3xl font-bold text-red-600">{users.filter(u => u.status === 'suspended').length}</p>
            </div>
            <FaBan className="w-10 h-10 text-red-500" />
          </div>
        </div>
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">{users.filter(u => u.status === 'pending').length}</p>
            </div>
            <FaClock className="w-10 h-10 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <FaUsers className="w-6 h-6 text-blue-500" />
            All Users
          </h3>
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
            <FaCog className="w-5 h-5" />
            <span className="text-base">Sort</span>
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
                  <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-semibold text-gray-800">{user.name}</p>
                        <p className="text-sm text-gray-600">ID: #{user._id.toString().slice(-6)}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm text-gray-800">{user.email}</p>
                        <p className="text-sm text-gray-600">{user.phone || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.status)}`}>
                        <StatusIcon className="w-3 h-3" />
                        {user.status || 'active'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm text-gray-800">{user.totalRequests || 0}</p>
                        <p className="text-xs text-gray-600">Total requests</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm text-gray-800">{user.completedRequests || 0}</p>
                        <p className="text-xs text-gray-600">Completed</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-800">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                        {user.status === 'active' ? (
                          <button
                            onClick={() => handleUserAction(user._id, 'suspended')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Suspend User"
                          >
                            <FaBan className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUserAction(user._id, 'active')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Activate User"
                          >
                            <FaCheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
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
                <p className="font-semibold">{showUserDetails.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-semibold">{showUserDetails.status || 'active'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Requests</p>
                <p className="font-semibold">{showUserDetails.totalRequests || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed Requests</p>
                <p className="font-semibold">{showUserDetails.completedRequests || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Join Date</p>
                <p className="font-semibold">
                  {new Date(showUserDetails.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
