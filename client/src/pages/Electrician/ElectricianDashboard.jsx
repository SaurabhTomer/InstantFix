import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle, XCircle, AlertCircle, Clock,
  TrendingUp, Users, Calendar, MapPin, PlayCircle
} from "lucide-react";
import api from "../../api/axios.js";

export default function ElectricianDashboard() {
  const [greeting, setGreeting] = useState("");
  const [stats, setStats] = useState({
    totalBookings: 0, completedBookings: 0,
    pendingBookings: 0, averageRating: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const update = () => {
      const h = new Date().getHours();
      setGreeting(h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening");
    };
    update();
    const t = setInterval(update, 60000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => { fetchDashboardData(); }, []);

  const getTimeAgo = (dateString) => {
    if (!dateString) return "—";
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/api/electrician/jobs');
      if (res.data.success) {
        const bookings = res.data.jobs || [];
        const completed = bookings.filter(b => b.status === 'completed').length;
        const active = bookings.filter(b => ['pending','accepted','started'].includes(b.status)).length;

        setStats({
          totalBookings: bookings.length,
          completedBookings: completed,
          pendingBookings: active,
          averageRating: 0
        });

        setRecentBookings(
          [...bookings]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const statusConfig = {
    pending:   { color: "bg-yellow-50 text-yellow-700 border-yellow-200", icon: Clock,        label: "Pending" },
    accepted:  { color: "bg-blue-50 text-blue-700 border-blue-200",       icon: CheckCircle,  label: "Accepted" },
    started:   { color: "bg-purple-50 text-purple-700 border-purple-200", icon: PlayCircle,   label: "In Progress" },
    completed: { color: "bg-green-50 text-green-700 border-green-200",    icon: CheckCircle,  label: "Completed" },
    cancelled: { color: "bg-red-50 text-red-700 border-red-200",          icon: XCircle,      label: "Cancelled" },
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Greeting */}
      <div>
        <p className="text-sm text-gray-400">{greeting} 👋</p>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, <span className="text-blue-500">{user?.name || 'Electrician'}</span>
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Jobs",   value: stats.totalBookings,    icon: Calendar,     color: "text-blue-500",   bg: "bg-blue-50" },
          { label: "Completed",    value: stats.completedBookings, icon: CheckCircle,  color: "text-green-500",  bg: "bg-green-50" },
          { label: "Active",       value: stats.pendingBookings,   icon: AlertCircle,  color: "text-yellow-500", bg: "bg-yellow-50" },
          { label: "Rating",       value: stats.averageRating || "—", icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-50" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className={`w-9 h-9 ${stat.bg} rounded-lg flex items-center justify-center mb-3`}>
              <stat.icon size={18} className={stat.color} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Recent Bookings</h3>
            <p className="text-xs text-gray-400 mt-0.5">Latest service requests</p>
          </div>
          <button
            onClick={() => navigate('/electrician/bookings')}
            className="text-sm text-blue-600 hover:underline"
          >
            View all
          </button>
        </div>

        {recentBookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar size={36} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No bookings yet</p>
            <button
              onClick={() => navigate('/electrician/nearby-jobs')}
              className="mt-3 text-sm text-blue-600 hover:underline"
            >
              Find nearby jobs →
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentBookings.map((b) => {
              const cfg = statusConfig[b.status] || statusConfig.pending;
              const StatusIcon = cfg.icon;
              const address = typeof b.address === 'string'
                ? b.address
                : [b.address?.city, b.address?.state].filter(Boolean).join(', ');

              return (
                <div
                  key={b._id}
                  onClick={() => navigate(`/electrician/job-details/${b._id}`)}
                  className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                      <Users size={16} className="text-blue-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {b.customer?.name || 'Customer'}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{b.category || 'Electrical Service'}</p>
                      {address && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <MapPin size={10} className="text-gray-300" />
                          <span className="text-xs text-gray-400 truncate">{address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.color}`}>
                      <StatusIcon size={10} />
                      {cfg.label}
                    </span>
                    <span className="text-xs text-gray-400">{getTimeAgo(b.createdAt)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => navigate('/electrician/nearby-jobs')}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl p-5 text-left transition-colors"
        >
          <MapPin size={20} className="mb-3" />
          <p className="font-semibold">Find Nearby Jobs</p>
          <p className="text-sm text-blue-100 mt-0.5">Browse available requests</p>
        </button>
        <button
          onClick={() => navigate('/electrician/bookings')}
          className="bg-white hover:bg-gray-50 border border-gray-100 text-gray-900 rounded-xl p-5 text-left transition-colors"
        >
          <Calendar size={20} className="mb-3 text-blue-500" />
          <p className="font-semibold">My Bookings</p>
          <p className="text-sm text-gray-400 mt-0.5">Manage your jobs</p>
        </button>
      </div>
    </div>
  );
}