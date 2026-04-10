import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Calendar, Clock, DollarSign, MapPin, User, Phone, Star,
  Filter, Search, AlertCircle, CheckCircle, XCircle, PlayCircle,
  MessageSquare, Navigation, ArrowRight, RefreshCw, ArrowLeft
} from "lucide-react";
import api from "../../api/axios.js";

export default function MyBookings() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const statusOptions = [
    { value: "all", label: "All Bookings" },
    { value: "accepted", label: "Accepted" },
    { value: "started", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" }
  ];

  useEffect(() => {
    fetchMyBookings();
  }, [filterStatus]);

  const fetchMyBookings = async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      if (filterStatus !== "all") {
        params.append('status', filterStatus);
      }

      console.log("Fetching bookings from:", `/api/electrician/jobs?${params}`);
      const response = await api.get(`/api/electrician/jobs?${params}`);
      
      console.log("Bookings response:", response.data);
      
      if (response.data.success) {
        setBookings(response.data.jobs || []);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError(error.response?.data?.message || "Failed to fetch bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStartJob = async (bookingId) => {
    try {
      const response = await api.put(`/api/electrician/jobs/${bookingId}/start`);
      if (response.data.success) {
        setBookings(bookings.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status: 'started' }
            : booking
        ));
        alert("Job started successfully!");
      }
    } catch (error) {
      console.error("Error starting job:", error);
      alert(error.response?.data?.message || "Failed to start job");
    }
  };

  const handleCompleteJob = async (bookingId) => {
    try {
      const response = await api.put(`/api/electrician/jobs/${bookingId}/complete`);
      if (response.data.success) {
        setBookings(bookings.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status: 'completed' }
            : booking
        ));
        alert("Job completed successfully!");
      }
    } catch (error) {
      console.error("Error completing job:", error);
      alert(error.response?.data?.message || "Failed to complete job");
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "accepted":
        return { color: "bg-blue-100 text-blue-800", icon: CheckCircle, label: "Accepted" };
      case "started":
        return { color: "bg-purple-100 text-purple-800", icon: PlayCircle, label: "In Progress" };
      case "completed":
        return { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Completed" };
      case "cancelled":
        return { color: "bg-red-100 text-red-800", icon: XCircle, label: "Cancelled" };
      default:
        return { color: "bg-gray-100 text-gray-800", icon: Clock, label: "Unknown" };
    }
  };

  const getUrgencyConfig = (urgency) => {
    switch (urgency) {
      case "emergency":
        return { color: "bg-red-100 text-red-800", label: "Emergency" };
      case "urgent":
        return { color: "bg-orange-100 text-orange-800", label: "Urgent" };
      case "normal":
        return { color: "bg-gray-100 text-gray-800", label: "Normal" };
      default:
        return { color: "bg-gray-100 text-gray-800", label: "Normal" };
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (!booking) return false;
    const matchesSearch = searchTerm === "" || 
      (booking.category && booking.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (booking.customer && booking.customer.name && booking.customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (booking.description && booking.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  const getActionButtons = (booking) => {
    switch (booking.status) {
      case "accepted":
        return (
          <button
            onClick={() => handleStartJob(booking._id)}
            className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
          >
            <PlayCircle size={16} />
            Start Job
          </button>
        );
      case "started":
        return (
          <button
            onClick={() => handleCompleteJob(booking._id)}
            className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle size={16} />
            Complete Job
          </button>
        );
      case "completed":
        return (
          <button
            disabled
            className="w-full px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
          >
            <CheckCircle size={16} />
            Completed
          </button>
        );
      case "cancelled":
        return (
          <button
            disabled
            className="w-full px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
          >
            <XCircle size={16} />
            Cancelled
          </button>
        );
      default:
        return null;
    }
  };

  // Simple rendering to avoid object issues
  const renderBookingCard = (booking) => {
    try {
      const statusConfig = getStatusConfig(booking.status);
      const urgencyConfig = getUrgencyConfig(booking.urgency || 'normal');
      const StatusIcon = statusConfig.icon;

      // Safely format address
      const formatAddress = (address) => {
        if (!address) return '';
        if (typeof address === 'string') return address;
        return `${address.street || ''}, ${address.city || ''}, ${address.state || ''} ${address.pincode || ''}`.replace(/^[,\s]+|[,\s]+$/g, '');
      };

      return (
        <div key={booking._id || booking.id || Math.random()} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {booking.category ? String(booking.category) : 'Electrical Service'}
                </h3>
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                  <StatusIcon size={12} />
                  {statusConfig.label}
                </div>
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${urgencyConfig.color}`}>
                  <AlertCircle size={12} />
                  {urgencyConfig.label}
                </div>
              </div>
              <p className="text-gray-600 mb-3">
                {booking.description ? String(booking.description) : 'Service request'}
              </p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>Accepted {new Date(booking.acceptedAt || booking.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
                {booking.distanceKm && (
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    <span>{String(booking.distanceKm)} km away</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-gray-400" />
                  <span className="text-sm font-medium">
                    {booking.customer && booking.customer.name ? String(booking.customer.name) : 'Customer'}
                  </span>
                </div>
                {booking.customer && booking.customer.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-gray-400" />
                    <span className="text-sm">{String(booking.customer.phone)}</span>
                  </div>
                )}
                {booking.address && (
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600">{formatAddress(booking.address)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="text-right ml-6">
              {getActionButtons(booking)}
              
              <button
                onClick={() => navigate(`/electrician/job-details/${booking._id || booking.id}`)}
                className="w-full mt-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowRight size={16} />
                View Details
              </button>
            </div>
          </div>
        </div>
      );
    } catch (error) {
      console.error("Error rendering booking:", error, booking);
      return (
        <div key={booking._id || booking.id || Math.random()} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-red-600">Error displaying booking</p>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/electrician/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
                <p className="text-sm text-gray-600">Manage your accepted and ongoing jobs</p>
              </div>
            </div>
            <button
              onClick={fetchMyBookings}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
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
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="md:w-64">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
            {error}
          </div>
        )}

        {/* Bookings List */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your bookings...</p>
            </div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
            <div className="text-center">
              <Calendar size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600">
                {filterStatus === "all" 
                  ? "You haven't accepted any jobs yet. Check nearby jobs to get started."
                  : `No ${filterStatus.replace('_', ' ')} bookings found.`}
              </p>
              {filterStatus === "all" && (
                <button
                  onClick={() => navigate('/electrician/nearby-jobs')}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Find Jobs
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map(booking => renderBookingCard(booking))}
          </div>
        )}
      </div>
    </div>
  );
}
