import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Menu, Zap, Star, Clock, Search, Bell, ArrowRight, CheckCircle, XCircle, AlertCircle,
  TrendingUp, Users, DollarSign, Calendar, MapPin, Phone, MessageSquare, ChevronLeft, ChevronRight
} from "lucide-react";
import ElectricianSidebar from "./ElectricianSidebar";
import api from "../../api/axios.js";

export default function ElectricianDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [stats, setStats] = useState({
    totalBookings: 0,
    completedBookings: 0,
    pendingBookings: 0,
    averageRating: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Set dynamic greeting based on time of day
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) {
        setGreeting("Good morning");
      } else if (hour < 17) {
        setGreeting("Good afternoon");
      } else {
        setGreeting("Good evening");
      }
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch real bookings data
      const bookingsResponse = await api.get('/api/electrician/jobs');
      
      if (bookingsResponse.data.success) {
        const bookings = bookingsResponse.data.jobs || [];
        
        // Calculate stats from real data
        const totalBookings = bookings.length;
        const completedBookings = bookings.filter(b => b.status === 'completed').length;
        const pendingBookings = bookings.filter(b => b.status === 'pending').length;
        const acceptedBookings = bookings.filter(b => b.status === 'accepted').length;
        const inProgressBookings = bookings.filter(b => b.status === 'in_progress').length;
        
                
        // Get recent bookings (last 5)
        const recentBookingsData = bookings
          .sort((a, b) => new Date(b.createdAt || b.acceptedAt) - new Date(a.createdAt || b.acceptedAt))
          .slice(0, 5)
          .map(booking => {
            let actualCharge = 0;
            
            // Only show charge for completed jobs
            if (booking.status === 'completed' && booking.actualCharge) {
              actualCharge = booking.actualCharge;
            }
            
            return {
              id: booking._id,
              customerName: booking.customer?.name || 'Unknown Customer',
              service: booking.category || 'Electrical Service',
              location: typeof booking.address === 'string' 
                ? booking.address 
                : `${booking.address?.city || ''}, ${booking.address?.state || ''}`.trim() || 'Location not specified',
              status: booking.status,
              time: getTimeAgo(booking.createdAt || booking.acceptedAt),
              amount: actualCharge, // Only show actual charge for completed jobs
              distance: booking.distanceKm
            };
          });
        
        setStats({
          totalBookings,
          completedBookings,
          pendingBookings: pendingBookings + acceptedBookings + inProgressBookings,
          averageRating: 0 // Will be implemented later
        });
        
        setRecentBookings(recentBookingsData);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Set empty state on error
      setStats({
        totalBookings: 0,
        completedBookings: 0,
        pendingBookings: 0,
        averageRating: 0
      });
      setRecentBookings([]);
    }
  };

  // Helper function to format time ago
  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Unknown time';
    
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-800",
          icon: AlertCircle,
          label: "Pending"
        };
      case "accepted":
        return {
          color: "bg-blue-100 text-blue-800",
          icon: Clock,
          label: "Accepted"
        };
      case "completed":
        return {
          color: "bg-green-100 text-green-800",
          icon: CheckCircle,
          label: "Completed"
        };
      case "cancelled":
        return {
          color: "bg-red-100 text-red-800",
          icon: XCircle,
          label: "Cancelled"
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          icon: Clock,
          label: "Unknown"
        };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <ElectricianSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Navbar */}
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            {/* Left - Empty now */}
            <div className="flex items-center gap-4">
            </div>

            {/* Center search */}
            <div className="flex-1 max-w-md hidden sm:flex items-center bg-gray-100 rounded-xl px-4 gap-3 h-10">
              <Search size={16} className="text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Search bookings..."
                className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
              />
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
              <Link to="/electrician/profile" className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-sm font-semibold text-white hover:bg-blue-600 transition-colors overflow-hidden">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{user?.name?.charAt(0)?.toUpperCase() || 'E'}</span>
                )}
              </Link>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          {/* Greeting */}
          <div>
            <p className="text-sm text-gray-400 mb-0.5">{greeting} 👋</p>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, <span className="text-blue-500">{user?.name || 'Electrician'}</span>
            </h1>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="text-blue-500" size={20} />
                <span className="text-xs text-gray-500">Total</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
              <p className="text-sm text-gray-600">Bookings</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="text-green-500" size={20} />
                <span className="text-xs text-gray-500">Done</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.completedBookings}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <AlertCircle className="text-yellow-500" size={20} />
                <span className="text-xs text-gray-500">Active</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingBookings}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>

            
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <Star className="text-amber-500" size={20} />
                <span className="text-xs text-gray-500">Rating</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
              <p className="text-sm text-gray-600">Average</p>
            </div>

                      </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-xl border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
              <p className="text-sm text-gray-500">Latest service requests</p>
            </div>
            <div className="p-6 space-y-4">
              {recentBookings.map((booking) => {
                const statusConfig = getStatusConfig(booking.status);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => navigate(`/electrician/job-details/${booking.id}`)}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{booking.customerName}</p>
                        <p className="text-sm text-gray-600">{booking.service}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin size={12} className="text-gray-400" />
                          <span className="text-xs text-gray-500">{booking.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                        <StatusIcon size={12} />
                        {statusConfig.label}
                      </div>
                      {booking.status === 'completed' && booking.amount > 0 && (
                        <p className="text-sm font-semibold text-gray-900 mt-2">Charge: {booking.amount}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">{booking.time}</p>
                    </div>
                  </div>
                );
              })}
              <button 
                onClick={() => navigate('/electrician/nearby-jobs')}
                className="w-full py-3 text-blue-600 font-medium hover:bg-blue-50 rounded-xl transition-colors"
              >
                View All Bookings →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
