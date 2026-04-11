import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText, Clock, CheckCircle, XCircle, Search,
  MapPin, User, AlertCircle, Activity, Zap
} from "lucide-react";
import api from "../../api/axios.js";

export default function ManageRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const statusOptions = [
    { value: "all",         label: "All Requests" },
    { value: "pending",     label: "Pending" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed",   label: "Completed" },
    { value: "cancelled",   label: "Cancelled" },
  ];

  const statusConfig = {
    pending:      { color: "bg-yellow-50 text-yellow-700 border-yellow-200", icon: Clock,        label: "Pending" },
    "in-progress":{ color: "bg-blue-50 text-blue-700 border-blue-200",       icon: Zap,          label: "In Progress" },
    completed:    { color: "bg-green-50 text-green-700 border-green-200",    icon: CheckCircle,  label: "Completed" },
    cancelled:    { color: "bg-red-50 text-red-700 border-red-200",          icon: XCircle,      label: "Cancelled" },
  };

  const urgencyConfig = {
    emergency: { color: "bg-red-50 text-red-700 border-red-200",       label: "Emergency" },
    urgent:    { color: "bg-orange-50 text-orange-700 border-orange-200", label: "Urgent" },
    normal:    { color: "bg-gray-50 text-gray-600 border-gray-200",     label: "Normal" },
  };

  useEffect(() => { fetchRequests(); }, [filterStatus]);

  const fetchRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filterStatus !== "all") params.append("status", filterStatus);
      const response = await api.get(`/api/admin/requests?${params}`);
      if (response.data.success) setRequests(response.data.requests || []);
      else setError("Failed to fetch requests");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter(r => {
    if (!r) return false;
    return searchTerm === "" ||
      r.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Service Requests</h1>
            <p className="text-sm text-gray-500 mt-0.5">Monitor and manage all service requests</p>
          </div>
          <button
            onClick={fetchRequests}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Activity size={15} />
            Refresh
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by category, description, or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="md:w-44 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-16">
            <FileText size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No requests found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Request</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Location</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Urgency</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req) => {
                  const config  = statusConfig[req.status]   || statusConfig.pending;
                  const urgency = urgencyConfig[req.urgency] || urgencyConfig.normal;
                  const StatusIcon = config.icon;
                  const address = typeof req.address === "string"
                    ? req.address
                    : [req.address?.street, req.address?.city, req.address?.state].filter(Boolean).join(", ");

                  return (
                    <tr
                      key={req._id}
                      onClick={() => navigate(`/admin/requests/${req._id}`)}
                      className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-gray-900 text-sm">
                          {req.category || "Electrical Service"}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 max-w-xs truncate">
                          {req.description || "No description"}
                        </p>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                            <span className="text-xs font-semibold text-blue-600">
                              {req.customer?.name?.charAt(0)?.toUpperCase() || "?"}
                            </span>
                          </div>
                          <span className="text-sm text-gray-700">{req.customer?.name || "—"}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {address ? (
                          <div className="flex items-center gap-1.5 text-sm text-gray-500 max-w-[160px]">
                            <MapPin size={12} className="text-gray-300 shrink-0" />
                            <span className="truncate">{address}</span>
                          </div>
                        ) : (
                          <span className="text-gray-300 text-sm">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-sm text-gray-500">
                        {new Date(req.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric"
                        })}
                      </td>
                      <td className="py-3.5 px-4">
                        {req.urgency ? (
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${urgency.color}`}>
                            <AlertCircle size={10} />
                            {urgency.label}
                          </span>
                        ) : (
                          <span className="text-gray-300 text-sm">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}>
                          <StatusIcon size={11} />
                          {config.label}
                        </span>
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
  );
}