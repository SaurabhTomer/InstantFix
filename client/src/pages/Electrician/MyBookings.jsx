import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar, Clock, MapPin, User, Phone,
  AlertCircle, CheckCircle, XCircle, Search,
  PlayCircle, RefreshCw, IndianRupee
} from "lucide-react";
import api from "../../api/axios.js";

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMsg, setActionMsg] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const statusOptions = [
    { value: "all",       label: "All Bookings" },
    { value: "accepted",  label: "Accepted" },
    { value: "started",   label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const statusConfig = {
    accepted:  { color: "bg-blue-50 text-blue-700 border-blue-200",     icon: CheckCircle,  label: "Accepted" },
    started:   { color: "bg-purple-50 text-purple-700 border-purple-200", icon: PlayCircle,  label: "In Progress" },
    completed: { color: "bg-green-50 text-green-700 border-green-200",   icon: CheckCircle,  label: "Completed" },
    cancelled: { color: "bg-red-50 text-red-700 border-red-200",         icon: XCircle,      label: "Cancelled" },
  };

  useEffect(() => { fetchMyBookings(); }, [filterStatus]);

  const fetchMyBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filterStatus !== "all") params.append('status', filterStatus);
      const res = await api.get(`/api/electrician/jobs?${params}`);
      if (res.data.success) setBookings(res.data.jobs || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (bookingId, action) => {
    setActionLoading(bookingId + action);
    setError("");
    try {
      const res = await api.put(`/api/electrician/jobs/${bookingId}/${action}`);
      if (res.data.success) {
        const newStatus = action === 'start' ? 'started' : 'completed';
        setBookings(prev => prev.map(b =>
          b._id === bookingId ? { ...b, status: newStatus } : b
        ));
        setActionMsg(`Job ${action === 'start' ? 'started' : 'completed'} successfully!`);
        setTimeout(() => setActionMsg(""), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${action} job`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCashPayment = async (bookingId) => {
    setActionLoading(bookingId + 'cash');
    setError("");
    try {
      const res = await api.post('/api/payments/cash', { requestId: bookingId });
      if (res.data.message) {
        setBookings(prev => prev.map(b =>
          b._id === bookingId ? { ...b, paymentStatus: 'paid' } : b
        ));
        setActionMsg("Cash payment recorded successfully!");
        setTimeout(() => setActionMsg(""), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to record cash payment");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (!b) return false;
    return searchTerm === "" ||
      b.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const formatAddress = (address) => {
    if (!address) return "—";
    if (typeof address === 'string') return address;
    return [address.street, address.city, address.state].filter(Boolean).join(', ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-5">

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-sm text-gray-400 mt-0.5">Manage your accepted and ongoing jobs</p>
          </div>
          <button
            onClick={fetchMyBookings}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
          >
            <RefreshCw size={15} />
            Refresh
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="sm:w-44 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">{error}</div>
      )}
      {actionMsg && (
        <div className="px-4 py-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">{actionMsg}</div>
      )}

      {/* Bookings */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 text-center py-16">
          <Calendar size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No bookings found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => {
            const cfg = statusConfig[b.status] || statusConfig.accepted;
            const StatusIcon = cfg.icon;
            const isActing = (action) => actionLoading === b._id + action;

            return (
              <div
                key={b._id}
                className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => navigate(`/electrician/job-details/${b._id}`)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900">{b.category || 'Electrical Service'}</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.color}`}>
                        <StatusIcon size={10} />
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-3 line-clamp-1">{b.description || '—'}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <User size={13} className="text-gray-300" />
                        <span>{b.customer?.name || '—'}</span>
                      </div>
                      {b.customer?.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone size={13} className="text-gray-300" />
                          <span>{b.customer.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <MapPin size={13} className="text-gray-300" />
                        <span>{formatAddress(b.address)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-gray-300" />
                        <span>{new Date(b.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>

                    {/* Total amount if completed */}
                    {b.status === 'completed' && b.totalAmount > 0 && (
                      <div className="mt-3 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                        <IndianRupee size={13} />
                        <span>Total: ₹{b.totalAmount}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 shrink-0 min-w-[130px]">
                    {b.status === 'accepted' && (
                      <button
                        onClick={() => handleAction(b._id, 'start')}
                        disabled={isActing('start')}
                        className="px-4 py-2 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                      >
                        {isActing('start')
                          ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          : <><PlayCircle size={14} /> Start Job</>
                        }
                      </button>
                    )}

                    {b.status === 'started' && (
                      <button
                        onClick={() => handleAction(b._id, 'complete')}
                        disabled={isActing('complete')}
                        className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                      >
                        {isActing('complete')
                          ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          : <><CheckCircle size={14} /> Complete</>
                        }
                      </button>
                    )}

                    {/* Cash Payment Button */}
                    {b.status === 'completed' && b.paymentStatus !== 'paid' && (
                      <button
                        onClick={() => handleCashPayment(b._id)}
                        disabled={isActing('cash')}
                        className="px-4 py-2 bg-amber-400 text-black text-sm rounded-lg hover:bg-amber-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                      >
                        {isActing('cash')
                          ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          : <><IndianRupee size={14} /> Cash Received</>
                        }
                      </button>
                    )}

                    {/* Payment done */}
                    {b.status === 'completed' && b.paymentStatus === 'paid' && (
                      <div className="px-4 py-2 bg-green-50 text-green-700 border border-green-200 text-xs rounded-lg flex items-center justify-center gap-1.5">
                        <CheckCircle size={13} />
                        Payment Done
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}