import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import {
  ArrowLeft, Calendar, Clock, MapPin, User, Phone, Mail,
  FileText, AlertCircle, CheckCircle, XCircle, Eye, Camera,
  Navigation, Star, Wrench,IndianRupee
} from "lucide-react";


export default function RequestDetails() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Status configuration
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
    started: {
      color: "text-purple-600 bg-purple-50 border-purple-200",
      icon: <Wrench size={16} />,
      text: "In Progress"
    },
    in_progress: {
      color: "text-purple-600 bg-purple-50 border-purple-200",
      icon: <Wrench size={16} />,
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


// Payment handler 
const handlePayment = async () => {
  setPaymentLoading(true);
  try {
    // Step 1: Order create karo
    const { data } = await api.post('/api/payments/create-order', {
      requestId: request._id
    });

    // Step 2: Razorpay checkout open karo
    const options = {
      key: data.keyId,
      amount: data.amount * 100,
      currency: data.currency,
      name: "InstantFix",
      description: `Payment for ${request.category}`,
      order_id: data.orderId,
      handler: async (response) => {
        // Step 3: Verify payment
        try {
          const verifyRes = await api.post('/api/payments/verify', {
            razorpayOrderId:   response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            paymentId:         data.paymentId,
          });

          if (verifyRes.data.message === 'Payment verified successfully') {
            // Local state update — page reload nahi hogi
            setRequest(prev => ({ ...prev, paymentStatus: 'paid' }));
          }
        } catch (err) {
          console.error("Verify error:", err);
        }
      },
      prefill: {
        name:  request.customer?.name  || "",
        email: request.customer?.email || "",
        contact: request.customer?.phone || "",
      },
      theme: { color: "#F59E0B" }, // amber
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (err) {
    console.error("Payment error:", err);
  } finally {
    setPaymentLoading(false);
  }
};

  // Fetch request details
  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/requests/${requestId}`);
      console.log("Request details:", response.data);
      
      if (response.data.success) {
        setRequest(response.data.request);
      } else {
        setError(response.data.message || "Failed to load request details");
      }
    } catch (error) {
      console.error("Error fetching request details:", error);
      setError(error.response?.data?.message || "Failed to load request details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (requestId) {
      fetchRequestDetails();
    }
  }, [requestId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusConfig = (status) => {
    const statusMap = {
      'pending': statusConfig.pending,
      'accepted': statusConfig.accepted,
      'started': statusConfig.in_progress,
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
          <p className="text-gray-600">Loading request details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/user/bookings")}
            className="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-black font-semibold rounded-xl transition-colors"
          >
            Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Request not found</h3>
          <button
            onClick={() => navigate("/user/bookings")}
            className="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-black font-semibold rounded-xl transition-colors"
          >
            Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusConfig(request.status);

  return (
    <div className="min-h-screen bg-gray-50">
    
     

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Status Header */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{request.category}</h2>
                <p className="text-gray-600">Request ID: {request._id}</p>
              </div>
              <div className={`px-4 py-2 rounded-full text-sm font-medium border flex items-center gap-2 ${statusInfo.color}`}>
                {statusInfo.icon}
                {statusInfo.text}
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText size={20} className="text-gray-400" />
                Issue Description
              </h3>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                {request.description}
              </p>
            </div>

            {/* Location */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin size={20} className="text-gray-400" />
                Service Location
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  {request.address?.street && <span>{request.address.street}<br /></span>}
                  {request.address?.city && <span>{request.address.city}, </span>}
                  {request.address?.state && <span>{request.address.state} </span>}
                  {request.address?.pincode && <span>- {request.address.pincode}</span>}
                </p>
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                  <Navigation size={16} />
                  <span>Coordinates: {request.location?.coordinates?.[1]}, {request.location?.coordinates?.[0]}</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Calendar size={20} className="text-gray-400" />
                Timeline
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">Created:</span>
                  <span className="text-sm text-gray-900">{formatDate(request.createdAt)}</span>
                </div>
                {request.updatedAt && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-sm text-gray-600">Last Updated:</span>
                    <span className="text-sm text-gray-900">{formatDate(request.updatedAt)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Images */}
            {request.photos && request.photos.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Camera size={20} className="text-gray-400" />
                  Attached Images ({request.photos.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {request.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                        {photo.startsWith('http') ? (
                          <img 
                            src={photo} 
                            alt={`Service image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center">
                            <Eye size={24} className="text-gray-400 mx-auto mb-2" />
                            <span className="text-xs text-gray-500">Image {index + 1}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Electrician Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <User size={20} className="text-gray-400" />
                Electrician Information
              </h3>
              {request.electrician ? (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{request.electrician.name}</h4>
                        <div className="flex items-center gap-4 mt-1">
                          {request.electrician.phone && (
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Phone size={14} />
                              <span>{request.electrician.phone}</span>
                            </div>
                          )}
                          {request.electrician.email && (
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Mail size={14} />
                              <span>{request.electrician.email}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {request.electrician.experience && (
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Experience:</span> {request.electrician.experience}
                        </div>
                      )}
                      
                      {request.electrician.hourlyRate && (
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Hourly Rate:</span> ₹{request.electrician.hourlyRate}
                        </div>
                      )}
                      
                      {request.electrician.rating && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Star size={14} className="text-amber-400 fill-current" />
                          <span>{request.electrician.rating.toFixed(1)} rating</span>
                        </div>
                      )}
                    </div>
                    
                   
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User size={24} className="text-gray-400" />
                  </div>
                  <p className="text-gray-600">
                    Electrician will be assigned shortly
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    We're working to find the best electrician for your request
                  </p>
                </div>
              )}
            </div>

                  {/* Payment Section */}
      {request.status === 'completed' && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <IndianRupee size={20} className="text-gray-400" />
            Payment
          </h3>

          {request.paymentStatus === 'paid' ? (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg flex items-center gap-3">
              <CheckCircle size={20} className="text-green-600" />
              <div>
                <p className="font-semibold text-green-800">Payment Completed</p>
                <p className="text-sm text-green-600">₹{request.totalAmount} paid successfully</p>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-900">Amount Due</p>
                  <p className="text-2xl font-bold text-amber-600">₹{request.totalAmount}</p>
                </div>
              </div>
              <button
                onClick={handlePayment}
                disabled={paymentLoading}
                className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-black font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {paymentLoading ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <IndianRupee size={18} />
                    Pay Now
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
          </div>
        </div>
      </div>
    </div>
  );
}
