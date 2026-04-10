import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Users, UserCheck, UserX, Clock, CheckCircle, XCircle, Search,
  Filter, Eye, Edit, Trash2, ChevronDown, Shield, AlertCircle
} from "lucide-react";
import api from "../../api/axios.js";

export default function ManageElectricians() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [electricians, setElectricians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedElectrician, setSelectedElectrician] = useState(null);
  const [showActionDropdown, setShowActionDropdown] = useState(null);

  const statusOptions = [
    { value: "all", label: "All Electricians" },
    { value: "pending", label: "Pending Approval" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" }
  ];

  const statusConfig = {
    pending: {
      color: "bg-yellow-100 text-yellow-800",
      icon: Clock,
      label: "Pending",
      badgeColor: "bg-yellow-500"
    },
    approved: {
      color: "bg-green-100 text-green-800",
      icon: CheckCircle,
      label: "Approved",
      badgeColor: "bg-green-500"
    },
    rejected: {
      color: "bg-red-100 text-red-800",
      icon: XCircle,
      label: "Rejected",
      badgeColor: "bg-red-500"
    }
  };

  useEffect(() => {
    fetchElectricians();
  }, [filterStatus]);

  const fetchElectricians = async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      if (filterStatus !== "all") {
        params.append('status', filterStatus);
      }

      const response = await api.get(`/api/admin/electricians?${params}`);
      
      if (response.data.success) {
        setElectricians(response.data.electricians || []);
      } else {
        setError("Failed to fetch electricians");
      }
    } catch (error) {
      console.error("Error fetching electricians:", error);
      setError(error.response?.data?.message || "Failed to fetch electricians");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (electricianId, newStatus) => {
    try {
      const response = await api.put(`/api/admin/electricians/${electricianId}/status`, {
        status: newStatus
      });

      if (response.data.success) {
        // Update local state
        setElectricians(prev => prev.map(e => 
          e._id === electricianId 
            ? { ...e, approvalStatus: newStatus }
            : e
        ));
        
        alert(`Electrician ${newStatus} successfully!`);
        setShowActionDropdown(null);
      }
    } catch (error) {
      console.error("Error updating electrician status:", error);
      alert(error.response?.data?.message || `Failed to ${newStatus} electrician`);
    }
  };

  const viewElectricianDetails = (electricianId) => {
    navigate(`/admin/electricians/${electricianId}`);
  };

  const filteredElectricians = electricians.filter(electrician => {
    if (!electrician) return false;
    const matchesSearch = searchTerm === "" || 
      (electrician.name && electrician.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (electrician.email && electrician.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (electrician.phone && electrician.phone.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  const getActionOptions = (electrician) => {
    const options = [];
    
    if (electrician.approvalStatus === 'pending') {
      options.push(
        { value: 'approved', label: 'Approve', icon: CheckCircle, color: 'text-green-600' },
        { value: 'rejected', label: 'Reject', icon: XCircle, color: 'text-red-600' }
      );
    }
    
    return options;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading electricians...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage Electricians</h1>
              <p className="text-sm text-gray-600 mt-1">Approve or reject electrician applications</p>
            </div>
            <button
              onClick={fetchElectricians}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
            >
              <Users size={18} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search electricians..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="md:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Electricians List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {filteredElectricians.length === 0 && !loading ? (
            <div className="text-center py-12">
              <Users size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No electricians found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Electrician</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Contact</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Hourly Rate</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Joined</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredElectricians.map((electrician) => {
                    const config = statusConfig[electrician.approvalStatus] || statusConfig.pending;
                    const StatusIcon = config.icon;
                    const actionOptions = getActionOptions(electrician);
                    
                    return (
                      <tr key={electrician._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <UserCheck size={20} className="text-gray-500" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{electrician.name || 'Unknown'}</p>
                              <p className="text-sm text-gray-500">{electrician.email || 'No email'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm">
                            <p className="text-gray-900">{electrician.phone || 'No phone'}</p>
                            <p className="text-gray-500">{electrician.email || 'No email'}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-medium text-gray-900">
                            ${electrician.hourlyRate || '0'}/hr
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-600">
                            {new Date(electrician.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
                            <StatusIcon size={14} />
                            {config.label}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => viewElectricianDetails(electrician._id)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            
                            {actionOptions.length > 0 && (
                              <div className="relative">
                                <button
                                  onClick={() => setShowActionDropdown(
                                    showActionDropdown === electrician._id ? null : electrician._id
                                  )}
                                  className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                  title="More Actions"
                                >
                                  <ChevronDown size={16} />
                                </button>
                                
                                {showActionDropdown === electrician._id && (
                                  <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                    {actionOptions.map((option) => {
                                      const Icon = option.icon;
                                      return (
                                        <button
                                          key={option.value}
                                          onClick={() => handleStatusUpdate(electrician._id, option.value)}
                                          className={`w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-50 ${option.color}`}
                                        >
                                          <Icon size={14} />
                                          {option.label}
                                        </button>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
