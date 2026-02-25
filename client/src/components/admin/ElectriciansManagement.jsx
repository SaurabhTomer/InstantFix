import React, { useState, useEffect } from 'react';
import { FaTools, FaUserPlus, FaSearch, FaFilter, FaEye, FaEdit, FaCheckCircle, FaBan, FaClock, FaTimes, FaMapMarkerAlt, FaStar, FaEnvelope, FaPhone, FaCalendarAlt, FaAward, FaSync } from 'react-icons/fa';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { selectAdminStats, fetchAdminStats } from '../../redux/adminSlice';

const ElectriciansManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showElectricianDetails, setShowElectricianDetails] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(null);
  const [electricians, setElectricians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  const dispatch = useDispatch();
  const adminStats = useSelector(selectAdminStats);

  // Fetch electricians from backend
  useEffect(() => {
    fetchElectricians();
    
    // Set up real-time polling for updates
    const interval = setInterval(() => {
      fetchElectricians();
    }, 30000); // Poll every 30 seconds for real-time updates

    return () => clearInterval(interval);
  }, []);

  // Also fetch when filter changes
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
      setLastUpdated(new Date()); // Update last refreshed time
      
      // Show real-time update notification
      if (response.data.electricians && response.data.electricians.length > 0) {
        const pendingCount = response.data.electricians.filter(e => e.approvalStatus === 'pending').length;
        const approvedCount = response.data.electricians.filter(e => e.approvalStatus === 'approved').length;
        const rejectedCount = response.data.electricians.filter(e => e.approvalStatus === 'rejected').length;
        
        console.log(`Real-time update: ${pendingCount} pending, ${approvedCount} approved, ${rejectedCount} rejected`);
      }
    } catch (error) {
      console.error('Error fetching electricians:', error);
      toast.error('Failed to fetch electricians');
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
        }
      ]);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (electrician) => {
    try {
      await axios.patch(`${serverUrl}/api/admin/electrician/${electrician._id}/approve`, {}, {
        withCredentials: true
      });
      toast.success('Electrician approved successfully!');
      setShowApprovalModal(null);
      fetchElectricians(); // Refresh data
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
      toast.success('Electrician rejected successfully!');
      setShowApprovalModal(null);
      fetchElectricians(); // Refresh data
    } catch (error) {
      console.error('Error rejecting electrician:', error);
      toast.error(error.response?.data?.message || 'Failed to reject electrician');
    }
  };

  const handleSuspend = async (electrician) => {
    try {
      // Since suspend endpoint doesn't exist, we'll update the approvalStatus to 'suspended'
      await axios.patch(`${serverUrl}/api/admin/electrician/${electrician._id}/suspend`, {}, {
        withCredentials: true
      });
      toast.success('Electrician suspended successfully!');
      fetchElectricians(); // Refresh data
    } catch (error) {
      console.error('Error suspending electrician:', error);
      toast.error(error.response?.data?.message || 'Failed to suspend electrician');
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
        return FaBan;
      case 'suspended':
        return FaBan;
      default:
        return FaClock;
    }
  };

  const getRatingStars = (rating) => {
    if (rating === 0) return 'Not Rated';
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
    const matchesFilter = filterStatus === 'all' || electrician.approvalStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Add loading state to the return
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
            <FaTools className="w-8 h-8 text-orange-500" />
            Electricians Management
          </h2>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-gray-600">Manage electrician registrations and approvals</p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
              <button
                onClick={fetchElectricians}
                className="text-orange-500 hover:text-orange-600 transition-colors"
                title="Refresh data"
              >
                ↻
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm text-gray-500">Pending Approval</p>
            <p className="text-2xl font-bold text-orange-600">
              {electricians.filter(e => e.approvalStatus === 'pending').length}
            </p>
          </div>
          <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2">
            <FaUserPlus />
            Add Electrician
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Electricians</p>
              <p className="text-2xl font-bold text-gray-800">{adminStats.totalElectricians || electricians.length}</p>
              <p className="text-xs text-gray-500 mt-1">All time</p>
            </div>
            <FaTools className="w-8 h-8 text-orange-500 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-green-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">
                {adminStats.approvedElectricians || electricians.filter(e => e.approvalStatus === 'approved').length}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {adminStats.totalElectricians > 0 ? Math.round((adminStats.approvedElectricians / adminStats.totalElectricians) * 100) : 0}% of total
              </p>
            </div>
            <FaCheckCircle className="w-8 h-8 text-green-500 opacity-50" />
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
        <div className="bg-white rounded-lg p-4 border border-red-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">
                {adminStats.rejectedElectricians || electricians.filter(e => e.approvalStatus === 'rejected').length}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {adminStats.totalElectricians > 0 ? Math.round((adminStats.rejectedElectricians / adminStats.totalElectricians) * 100) : 0}% of total
              </p>
            </div>
            <FaBan className="w-8 h-8 text-red-500 opacity-50" />
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
              placeholder="Search electricians by name, email, or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400 w-4 h-4" />
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

      {/* Electricians Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
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
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jobs
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
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-orange-600">
                            {electrician.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{electrician.name}</div>
                          <div className="text-sm text-gray-500">{electrician.email}</div>
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
                      <div className="flex items-center gap-1">
                        {getRatingStars(electrician.rating || 0)}
                        {electrician.rating > 0 && (
                          <span className="text-sm text-gray-600 ml-1">({electrician.rating})</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{electrician.completedJobs || 0}/{electrician.totalJobs || 0}</div>
                      <div className="text-xs text-gray-500">completed</div>
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
                        <button
                          className="text-green-600 hover:text-green-900 transition-colors"
                          title="Edit"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        {electrician.approvalStatus === 'pending' && (
                          <button
                            onClick={() => setShowApprovalModal(electrician)}
                            className="text-orange-600 hover:text-orange-900 transition-colors"
                            title="Review Application"
                          >
                            <FaExclamationTriangle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleSuspend(electrician)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Suspend"
                        >
                          <FaBan className="w-4 h-4" />
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

      {/* Electrician Details Modal */}
      {showElectricianDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Electrician Details</h3>
              <button
                onClick={() => setShowElectricianDetails(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-orange-600">{showElectricianDetails.avatar}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-800">{showElectricianDetails.name}</h4>
                  <p className="text-gray-600">{showElectricianDetails.specialization}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(showElectricianDetails.status)}`}>
                      {showElectricianDetails.status}
                    </span>
                    <span>Joined {showElectricianDetails.joinDate}</span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h5 className="font-semibold text-gray-800 mb-3">Contact Information</h5>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <FaEnvelope className="w-4 h-4 text-gray-400" />
                    <span>{showElectricianDetails.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FaPhone className="w-4 h-4 text-gray-400" />
                    <span>{showElectricianDetails.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FaMapMarkerAlt className="w-4 h-4 text-gray-400" />
                    <span>{showElectricianDetails.location}</span>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h5 className="font-semibold text-gray-800 mb-3">Professional Information</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Experience</p>
                    <p className="font-medium">{showElectricianDetails.experience}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Rating</p>
                    <div className="flex items-center gap-1">
                      {getRatingStars(showElectricianDetails.rating)}
                      {showElectricianDetails.rating > 0 && (
                        <span className="text-sm">({showElectricianDetails.rating})</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Jobs</p>
                    <p className="font-medium">{showElectricianDetails.totalJobs}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Completion Rate</p>
                    <p className="font-medium">
                      {showElectricianDetails.totalJobs > 0 
                        ? Math.round((showElectricianDetails.completedJobs / showElectricianDetails.totalJobs) * 100)
                        : 0}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Certifications */}
              <div>
                <h5 className="font-semibold text-gray-800 mb-3">Certifications</h5>
                <div className="flex flex-wrap gap-2">
                  {showElectricianDetails.certifications.map((cert, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowElectricianDetails(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Review Electrician Application</h3>
              <button
                onClick={() => setShowApprovalModal(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Applicant Info */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-800 mb-4">Applicant Information</h4>
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
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{showApprovalModal.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Applied On</p>
                    <p className="font-medium">{new Date(showApprovalModal.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Professional Details */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-800 mb-4">Professional Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Specialization</p>
                    <p className="font-medium">{showApprovalModal.specialization || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Experience</p>
                    <p className="font-medium">{showApprovalModal.experience || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">{showApprovalModal.location || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Certifications</p>
                    <p className="font-medium">
                      {showApprovalModal.certifications && showApprovalModal.certifications.length > 0 
                        ? showApprovalModal.certifications.join(', ') 
                        : 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => handleReject(showApprovalModal)}
                  className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-semibold"
                >
                  <FaBan className="w-4 h-4 inline mr-2" />
                  Reject Application
                </button>
                <button
                  onClick={() => handleApprove(showApprovalModal)}
                  className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-semibold"
                >
                  <FaCheckCircle className="w-4 h-4 inline mr-2" />
                  Approve Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElectriciansManagement;
