import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, UserCheck, Clock, CheckCircle, XCircle, Search
} from "lucide-react";
import api from "../../api/axios.js";

export default function ManageElectricians() {
  const navigate = useNavigate();
  const [electricians, setElectricians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  const statusOptions = [
    { value: "all",      label: "All Electricians" },
    { value: "pending",  label: "Pending Approval" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  const statusConfig = {
    pending:  { color: "bg-yellow-50 text-yellow-700 border-yellow-200", icon: Clock,         label: "Pending" },
    approved: { color: "bg-green-50 text-green-700 border-green-200",   icon: CheckCircle,   label: "Approved" },
    rejected: { color: "bg-red-50 text-red-700 border-red-200",         icon: XCircle,       label: "Rejected" },
  };

  useEffect(() => { fetchElectricians(); }, [filterStatus]);

  const fetchElectricians = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filterStatus !== "all") params.append("status", filterStatus);
      const response = await api.get(`/api/admin/electricians?${params}`);
      if (response.data.success) setElectricians(response.data.electricians || []);
      else setError("Failed to fetch electricians");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch electricians");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (e, electricianId, newStatus) => {
    e.stopPropagation(); // row click se alag
    setUpdatingId(electricianId);
    try {
      const response = await api.put(`/api/admin/electricians/${electricianId}/status`, {
        status: newStatus
      });
      if (response.data.success) {
        setElectricians(prev => prev.map(el =>
          el._id === electricianId ? { ...el, approvalStatus: newStatus } : el
        ));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredElectricians = electricians.filter(el => {
    if (!el) return false;
    return searchTerm === "" ||
      el.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      el.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      el.phone?.toLowerCase().includes(searchTerm.toLowerCase());
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
            <h1 className="text-xl font-bold text-gray-900">Manage Electricians</h1>
            <p className="text-sm text-gray-500 mt-0.5">Approve or reject electrician applications</p>
          </div>
          <button
            onClick={fetchElectricians}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Users size={15} />
            Refresh
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search electricians..."
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
        {filteredElectricians.length === 0 ? (
          <div className="text-center py-16">
            <Users size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No electricians found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Electrician</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Rate</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Joined</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredElectricians.map((el) => {
                  const config = statusConfig[el.approvalStatus] || statusConfig.pending;
                  const StatusIcon = config.icon;
                  const isUpdating = updatingId === el._id;

                  return (
                    <tr
                      key={el._id}
                      onClick={() => navigate(`/admin/electricians/${el._id}`)}
                      className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                            <span className="text-sm font-semibold text-purple-700">
                              {el.name?.charAt(0)?.toUpperCase() || "E"}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{el.name || "Unknown"}</p>
                            <p className="text-xs text-gray-400">{el.email || "No email"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-sm text-gray-600">{el.phone || "—"}</td>
                      <td className="py-3.5 px-4 text-sm font-medium text-gray-900">
                        ₹{el.hourlyRate || "0"}/hr
                      </td>
                      <td className="py-3.5 px-4 text-sm text-gray-500">
                        {new Date(el.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric"
                        })}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}>
                          <StatusIcon size={11} />
                          {config.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        {el.approvalStatus === "pending" && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => handleStatusUpdate(e, el._id, "approved")}
                              disabled={isUpdating}
                              className="px-3 py-1.5 text-xs font-medium bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                            >
                              {isUpdating ? "..." : "Approve"}
                            </button>
                            <button
                              onClick={(e) => handleStatusUpdate(e, el._id, "rejected")}
                              disabled={isUpdating}
                              className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                            >
                              {isUpdating ? "..." : "Reject"}
                            </button>
                          </div>
                        )}
                        {el.approvalStatus !== "pending" && (
                          <span className="text-xs text-gray-300">—</span>
                        )}
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