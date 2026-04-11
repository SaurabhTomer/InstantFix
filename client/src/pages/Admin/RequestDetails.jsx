import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, MapPin, Clock, CheckCircle, XCircle,
  AlertCircle, Zap, User, IndianRupee, Calendar,
  CreditCard, Image
} from "lucide-react";
import api from "../../api/axios.js";

export default function RequestDetails() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { fetchDetails(); }, [requestId]);

  const fetchDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get(`/api/admin/requests/${requestId}`);
      if (response.data.success) setRequest(response.data.request);
      else setError("Failed to fetch request details");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch details");
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    pending:   { color: "bg-yellow-50 text-yellow-700 border-yellow-200", icon: Clock,        label: "Pending" },
    accepted:  { color: "bg-blue-50 text-blue-700 border-blue-200",       icon: Zap,          label: "Accepted" },
    started:   { color: "bg-purple-50 text-purple-700 border-purple-200", icon: Zap,          label: "Started" },
    completed: { color: "bg-green-50 text-green-700 border-green-200",    icon: CheckCircle,  label: "Completed" },
    cancelled: { color: "bg-red-50 text-red-700 border-red-200",          icon: XCircle,      label: "Cancelled" },
  };

  const paymentConfig = {
    pending: { color: "bg-yellow-50 text-yellow-700 border-yellow-200", label: "Unpaid" },
    paid:    { color: "bg-green-50 text-green-700 border-green-200",    label: "Paid" },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <AlertCircle size={40} className="text-red-400" />
        <p className="text-gray-600">{error || "Request not found"}</p>
        <button onClick={() => navigate(-1)} className="text-sm text-purple-600 hover:underline">
          Go back
        </button>
      </div>
    );
  }

  const status  = statusConfig[request.status]              || statusConfig.pending;
  const payment = paymentConfig[request.paymentStatus]      || paymentConfig.pending;
  const StatusIcon = status.icon;
  const address = [
    request.address?.street,
    request.address?.city,
    request.address?.state,
    request.address?.pincode
  ].filter(Boolean).join(", ");

  const formatDate = (date) => date
    ? new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : "—";

  return (
    <div className="max-w-4xl mx-auto">

      {/* Back */}
      <button
        onClick={() => navigate("/admin/requests")}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Requests
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column */}
        <div className="lg:col-span-1 space-y-4">

          {/* Status Card */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 text-center">
            <div className="w-14 h-14 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Zap size={24} className="text-purple-600" />
            </div>
            <h2 className="text-base font-semibold text-gray-900">{request.category}</h2>
            <p className="text-xs text-gray-400 mt-0.5">Service Request</p>
            <div className="mt-3 flex flex-col items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                <StatusIcon size={11} />
                {status.label}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${payment.color}`}>
                <CreditCard size={11} />
                {payment.label}
              </span>
            </div>
          </div>

          {/* Financial Info */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Financials</h3>

            {[
              { label: "Hourly Rate", value: request.hourlyRate ? `₹${request.hourlyRate}/hr` : "—" },
              { label: "Total Amount", value: request.totalAmount ? `₹${request.totalAmount}` : "—" },
              { label: "Payment", value: payment.label },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{label}</span>
                <span className="font-medium text-gray-900">{value}</span>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Timeline</h3>
            {[
              { label: "Created",   value: formatDate(request.createdAt) },
              { label: "Started",   value: formatDate(request.startTime) },
              { label: "Completed", value: formatDate(request.endTime) },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-start justify-between text-sm gap-2">
                <span className="text-gray-400 shrink-0">{label}</span>
                <span className="font-medium text-gray-900 text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-4">

          {/* Description */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Description</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{request.description}</p>

            {address && (
              <div className="flex items-start gap-2 mt-4 pt-4 border-t border-gray-50">
                <MapPin size={14} className="text-gray-300 mt-0.5 shrink-0" />
                <p className="text-sm text-gray-500">{address}</p>
              </div>
            )}
          </div>

          {/* Customer */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Customer</h3>
            {request.customer ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-sm font-semibold text-blue-600">
                    {request.customer.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{request.customer.name}</p>
                  <p className="text-xs text-gray-400">{request.customer.email}</p>
                  <p className="text-xs text-gray-400">{request.customer.phone}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400">No customer info</p>
            )}
          </div>

          {/* Electrician */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Assigned Electrician</h3>
            {request.electrician ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-sm font-semibold text-purple-600">
                    {request.electrician.name?.charAt(0)?.toUpperCase() || "E"}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{request.electrician.name}</p>
                  <p className="text-xs text-gray-400">{request.electrician.email}</p>
                  <p className="text-xs text-gray-400">{request.electrician.phone}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <User size={14} />
                Not assigned yet
              </div>
            )}
          </div>

          {/* Photos */}
          {request.photos?.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Photos</h3>
              <div className="grid grid-cols-3 gap-2">
                {request.photos.map((photo, i) => (
                  <a key={i} href={photo} target="_blank" rel="noopener noreferrer">
                    <img
                      src={photo}
                      alt={`Photo ${i + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-100 hover:opacity-80 transition-opacity"
                    />
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