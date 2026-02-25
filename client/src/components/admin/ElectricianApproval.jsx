import React, { useState, useEffect } from 'react';
import { FaUserCheck, FaSearch, FaFilter, FaEye, FaCheck, FaTimes, FaExclamationTriangle, FaClock, FaCheckCircle, FaBan, FaStar, FaMapMarkerAlt, FaEnvelope, FaPhone, FaCalendarAlt, FaAward, FaTools, FaUsers, FaUserTimes, FaUserPlus } from 'react-icons/fa';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { selectAdminStats, fetchAdminStats, updateStats, incrementStat, decrementStat } from '../../redux/adminSlice';

const ElectricianApproval = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending');
  const [showElectricianDetails, setShowElectricianDetails] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(null);
  const [electricians, setElectricians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedElectricians, setSelectedElectricians] = useState([]);
  
  const dispatch = useDispatch();
  const adminStats = useSelector(selectAdminStats);

  // Fetch pending electricians from backend
  useEffect(() => {
    fetchElectricians();
  }, [filterStatus]);

  const fetchElectricians = async () => {
    try {
      setLoading(true);
      // Add status filter to API call if not 'all'
      const statusFilter = filterStatus === 'all' ? '' : `?status=${filterStatus}`;
      const response = await axios.get(`${serverUrl}/api/admin/electricians${statusFilter}`, {
        withCredentials: true
      });
      setElectricians(response.data.electricians || []);
    } catch (error) {
      console.error('Error fetching electricians:', error);
      if (error.response?.status === 403) {
        toast.error('Access denied: Admin privileges required');
      } else {
        toast.error('Failed to fetch electricians');
      }
      // Fallback to mock data if API fails
      setElectricians([
        {
          _id: '1',
          name: 'Robert Chen',
          email: 'robert.chen@example.com',
          phone: '+1 234 567 8901',
          approvalStatus: 'approved',
          createdAt: '2024-01-15',
          rating: 4.8,
          totalJobs: 45,
          completedJobs: 42,
          specialization: 'Residential Wiring',
          experience: '8 years',
          location: 'New York, NY',
          certifications: ['Licensed Electrician', 'OSHA Certified'],
          role: 'ELECTRICIAN'
        },
        {
          _id: '2',
          name: 'Maria Garcia',
          email: 'maria.garcia@example.com',
          phone: '+1 234 567 8902',
          approvalStatus: 'pending',
          createdAt: '2024-02-01',
          rating: 0,
          totalJobs: 0,
          completedJobs: 0,
          specialization: 'Commercial Electrical',
          experience: '5 years',
          location: 'Los Angeles, CA',
          certifications: ['Journeyman Electrician'],
          role: 'ELECTRICIAN'
        },
        {
          _id: '3',
          name: 'James Wilson',
          email: 'james.wilson@example.com',
          phone: '+1 234 567 8903',
          approvalStatus: 'rejected',
          createdAt: '2024-01-20',
          rating: 0,
          totalJobs: 0,
          completedJobs: 0,
          specialization: 'Industrial Electrical',
          experience: '3 years',
          location: 'Chicago, IL',
          certifications: ['Apprentice Electrician'],
          role: 'ELECTRICIAN'
        },
        {
          _id: '4',
          name: 'Lisa Anderson',
          email: 'lisa.anderson@example.com',
          phone: '+1 234 567 8904',
          approvalStatus: 'pending',
          createdAt: '2024-02-10',
          rating: 0,
          totalJobs: 0,
          completedJobs: 0,
          specialization: 'HVAC Electrical',
          experience: '6 years',
          location: 'Houston, TX',
          certifications: ['HVAC Certified', 'Electrical License'],
          role: 'ELECTRICIAN'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (electrician) => {
    try {
      await axios.patch(`${serverUrl}/api/admin/electrician/${electrician._id}/approve`, {}, {
        withCredentials: true
      });
      toast.success('Electrician approved successfully');
      
      // Update Redux stats
      dispatch(decrementStat({ stat: 'pendingElectricians' }));
      dispatch(incrementStat({ stat: 'approvedElectricians' }));
      dispatch(incrementStat({ stat: 'activeElectricians' }));
      
      // Refresh data
      fetchElectricians();
      dispatch(fetchAdminStats());
    } catch (error) {
      console.error('Error approving electrician:', error);
      toast.error(error.response?.data?.message || 'Failed to approve electrician');
    }
  };

  const handleReject = async (electrician) => {
    try {
      await axios.patch(`${serverUrl}/api/admin/electrician/${electrician._id}/reject`, {}, {
        withCredentials: true
      });
      toast.success('Electrician rejected successfully');
      
      // Update Redux stats
      dispatch(decrementStat({ stat: 'pendingElectricians' }));
      dispatch(incrementStat({ stat: 'rejectedElectricians' }));
      
      // Refresh data
      fetchElectricians();
      dispatch(fetchAdminStats());
    } catch (error) {
      console.error('Error rejecting electrician:', error);
      toast.error(error.response?.data?.message || 'Failed to reject electrician');
    }
  };

  const handleBulkApprove = async () => {
    try {
      const approvePromises = selectedElectricians.map(electricianId =>
        axios.patch(`${serverUrl}/api/admin/electrician/${electricianId}/approve`, {}, {
          withCredentials: true
        })
      );
      
      await Promise.all(approvePromises);
      toast.success(`${selectedElectricians.length} electricians approved successfully`);
      
      // Update Redux stats
      dispatch(decrementStat({ stat: 'pendingElectricians', value: selectedElectricians.length }));
      dispatch(incrementStat({ stat: 'approvedElectricians', value: selectedElectricians.length }));
      dispatch(incrementStat({ stat: 'activeElectricians', value: selectedElectricians.length }));
      
      setSelectedElectricians([]);
      fetchElectricians();
      dispatch(fetchAdminStats());
    } catch (error) {
      console.error('Error in bulk approval:', error);
      toast.error('Failed to approve some electricians');
    }
  };

  const handleBulkReject = async () => {
    try {
      const rejectPromises = selectedElectricians.map(electricianId =>
        axios.patch(`${serverUrl}/api/admin/electrician/${electricianId}/reject`, {}, {
          withCredentials: true
        })
      );
      
      await Promise.all(rejectPromises);
      toast.success(`${selectedElectricians.length} electricians rejected successfully`);
      
      // Update Redux stats
      dispatch(decrementStat({ stat: 'pendingElectricians', value: selectedElectricians.length }));
      dispatch(incrementStat({ stat: 'rejectedElectricians', value: selectedElectricians.length }));
      
      setSelectedElectricians([]);
      fetchElectricians();
      dispatch(fetchAdminStats());
    } catch (error) {
      console.error('Error in bulk rejection:', error);
      toast.error('Failed to reject some electricians');
    }
  };

  const toggleSelection = (electricianId) => {
    setSelectedElectricians(prev => 
      prev.includes(electricianId) 
        ? prev.filter(id => id !== electricianId)
        : [...prev, electricianId]
    );
  };

  const selectAll = () => {
    if (selectedElectricians.length === electricians.length) {
      setSelectedElectricians([]);
    } else {
      setSelectedElectricians(electricians.map(e => e._id));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'suspended':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return FaCheckCircle;
      case 'pending':
        return FaClock;
      case 'rejected':
        return FaUserTimes;
      case 'suspended':
        return FaBan;
      default:
        return FaClock;
    }
  };

  const getRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="w-4 h-4 text-yellow-400 fill-current" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="w-4 h-4 text-yellow-400 fill-current opacity-50" />);
    }
    return stars;
  };

  const filteredElectricians = electricians.filter(electrician => {
    const matchesSearch = 
      electrician.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      electrician.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (electrician.specialization && electrician.specialization.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

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
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FaUserCheck className="w-8 h-8 text-orange-500" />
            Electrician Approvals
          </h2>
          <p className="text-gray-600 mt-2">Review and manage electrician applications</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm text-gray-500">Pending Applications</p>
            <p className="text-2xl font-bold text-orange-600">
              {adminStats.pendingElectricians || electricians.filter(e => e.approvalStatus === 'pending').length}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-800">{adminStats.totalElectricians || electricians.length}</p>
              <p className="text-xs text-gray-500 mt-1">All time</p>
            </div>
            <FaTools className="w-8 h-8 text-orange-500 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-yellow-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {adminStats.pendingElectricians || electricians.filter(e => e.approvalStatus === 'pending').length}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {adminStats.pendingElectricians > 0 ? '⚠️ Action needed' : '✅ All processed'}
              </p>
            </div>
            <FaClock className="w-8 h-8 text-yellow-500 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-green-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved Today</p>
              <p className="text-2xl font-bold text-green-600">
                {adminStats.approvedElectricians || electricians.filter(e => e.approvalStatus === 'approved').length}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {adminStats.totalElectricians > 0 ? Math.round((adminStats.approvedElectricians / adminStats.totalElectricians) * 100) : 0}% approval rate
              </p>
            </div>
            <FaCheckCircle className="w-8 h-8 text-green-500 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-red-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">
                {adminStats.rejectedElectricians || electricians.filter(e => e.approvalStatus === 'rejected').length}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {adminStats.totalElectricians > 0 ? Math.round((adminStats.rejectedElectricians / adminStats.totalElectricians) * 100) : 0}% rejection rate
              </p>
            </div>
            <FaBan className="w-8 h-8 text-red-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500 w-5 h-5" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedElectricians.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-blue-800 font-semibold">
                {selectedElectricians.length} electrician{selectedElectricians.length > 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleBulkApprove}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold flex items-center gap-2"
              >
                <FaCheckCircle className="w-4 h-4" />
                Approve Selected
              </button>
              <button
                onClick={handleBulkReject}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold flex items-center gap-2"
              >
                <FaBan className="w-4 h-4" />
                Reject Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Electricians Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedElectricians.length === electricians.length && electricians.length > 0}
                    onChange={selectAll}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Electrician
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specialization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Experience
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied On
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredElectricians.map((electrician) => {
                const StatusIcon = getStatusIcon(electrician.approvalStatus);
                return (
                  <tr key={electrician._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedElectricians.includes(electrician._id)}
                        onChange={() => toggleSelection(electrician._id)}
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-orange-600">
                            {electrician.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{electrician.name}</div>
                          <div className="text-sm text-gray-500">{electrician.email}</div>
                          <div className="text-xs text-gray-400 flex items-center gap-1">
                            <FaPhone className="w-3 h-3" />
                            {electrician.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{electrician.specialization || 'Not specified'}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <FaMapMarkerAlt className="w-3 h-3" />
                        {electrician.location || 'Not specified'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{electrician.experience || 'Not specified'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(electrician.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(electrician.createdAt).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(electrician.approvalStatus)}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {electrician.approvalStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowElectricianDetails(electrician)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="View Details"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                        {electrician.approvalStatus === 'pending' && (
                          <>
                            <button
                              onClick={() => setShowApprovalModal(electrician)}
                              className="text-green-600 hover:text-green-900 transition-colors"
                              title="Approve"
                            >
                              <FaCheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(electrician)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                              title="Reject"
                            >
                              <FaUserTimes className="w-4 h-4" />
                            </button>
                          </>
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

      {/* Electrician Details Modal */}
      {showElectricianDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Electrician Details</h3>
              <button
                onClick={() => setShowElectricianDetails(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaUserCheck className="w-5 h-5 text-orange-500" />
                  Personal Information
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium">{showElectricianDetails.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email Address</p>
                    <p className="font-medium">{showElectricianDetails.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone Number</p>
                    <p className="font-medium">{showElectricianDetails.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Applied On</p>
                    <p className="font-medium">{new Date(showElectricianDetails.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaTools className="w-5 h-5 text-orange-500" />
                  Professional Information
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Specialization</p>
                    <p className="font-medium">{showElectricianDetails.specialization || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Experience</p>
                    <p className="font-medium">{showElectricianDetails.experience || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">{showElectricianDetails.location || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Certifications</p>
                    <p className="font-medium">
                      {showElectricianDetails.certifications && showElectricianDetails.certifications.length > 0 
                        ? showElectricianDetails.certifications.join(', ') 
                        : 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {showElectricianDetails.approvalStatus === 'pending' && (
              <div className="flex gap-4 justify-end mt-6">
                <button
                  onClick={() => handleReject(showElectricianDetails)}
                  className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-semibold"
                >
                  <FaUserTimes className="w-4 h-4 inline mr-2" />
                  Reject Application
                </button>
                <button
                  onClick={() => handleApprove(showElectricianDetails)}
                  className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-semibold"
                >
                  <FaCheckCircle className="w-4 h-4 inline mr-2" />
                  Approve Application
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Quick Approval</h3>
              <button
                onClick={() => setShowApprovalModal(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <FaExclamationTriangle className="w-6 h-6 text-yellow-600" />
                <h4 className="font-semibold text-yellow-800">Review Before Approval</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{showApprovalModal.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{showApprovalModal.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Specialization</p>
                  <p className="font-medium">{showApprovalModal.specialization || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Experience</p>
                  <p className="font-medium">{showApprovalModal.experience || 'Not specified'}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowApprovalModal(null)}
                className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApprove(showApprovalModal)}
                className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-semibold"
              >
                <FaCheckCircle className="w-4 h-4 inline mr-2" />
                Approve Electrician
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElectricianApproval;
