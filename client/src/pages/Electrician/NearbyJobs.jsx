import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  MapPin, Search, Clock, DollarSign, Star, Calendar, 
  AlertCircle, CheckCircle, XCircle, Navigation, RefreshCw,
  Users, Phone, MessageSquare, ArrowRight
} from "lucide-react";
import api from "../../api/axios.js";

export default function NearbyJobs() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRadius, setSelectedRadius] = useState(5); // Default 5km
  const [userLocation, setUserLocation] = useState(null);

  const radiusOptions = [
    { value: 1, label: "1 km" },
    { value: 3, label: "3 km" },
    { value: 5, label: "5 km" },
    { value: 10, label: "10 km" },
    { value: 15, label: "15 km" },
    { value: 25, label: "25 km" }
  ];

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchNearbyJobs();
    }
  }, [userLocation, selectedRadius]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("Unable to get your location. Please enable location services.");
          // Set default location (can be updated by user)
          setUserLocation({ lat: 28.6139, lng: 77.2090 }); // Delhi default
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
      setUserLocation({ lat: 28.6139, lng: 77.2090 }); // Delhi default
    }
  };

  const fetchNearbyJobs = async () => {
    if (!userLocation) return;

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        lat: userLocation.lat,
        lng: userLocation.lng,
        radius: selectedRadius
      });

      const response = await api.get(`/api/electrician/jobs/nearby?${params}`);
      
      if (response.data.success) {
        setJobs(response.data.jobs || []);
      }
    } catch (error) {
      console.error("Error fetching nearby jobs:", error);
      setError(error.response?.data?.message || "Failed to fetch nearby jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptJob = async (jobId) => {
    try {
      const response = await api.put(`/api/electrician/jobs/${jobId}/accept`);
      if (response.data.success) {
        // Remove job from list and show success
        setJobs(jobs.filter(job => job._id !== jobId));
        alert("Job accepted successfully!");
      }
    } catch (error) {
      console.error("Error accepting job:", error);
      alert(error.response?.data?.message || "Failed to accept job");
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "pending":
        return { color: "bg-yellow-100 text-yellow-800", icon: Clock, label: "Pending" };
      case "accepted":
        return { color: "bg-blue-100 text-blue-800", icon: CheckCircle, label: "Accepted" };
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

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Get Nearby Jobs</h1>
              <p className="text-sm text-gray-600">Find service requests in your area</p>
            </div>
            <button
              onClick={fetchNearbyJobs}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {/* Location & Radius Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current Location */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={18} className="text-blue-500" />
                <span className="text-sm font-medium text-gray-700">Your Location</span>
              </div>
              <p className="text-sm text-gray-600">
                {userLocation ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}` : "Detecting..."}
              </p>
              <button
                onClick={getUserLocation}
                className="mt-2 text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Navigation size={12} />
                Update Location
              </button>
            </div>

            {/* Radius Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Radius</label>
              <select
                value={selectedRadius}
                onChange={(e) => setSelectedRadius(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {radiusOptions.map(option => (
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

        {/* Jobs List */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Finding nearby jobs...</p>
            </div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
            <div className="text-center">
              <Search size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600">Try expanding your search radius</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => {
              const statusConfig = getStatusConfig(job.status);
              const urgencyConfig = getUrgencyConfig(job.urgency || 'normal');
              const distance = job.distanceKm || 0;

              return (
                <div key={job._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{job.category || 'Electrical Service'}</h3>
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${urgencyConfig.color}`}>
                          <AlertCircle size={12} />
                          {urgencyConfig.label}
                        </div>
                      </div>
                      <p className="text-gray-600 mb-3">{job.description || 'Service request in your area'}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          <span>{distance.toFixed(1)} km away</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-gray-400" />
                          <span className="text-sm font-medium">{job.customer?.name || 'Customer'}</span>
                        </div>
                        {job.customer?.phone && (
                          <div className="flex items-center gap-2">
                            <Phone size={16} className="text-gray-400" />
                            <span className="text-sm">{job.customer.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right ml-6">
                      <p className="text-2xl font-bold text-gray-900 mb-1">₹{job.budget || '500'}</p>
                      <p className="text-sm text-gray-500 mb-3">Budget</p>
                      <button
                        onClick={() => handleAcceptJob(job._id)}
                        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 mb-2"
                      >
                        <CheckCircle size={16} />
                        Accept Job
                      </button>
                      <button
                        onClick={() => navigate(`/electrician/job-details/${job._id}`)}
                        className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <ArrowRight size={16} />
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
