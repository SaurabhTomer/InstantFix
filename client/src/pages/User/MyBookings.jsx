import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import {
  Calendar, Clock, MapPin, User, Phone,
  AlertCircle, CheckCircle, XCircle,
  Search, Filter, Eye, Zap, Lightbulb,
  Wind, ToggleLeft, Settings, Power
} from "lucide-react";

const STATUS_CONFIG = {
  pending:     { label: "Pending",     dot: "bg-amber-400",  badge: "bg-amber-50 text-amber-800 border-amber-200",   icon: AlertCircle },
  accepted:    { label: "Accepted",    dot: "bg-blue-400",   badge: "bg-blue-50 text-blue-800 border-blue-200",       icon: CheckCircle },
  started:     { label: "In Progress", dot: "bg-violet-400", badge: "bg-violet-50 text-violet-800 border-violet-200", icon: Clock },
  in_progress: { label: "In Progress", dot: "bg-violet-400", badge: "bg-violet-50 text-violet-800 border-violet-200", icon: Clock },
  completed:   { label: "Completed",   dot: "bg-green-400",  badge: "bg-green-50 text-green-800 border-green-200",    icon: CheckCircle },
  cancelled:   { label: "Cancelled",   dot: "bg-red-400",    badge: "bg-red-50 text-red-800 border-red-200",          icon: XCircle },
};

const CATEGORY_ICONS = {
  Wiring:     { icon: Zap,        bg: "bg-amber-50",  text: "text-amber-600" },
  Lighting:   { icon: Lightbulb,  bg: "bg-sky-50",    text: "text-sky-600" },
  "AC Repair":{ icon: Wind,       bg: "bg-cyan-50",   text: "text-cyan-600" },
  Switchboard:{ icon: ToggleLeft, bg: "bg-orange-50", text: "text-orange-600" },
  Panel:      { icon: Settings,   bg: "bg-slate-50",  text: "text-slate-600" },
  Generator:  { icon: Power,      bg: "bg-rose-50",   text: "text-rose-600" },
};

const DEFAULT_ICON = { icon: Zap, bg: "bg-amber-50", text: "text-amber-600" };

function formatDate(str) {
  return new Date(str).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.badge}`}>
      <Icon size={12} />
      {cfg.label}
    </span>
  );
}

function StatCard({ label, value, dotClass }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center gap-3">
      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dotClass}`} />
      <div>
        <p className="text-xl font-bold text-gray-900 leading-none">{value}</p>
        <p className="text-xs text-gray-400 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function BookingCard({ booking, onView }) {
  const catCfg = CATEGORY_ICONS[booking.category] || DEFAULT_ICON;
  const CatIcon = catCfg.icon;
  const statusCfg = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-amber-300 hover:shadow-md transition-all duration-200">
      <div className="flex items-start gap-4">
        {/* Category icon */}
        <div className={`w-11 h-11 rounded-xl ${catCfg.bg} flex items-center justify-center flex-shrink-0`}>
          <CatIcon size={20} className={catCfg.text} />
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-1">
            <div>
              <h3 className="text-base font-semibold text-gray-900">{booking.category}</h3>
              <p className="text-xs text-gray-400 font-mono mt-0.5">{booking._id}</p>
            </div>
            <StatusBadge status={booking.status} />
          </div>

          <p className="text-sm text-gray-500 leading-relaxed mb-3 line-clamp-2">
            {booking.issueDescription || booking.description || "No description provided"}
          </p>

          {/* Meta row */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-400 mb-3">
            <span className="flex items-center gap-1">
              <MapPin size={12} className="text-gray-300" />
              {booking.address?.city}, {booking.address?.state}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={12} className="text-gray-300" />
              {formatDate(booking.createdAt)}
            </span>
            {booking.preferredTime && (
              <span className="flex items-center gap-1">
                <Clock size={12} className="text-gray-300" />
                {booking.preferredTime}
              </span>
            )}
          </div>

          {/* Electrician info */}
          {booking.electrician && (
            <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 mb-3">
              <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                {booking.electrician.name?.charAt(0) || "E"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-amber-900 truncate">{booking.electrician.name}</p>
                {booking.electrician.phone && (
                  <p className="text-xs text-amber-700">{booking.electrician.phone}</p>
                )}
              </div>
              <span className="text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">Assigned</span>
            </div>
          )}

          {/* Photos */}
          {booking.photos?.length > 0 && (
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-xs text-gray-400">Photos:</span>
              {booking.photos.slice(0, 4).map((_, i) => (
                <div key={i} className="w-7 h-7 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                  <Eye size={10} className="text-gray-400" />
                </div>
              ))}
              {booking.photos.length > 4 && (
                <div className="w-7 h-7 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-xs text-gray-400">
                  +{booking.photos.length - 4}
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-50">
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
              <span className="text-xs text-gray-400">{statusCfg.label}</span>
            </div>
            <button
              onClick={() => onView(booking._id)}
              className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Eye size={12} />
              View details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const FILTER_TABS = [
  { key: "all",         label: "All" },
  { key: "pending",     label: "Pending" },
  { key: "accepted",    label: "Accepted" },
  { key: "in_progress", label: "In progress" },
  { key: "completed",   label: "Completed" },
  { key: "cancelled",   label: "Cancelled" },
];

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/requests/my");
      if (response.data.success) {
        setBookings(response.data.requests || []);
      } else {
        setError(response.data.message || "Failed to load bookings");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load your bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const filtered = bookings.filter((b) => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      b.category?.toLowerCase().includes(q) ||
      b.issueDescription?.toLowerCase().includes(q) ||
      b.description?.toLowerCase().includes(q) ||
      b.address?.city?.toLowerCase().includes(q);
    const matchStatus =
      statusFilter === "all" ||
      b.status === statusFilter ||
      (statusFilter === "in_progress" && b.status === "started");
    return matchSearch && matchStatus;
  });

  const counts = {
    all:         bookings.length,
    pending:     bookings.filter(b => b.status === "pending").length,
    accepted:    bookings.filter(b => b.status === "accepted").length,
    in_progress: bookings.filter(b => b.status === "in_progress" || b.status === "started").length,
    completed:   bookings.filter(b => b.status === "completed").length,
    cancelled:   bookings.filter(b => b.status === "cancelled").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading your bookings…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-5">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My bookings</h1>
          <p className="text-sm text-gray-400 mt-0.5">Track and manage all your service requests</p>
        </div>

        {/* Stat strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Total"       value={counts.all}         dotClass="bg-gray-300" />
          <StatCard label="In progress" value={counts.in_progress} dotClass="bg-violet-400" />
          <StatCard label="Completed"   value={counts.completed}   dotClass="bg-green-400" />
          <StatCard label="Pending"     value={counts.pending}     dotClass="bg-amber-400" />
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by category, description, or city…"
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-300 focus:border-amber-300 outline-none bg-gray-50 placeholder-gray-300"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  statusFilter === tab.key
                    ? "bg-amber-400 text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {tab.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                  statusFilter === tab.key ? "bg-white/30 text-white" : "bg-white text-gray-500"
                }`}>
                  {counts[tab.key]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Bookings list for user */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={24} className="text-gray-300" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              {searchTerm || statusFilter !== "all" ? "No matching bookings" : "No bookings yet"}
            </h3>
            <p className="text-sm text-gray-400 mb-5">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter"
                : "Your service requests will appear here"}
            </p>
            {!searchTerm && statusFilter === "all" && (
              <button
                onClick={() => navigate("/user/book-request")}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Book a service
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onView={(id) => navigate(`/user/bookings/${id}`)}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}