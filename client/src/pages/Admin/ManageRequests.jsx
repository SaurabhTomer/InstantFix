import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FileText, Calendar, Clock, CheckCircle, XCircle, Search, Filter,
  Eye, MapPin, User, AlertCircle, Activity, Zap
} from "lucide-react";
import api from "../../api/axios.js";

export default function ManageRequests() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const statusOptions = [
    { value: "all", label: "All Requests" },
    { value: "pending", label: "Pending" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" }
  ];

  const statusConfig = {
    pending: {
      color: "bg-yellow-100 text-yellow-800",
      icon: Clock,
      label: "Pending",
      badgeColor: "bg-yellow-500"
    },
    'in-progress': {
      color: "bg-blue-100 text-blue-800",
      icon: Zap,
      label: "In Progress",
      badgeColor: "bg-blue-500"
    },
    completed: {
      color: "bg-green-100 text-green-800",
      icon: CheckCircle,
      label: "Completed",
      badgeColor: "bg-green-500"
    },
    cancelled: {
      color: "bg-red-100 text-red-800",
      icon: XCircle,
      label: "Cancelled",
      badgeColor: "bg-red-500"
    }
  };

  const urgencyConfig = {
    emergency: {
      color: "bg-red-100 text-red-800",
      label: "Emergency"
    },
    urgent: {
      color: "bg-orange-100 text-orange-800",
      label: "Urgent"
    },
    normal: {
      color: "bg-gray-100 text-gray-800",
      label: "Normal"
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [filterStatus]);

  const fetchRequests = async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      if (filterStatus !== "all") {
        params.append('status', filterStatus);
      }

      const response = await api.get(`/api/admin/requests?${params}`);
      
      if (response.data.success) {
        setRequests(response.data.requests || []);
      } else {
        setError("Failed to fetch requests");
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      setError(error.response?.data?.message || "Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  const viewRequestDetails = (requestId) => {
    navigate(`/admin/requests/${requestId}`);
  };

  const filteredRequests = requests.filter(request => {
    if (!request) return false;
    const matchesSearch = searchTerm === "" || 
      (request.category && request.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (request.description && request.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (request.customer?.name && request.customer.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading service requests...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Service Requests</h1>
              <p className="text-sm text-gray-600 mt-1">Monitor and manage all service requests</p>
            </div>
            <button
              onClick={fetchRequests}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
            >
              <Activity size={18} className={loading ? "animate-spin" : ""} />
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
                  placeholder="Search requests..."
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

        {/* Requests List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {filteredRequests.length === 0 && !loading ? (
            <div className="text-center py-12">
              <FileText size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => {
                const config = statusConfig[request.status] || statusConfig.pending;
                const StatusIcon = config.icon;
                const urgency = urgencyConfig[request.urgency] || urgencyConfig.normal;
                
                return (
                  <div key={request._id} className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {request.category || 'Electrical Service'}
                          </h3>
                          <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
                            <StatusIcon size={14} />
                            {config.label}
                          </div>
                          {request.urgency && (
                            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${urgency.color}`}>
                              <AlertCircle size={14} />
                              {urgency.label}
                            </div>
                          )}
                        </div>
                        
                        <p className="text-gray-600 mb-4">
                          {request.description || 'No description provided'}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          {request.customer && (
                            <div className="flex items-center gap-2">
                              <User size={16} className="text-gray-400" />
                              <span className="text-gray-600">{request.customer.name}</span>
                            </div>
                          )}
                          {request.address && (
                            <div className="flex items-center gap-2">
                              <MapPin size={16} className="text-gray-400" />
                              <span className="text-gray-600">
                                {typeof request.address === 'string' 
                                  ? request.address 
                                  : `${request.address.street || ''}, ${request.address.city || ''}, ${request.address.state || ''}`
                                }
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-gray-400" />
                            <span className="text-gray-600">
                              Posted: {new Date(request.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          {request.assignedElectrician && (
                            <div className="flex items-center gap-2">
                              <User size={16} className="text-gray-400" />
                              <span className="text-gray-600">
                                Electrician: {request.assignedElectrician.name}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right ml-6">
                        <button
                          onClick={() => viewRequestDetails(request._id)}
                          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
                        >
                          <Eye size={16} />
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
