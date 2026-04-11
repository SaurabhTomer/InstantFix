import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Mail, Phone, Calendar, MapPin,
  Clock, CheckCircle, XCircle, AlertCircle, Zap,
  Star, IndianRupee, User, BadgeCheck
} from "lucide-react";
import api from "../../api/axios.js";

export default function ElectricianDetails() {
  const { electricianId } = useParams();
  const navigate = useNavigate();
  const [electrician, setElectrician] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => { fetchDetails(); }, [electricianId]);

  const fetchDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get(`/api/admin/electricians/${electricianId}`);
      if (response.data.success) setElectrician(response.data.electrician);
      else setError("Failed to fetch electrician details");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch details");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      const response = await api.put(`/api/admin/electricians/${electricianId}/status`, {
        status: newStatus
      });
      if (response.data.success) {
        setElectrician(prev => ({ ...prev, approvalStatus: newStatus }));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const statusConfig = {
    pending:  { color: "bg-yellow-50 text-yellow-700 border-yellow-200", icon: Clock,       label: "Pending" },
    approved: { color: "bg-green-50 text-green-700 border-green-200",   icon: CheckCircle, label: "Approved" },
    rejected: { color: "bg-red-50 text-red-700 border-red-200",         icon: XCircle,     label: "Rejected" },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !electrician) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <AlertCircle size={40} className="text-red-400" />
        <p className="text-gray-600">{error || "Electrician not found"}</p>
        <button onClick={() => navigate(-1)} className="text-sm text-purple-600 hover:underline">
          Go back
        </button>
      </div>
    );
  }

  const status = statusConfig[electrician.approvalStatus] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <div className="max-w-4xl mx-auto">

      {/* Back */}
      <button
        onClick={() => navigate("/admin/electricians")}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Electricians
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column */}
        <div className="lg:col-span-1 space-y-4">

          {/* Profile Card */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-700">
                {electrician.name?.charAt(0)?.toUpperCase() || "E"}
              </span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">{electrician.name || "Unknown"}</h2>
            <p className="text-sm text-gray-400 mt-0.5">Electrician</p>

            {/* Status Badge */}
            <div className="mt-3 flex justify-center">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                <StatusIcon size={11} />
                {status.label}
              </span>
            </div>

            {/* Approve/Reject buttons */}
            {electrician.approvalStatus === "pending" && (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleStatusUpdate("approved")}
                  disabled={updatingStatus}
                  className="flex-1 py-2 text-xs font-medium bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                >
                  {updatingStatus ? "..." : "Approve"}
                </button>
                <button
                  onClick={() => handleStatusUpdate("rejected")}
                  disabled={updatingStatus}
                  className="flex-1 py-2 text-xs font-medium bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  {updatingStatus ? "..." : "Reject"}
                </button>
              </div>
            )}

            {/* Re-evaluate if rejected */}
            {electrician.approvalStatus === "rejected" && (
              <button
                onClick={() => handleStatusUpdate("approved")}
                disabled={updatingStatus}
                className="mt-4 w-full py-2 text-xs font-medium bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
              >
                {updatingStatus ? "..." : "Approve Now"}
              </button>
            )}
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">Contact Info</h3>

            {[
              { icon: Mail,     label: "Email",   value: electrician.email },
              { icon: Phone,    label: "Phone",   value: electrician.phone },
              { icon: MapPin,   label: "Address", value: electrician.address },
              { icon: Calendar, label: "Joined",  value: electrician.createdAt
                  ? new Date(electrician.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric"
                    })
                  : null
              },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                  <Icon size={14} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-gray-900 font-medium">{value || "—"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-4">

          {/* Professional Details */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Professional Details</h3>
            <div className="grid grid-cols-2 gap-4">

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <IndianRupee size={14} className="text-gray-400" />
                  <p className="text-xs text-gray-400">Hourly Rate</p>
                </div>
                <p className="text-xl font-bold text-gray-900">
                  ₹{electrician.hourlyRate || "0"}
                  <span className="text-sm font-normal text-gray-400">/hr</span>
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Star size={14} className="text-gray-400" />
                  <p className="text-xs text-gray-400">Rating</p>
                </div>
                <p className="text-xl font-bold text-gray-900">
                  {electrician.rating
                    ? `${electrician.rating.toFixed(1)} ★`
                    : "No rating"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Zap size={14} className="text-gray-400" />
                  <p className="text-xs text-gray-400">Experience</p>
                </div>
                <p className="text-xl font-bold text-gray-900">
                  {electrician.experience
                    ? `${electrician.experience} yrs`
                    : "—"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <BadgeCheck size={14} className="text-gray-400" />
                  <p className="text-xs text-gray-400">Jobs Done</p>
                </div>
                <p className="text-xl font-bold text-gray-900">
                  {electrician.completedJobs ?? "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Skills */}
          {electrician.skills?.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {electrician.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Bio */}
          {electrician.bio && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Bio</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{electrician.bio}</p>
            </div>
          )}

          {/* Documents */}
          {electrician.documents?.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Documents</h3>
              <div className="space-y-2">
                {electrician.documents.map((doc, i) => (
                  <a
                    key={i}
                    href={doc.url || doc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-sm text-purple-600 hover:bg-purple-50 transition-colors"
                  >
                    <BadgeCheck size={14} />
                    {doc.name || `Document ${i + 1}`}
                  </a>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}