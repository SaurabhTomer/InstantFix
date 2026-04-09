import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  MapPin, Calendar, Clock, DollarSign, User, Phone, Mail,
  AlertCircle, CheckCircle, XCircle, ArrowLeft, MessageSquare,
  Star, Navigation, FileText, Camera
} from "lucide-react";
import api from "../../api/axios.js";

export default function JobDetails() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [accepting, setAccepting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchJobDetails();
  }, [requestId]);

  // Safe string conversion helper
  const safeString = (value, fallback = '') => {
    if (value === null || value === undefined) return fallback;
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      // Handle address objects
      if (value.street || value.city || value.state || value.pincode) {
        return `${value.street || ''}, ${value.city || ''}, ${value.state || ''} ${value.pincode || ''}`.replace(/^[,\s]+|[,\s]+$/g, '');
      }
      return fallback;
    }
    return String(value);
  };

  const fetchJobDetails = async () => {
    try {
      console.log("Fetching job details for ID:", requestId);
      
      // First try to get from assigned jobs
      try {
        const response = await api.get(`/api/electrician/jobs/${requestId}`);
        console.log("Job details response from assigned jobs:", response.data);
        
        if (response.data.success) {
          setJob(response.data.job);
          console.log("Job data received:", response.data.job);
          console.log("Job images:", response.data.job.images);
          console.log("Images type:", typeof response.data.job.images);
          console.log("Images length:", response.data.job.images?.length);
          return;
        } else {
          console.log("Assigned jobs response failed:", response.data);
        }
      } catch (assignedError) {
        console.log("Not found in assigned jobs, error:", assignedError.response?.status, assignedError.response?.data);
      }
      
      // If not found in assigned jobs, try to get from nearby jobs
      console.log("Trying to find job in nearby jobs...");
      const nearbyResponse = await api.get('/api/electrician/jobs/nearby?radius=100&limit=100');
      console.log("Nearby jobs response:", nearbyResponse.data);
      
      if (nearbyResponse.data.success && nearbyResponse.data.jobs) {
        console.log("Available nearby jobs:", nearbyResponse.data.jobs.map(j => ({ id: j._id, category: j.category })));
        const job = nearbyResponse.data.jobs.find(j => j._id === requestId);
        if (job) {
          setJob(job);
          console.log("Job found in nearby jobs:", job);
          console.log("Job images from nearby:", job.images);
          console.log("Images type from nearby:", typeof job.images);
          console.log("Images length from nearby:", job.images?.length);
          return;
        } else {
          console.log("Job not found in nearby jobs either");
        }
      }
      
      setError("Job not found. This job may not exist or may not be available to you.");
    } catch (error) {
      console.error("Error fetching job details:", error);
      console.error("Error response:", error.response?.data);
      
      // Handle specific error cases
      if (error.response?.status === 403) {
        setError("Access denied - this job is not available to you");
      } else if (error.response?.status === 404) {
        setError("Job not found - this job may have been deleted");
      } else {
        setError(error.response?.data?.message || "Failed to load job details");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptJob = async () => {
    setAccepting(true);
    try {
      const response = await api.put(`/api/electrician/jobs/${requestId}/accept`);
      
      if (response.data.success) {
        // Update job status
        setJob(prev => ({
          ...prev,
          status: 'accepted',
          electrician: user._id
        }));
        alert("Job accepted successfully!");
      }
    } catch (error) {
      console.error("Error accepting job:", error);
      alert(error.response?.data?.message || "Failed to accept job");
    } finally {
      setAccepting(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "pending":
        return { color: "bg-yellow-100 text-yellow-800", icon: Clock, label: "Pending" };
      case "accepted":
        return { color: "bg-blue-100 text-blue-800", icon: CheckCircle, label: "Accepted" };
      case "in_progress":
        return { color: "bg-purple-100 text-purple-800", icon: Clock, label: "In Progress" };
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <FileText size={48} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Job Not Found</h2>
            <p className="text-gray-600 mb-6">{error || "This job doesn't exist or you don't have access to it."}</p>
            
            <div className="space-y-3">
              <button
                onClick={() => navigate("/electrician/nearby-jobs")}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Find Available Jobs
              </button>
              
              <button
                onClick={() => navigate("/electrician/bookings")}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                View My Bookings
              </button>
              
              <button
                onClick={() => navigate(-1)}
                className="w-full px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                Go Back
              </button>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">
                <strong>Job ID:</strong> {requestId}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                If you believe this is an error, please contact support.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(job.status);
  const urgencyConfig = getUrgencyConfig(job.urgency || 'normal');
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-2xl font-bold text-gray-900">{safeString(job.category, 'Electrical Service')}</h1>
                  <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
                    <StatusIcon size={16} />
                    {statusConfig.label}
                  </div>
                  <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${urgencyConfig.color}`}>
                    <AlertCircle size={16} />
                    {urgencyConfig.label}
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{safeString(job.description, 'No description provided')}</p>
                
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>Posted {new Date(job.createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>Updated {new Date(job.updatedAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                  {job.distanceKm && (
                    <div className="flex items-center gap-1">
                      <Navigation size={16} />
                      <span>{safeString(job.distanceKm)} km away</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-right ml-6">
                <p className="text-3xl font-bold text-gray-900">₹{safeString(job.budget, '0')}</p>
                <p className="text-sm text-gray-500">Budget</p>
                
                {job.status === 'pending' && (
                  <button
                    onClick={handleAcceptJob}
                    disabled={accepting}
                    className="mt-4 w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {accepting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Accepting...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={18} />
                        Accept Job
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
              
              {job.customer ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <User size={20} className="text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{safeString(job.customer.name, 'Customer')}</p>
                      <p className="text-sm text-gray-500">Customer</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-gray-400" />
                      <span className="text-sm">{safeString(job.customer.phone)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-400" />
                      <span className="text-sm">{safeString(job.customer.email)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-400" />
                    <span className="text-sm">{safeString(job.address)}</span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Customer information not available</p>
              )}
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                  <p className="text-gray-600">{safeString(job.description, 'No detailed description provided')}</p>
                </div>
                
                {job.images && job.images.length > 0 ? (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Images</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {job.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={typeof image === 'string' ? image : image.url || image.src}
                            alt={`Job image ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                            onError={(e) => {
                              console.error('Image failed to load:', image);
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Images</h3>
                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                      <Camera size={48} className="text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">No images provided for this job</p>
                    </div>
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Additional Notes</h3>
                  <p className="text-gray-600">{safeString(job.notes, 'No additional notes provided')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              
              <div className="space-y-3">
                {job.customer?.phone && (
                  <button
                    onClick={() => window.open(`tel:${safeString(job.customer.phone)}`)}
                    className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone size={16} />
                    Call Customer
                  </button>
                )}
                
                {job.customer?.email && (
                  <button
                    onClick={() => window.open(`mailto:${safeString(job.customer.email)}`)}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Mail size={16} />
                    Send Email
                  </button>
                )}
                
                <button
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare size={16} />
                  Send Message
                </button>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">{safeString(job.address)}</span>
                </div>
                
                {job.coordinates && (
                  <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    <Navigation size={16} />
                    Get Directions
                  </button>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Job Posted</p>
                    <p className="text-xs text-gray-500">{new Date(job.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                
                {job.status !== 'pending' && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Job Accepted</p>
                      <p className="text-xs text-gray-500">{new Date(job.updatedAt).toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
