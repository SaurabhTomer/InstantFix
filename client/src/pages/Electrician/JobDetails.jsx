import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, MapPin, Calendar, Clock, User, Phone, Mail,
  AlertCircle, CheckCircle, XCircle, FileText, Camera,
  PlayCircle, IndianRupee, Eye
} from "lucide-react";
import api from "../../api/axios.js";

export default function JobDetails() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMsg, setActionMsg] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const statusConfig = {
    pending:   { color: "bg-yellow-50 text-yellow-700 border-yellow-200", icon: Clock,       label: "Pending" },
    accepted:  { color: "bg-blue-50 text-blue-700 border-blue-200",       icon: CheckCircle, label: "Accepted" },
    started:   { color: "bg-purple-50 text-purple-700 border-purple-200", icon: PlayCircle,  label: "In Progress" },
    completed: { color: "bg-green-50 text-green-700 border-green-200",    icon: CheckCircle, label: "Completed" },
    cancelled: { color: "bg-red-50 text-red-700 border-red-200",          icon: XCircle,     label: "Cancelled" },
  };

  useEffect(() => { fetchJobDetails(); }, [requestId]);

  const fetchJobDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/api/electrician/jobs/${requestId}`);
      if (res.data.success) { setJob(res.data.job); return; }
    } catch {}

    try {
      const res = await api.get(`/api/electrician/jobs/nearby?radius=100&limit=100`);
      if (res.data.success) {
        const found = res.data.jobs?.find(j => j._id === requestId);
        if (found) { setJob(found); return; }
      }
    } catch {}

    setError("Job not found or not available to you.");
    setLoading(false);
  };

  const handleAction = async (action) => {
    setActionLoading(action);
    setError("");
    try {
      const res = await api.put(`/api/electrician/jobs/${requestId}/${action}`);
      if (res.data.success) {
        const newStatus = action === 'accept' ? 'accepted' : action === 'start' ? 'started' : 'completed';
        setJob(prev => ({ ...prev, status: newStatus, ...res.data.job }));
        setActionMsg(`Job ${action}ed successfully!`);
        setTimeout(() => setActionMsg(""), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${action} job`);
    } finally {
      setActionLoading(null);
      setLoading(false);
    }
  };

  const handleCashPayment = async () => {
    setActionLoading('cash');
    setError("");
    try {
      const res = await api.post('/api/payments/cash', { requestId });
      if (res.data.message) {
        setJob(prev => ({ ...prev, paymentStatus: 'paid' }));
        setActionMsg("Cash payment recorded!");
        setTimeout(() => setActionMsg(""), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to record cash payment");
    } finally {
      setActionLoading(null);
    }
  };

  const formatAddress = (address) => {
    if (!address) return "—";
    if (typeof address === 'string') return address;
    return [address.street, address.city, address.state, address.pincode].filter(Boolean).join(', ');
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error || !job) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <AlertCircle size={40} className="text-red-400" />
      <p className="text-gray-600">{error || "Job not found"}</p>
      <button onClick={() => navigate(-1)} className="text-sm text-blue-600 hover:underline">Go back</button>
    </div>
  );

  const cfg = statusConfig[job.status] || statusConfig.pending;
  const StatusIcon = cfg.icon;

  return (
    <div className="max-w-4xl mx-auto">

      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft size={16} /> Back
      </button>

      {/* Messages */}
      {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">{error}</div>}
      {actionMsg && <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">{actionMsg}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left */}
        <div className="lg:col-span-1 space-y-4">

          {/* Status Card */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 text-center">
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <StatusIcon size={24} className="text-blue-500" />
            </div>
            <h2 className="font-semibold text-gray-900">{job.category || 'Electrical Service'}</h2>
            <div className="mt-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${cfg.color}`}>
                <StatusIcon size={11} />
                {cfg.label}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 space-y-2">
              {job.status === 'pending' && (
                <button
                  onClick={() => handleAction('accept')}
                  disabled={actionLoading === 'accept'}
                  className="w-full py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {actionLoading === 'accept'
                    ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <><CheckCircle size={14} /> Accept Job</>
                  }
                </button>
              )}
              {job.status === 'accepted' && (
                <button
                  onClick={() => handleAction('start')}
                  disabled={actionLoading === 'start'}
                  className="w-full py-2 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {actionLoading === 'start'
                    ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <><PlayCircle size={14} /> Start Job</>
                  }
                </button>
              )}
              {job.status === 'started' && (
                <button
                  onClick={() => handleAction('complete')}
                  disabled={actionLoading === 'complete'}
                  className="w-full py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {actionLoading === 'complete'
                    ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <><CheckCircle size={14} /> Complete Job</>
                  }
                </button>
              )}
              {job.status === 'completed' && job.paymentStatus !== 'paid' && (
                <button
                  onClick={handleCashPayment}
                  disabled={actionLoading === 'cash'}
                  className="w-full py-2 bg-amber-400 text-black text-sm rounded-lg hover:bg-amber-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {actionLoading === 'cash'
                    ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    : <><IndianRupee size={14} /> Cash Received</>
                  }
                </button>
              )}
              {job.status === 'completed' && job.paymentStatus === 'paid' && (
                <div className="w-full py-2 bg-green-50 text-green-700 border border-green-200 text-sm rounded-lg flex items-center justify-center gap-2">
                  <CheckCircle size={14} /> Payment Done
                </div>
              )}
            </div>
          </div>

          {/* Financial Info */}
          {job.status === 'completed' && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Payment Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Hourly Rate</span>
                  <span className="font-medium">₹{job.hourlyRate || '—'}/hr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Amount</span>
                  <span className="font-bold text-gray-900">₹{job.totalAmount || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment</span>
                  <span className={job.paymentStatus === 'paid' ? 'text-green-600 font-medium' : 'text-yellow-600'}>
                    {job.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Timeline</h3>
            <div className="space-y-3 text-sm">
              {[
                { label: "Posted",    value: job.createdAt },
                { label: "Updated",   value: job.updatedAt },
                { label: "Started",   value: job.startTime },
                { label: "Completed", value: job.endTime },
              ].filter(t => t.value).map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-gray-400">{label}</span>
                  <span className="text-gray-700">
                    {new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="lg:col-span-2 space-y-4">

          {/* Description */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FileText size={14} className="text-gray-400" /> Description
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">{job.description || '—'}</p>
            {job.address && (
              <div className="flex items-start gap-2 mt-4 pt-4 border-t border-gray-50">
                <MapPin size={14} className="text-gray-300 mt-0.5 shrink-0" />
                <p className="text-sm text-gray-500">{formatAddress(job.address)}</p>
              </div>
            )}
          </div>

          {/* Customer */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Customer</h3>
            {job.customer ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-sm font-semibold text-blue-600">
                    {job.customer.name?.charAt(0)?.toUpperCase() || 'C'}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{job.customer.name}</p>
                  {job.customer.phone && (
                    <a href={`tel:${job.customer.phone}`} className="text-xs text-blue-500 hover:underline flex items-center gap-1 mt-0.5">
                      <Phone size={11} /> {job.customer.phone}
                    </a>
                  )}
                  {job.customer.email && (
                    <p className="text-xs text-gray-400 mt-0.5">{job.customer.email}</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400">No customer info</p>
            )}
          </div>

          {/* Photos */}
          {job.photos?.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Camera size={14} className="text-gray-400" /> Photos ({job.photos.length})
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {job.photos.map((photo, i) => (
                  <a key={i} href={photo} target="_blank" rel="noopener noreferrer">
                    <img
                      src={photo}
                      alt={`Photo ${i + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-100 hover:opacity-80 transition-opacity"
                      onError={(e) => e.target.style.display = 'none'}
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