import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import { 
  Calendar, Clock, MapPin, User, Phone, Mail, 
  FileText, AlertCircle, CheckCircle, XCircle, 
  Search, Filter, ArrowLeft, Eye
} from "lucide-react";

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Status colors and icons
  const statusConfig = {
    pending: {
      color: "text-amber-600 bg-amber-50 border-amber-200",
      icon: <AlertCircle size={16} />,
      text: "Pending"
    },
    accepted: {
      color: "text-blue-600 bg-blue-50 border-blue-200", 
      icon: <CheckCircle size={16} />,
      text: "Accepted"
    },
    in_progress: {
      color: "text-purple-600 bg-purple-50 border-purple-200",
      icon: <Clock size={16} />,
      text: "In Progress"
    },
    completed: {
      color: "text-green-600 bg-green-50 border-green-200",
      icon: <CheckCircle size={16} />,
      text: "Completed"
    },
    cancelled: {
      color: "text-red-600 bg-red-50 border-red-200",
      icon: <XCircle size={16} />,
      text: "Cancelled"
    }
  };

  // Fetch user bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      console.log("Fetching user bookings...");
      const response = await api.get('/api/requests/my');
      console.log("Bookings response:", response.data);
      
      if (response.data.success) {
        setBookings(response.data.requests || []);
      } else {
        setError(response.data.message || "Failed to load bookings");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      console.error("Error response:", error.response?.data);
      setError(error.response?.data?.message || "Failed to load your bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Filter bookings based on search and status
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.issueDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.address?.city?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short', 
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "Not scheduled";
    return timeString;
  };

  // Get status configuration - map backend statuses to frontend
  const getStatusConfig = (status) => {
    const statusMap = {
      'pending': statusConfig.pending,
      'accepted': statusConfig.accepted,
      'started': statusConfig.in_progress, // Map 'started' to 'in_progress'
      'in_progress': statusConfig.in_progress,
      'completed': statusConfig.completed,
      'cancelled': statusConfig.cancelled
    };
    return statusMap[status] || statusConfig.pending;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <h1 className="text-xl font-semibold text-gray-900">My Bookings</h1>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by category, description, or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="text-red-600" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Bookings Grid */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm || statusFilter !== "all" ? "No matching bookings found" : "No bookings yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "When you book a service, it will appear here"
              }
            </p>
            {(!searchTerm && statusFilter === "all") && (
              <button
                onClick={() => navigate("/user/book-request")}
                className="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-black font-semibold rounded-xl transition-colors"
              >
                Book a Service
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredBookings.map((booking) => {
              const statusInfo = getStatusConfig(booking.status);
              return (
                <div key={booking._id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Main Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {booking.category}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {booking.description}
                          </p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${statusInfo.color}`}>
                          {statusInfo.icon}
                          {statusInfo.text}
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin size={16} className="text-gray-400" />
                          <span>{booking.address?.city}, {booking.address?.state}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar size={16} className="text-gray-400" />
                          <span>{formatDate(booking.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock size={16} className="text-gray-400" />
                          <span>{formatTime(booking.preferredTime)}</span>
                        </div>
                      </div>

                      {/* Electrician Info (if assigned) */}
                      {booking.electrician && (
                        <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                          <div className="flex items-center gap-2 text-sm text-amber-800">
                            <User size={16} />
                            <span className="font-medium">Assigned Electrician:</span>
                            <span>{booking.electrician.name}</span>
                            {booking.electrician.phone && (
                              <span className="text-amber-600">• {booking.electrician.phone}</span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Images Preview */}
                      {booking.photos && booking.photos.length > 0 && (
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-xs text-gray-500">Images:</span>
                          <div className="flex gap-1">
                            {booking.photos.slice(0, 3).map((photo, index) => (
                              <div key={index} className="w-8 h-8 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                                <Eye size={12} className="text-gray-400" />
                              </div>
                            ))}
                            {booking.photos.length > 3 && (
                              <div className="w-8 h-8 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                                <span className="text-xs text-gray-500">+{booking.photos.length - 3}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col gap-2">
                      <button
                        onClick={() => navigate(`/user/bookings/${booking._id}`)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center gap-2"
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
  );
}
