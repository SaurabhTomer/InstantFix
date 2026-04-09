import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import { useDispatch, useSelector } from "react-redux";
import { setUser, logout } from "../../store/authSlice.js";
import {
  User, Mail, Phone, MapPin, Calendar, Edit3, Save, X,
  Shield, History, Star, Camera, Upload, AlertCircle,
  CheckCircle, LogOut, Eye, EyeOff
} from "lucide-react";

export default function UserProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: ""
  });

  // Booking history state
  const [bookingHistory, setBookingHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Profile image state
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Fetch user profile data
  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/auth/me');
      console.log("Profile data:", response.data);
      
      if (response.data.success) {
        const userData = response.data.user;
        setProfileData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || ""
        });
        setImagePreview(userData.avatar || "");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch booking history
  const fetchBookingHistory = async () => {
    try {
      setHistoryLoading(true);
      const response = await api.get('/api/requests/my');
      
      if (response.data.success) {
        setBookingHistory(response.data.requests || []);
      }
    } catch (error) {
      console.error("Error fetching booking history:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
    if (activeTab === "history") {
      fetchBookingHistory();
    }
  }, [activeTab]);

  // Handle profile form submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.put('/api/auth/update-profile', profileData);
      
      if (response.data.success) {
        setSuccess("Profile updated successfully!");
        dispatch(setUser(response.data.user));
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // Handle profile image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      const formData = new FormData();
      formData.append('avatar', file); // Use 'avatar' instead of 'profileImage'

      try {
        setSaving(true);
        const response = await api.put('/api/auth/update-profile', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        if (response.data.success) {
          setImagePreview(response.data.user.avatar || URL.createObjectURL(file));
          setSuccess("Profile image updated successfully!");
          dispatch(setUser(response.data.user));
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        setError(error.response?.data?.message || "Failed to upload profile image");
      } finally {
        setSaving(false);
      }
    }
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      pending: "text-amber-600 bg-amber-50",
      accepted: "text-blue-600 bg-blue-50",
      started: "text-purple-600 bg-purple-50",
      in_progress: "text-purple-600 bg-purple-50",
      completed: "text-green-600 bg-green-50",
      cancelled: "text-red-600 bg-red-50"
    };
    return colors[status] || "text-gray-600 bg-gray-50";
  };

  if (loading && activeTab === "profile") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
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
            <X size={20} />
            <span>Back</span>
          </button>
          <h1 className="text-xl font-semibold text-gray-900">My Profile</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {/* Profile Image */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-amber-100"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center">
                      <User size={40} className="text-amber-600" />
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 bg-amber-400 text-white p-2 rounded-full cursor-pointer hover:bg-amber-500 transition-colors">
                    <Camera size={16} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{user?.name}</h3>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === "profile"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <User size={20} />
                  <span className="font-medium">Profile Information</span>
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === "history"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <History size={20} />
                  <span className="font-medium">Booking History</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Information Tab */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                  <button
                    onClick={() => setActiveTab("profile")}
                    className="text-amber-600 hover:text-amber-700"
                  >
                    <Edit3 size={20} />
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                    <AlertCircle size={20} className="text-red-600" />
                    <span className="text-red-800">{error}</span>
                  </div>
                )}

                {success && (
                  <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                    <CheckCircle size={20} className="text-green-600" />
                    <span className="text-green-800">{success}</span>
                  </div>
                )}

                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                        disabled
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-black font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {saving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={20} />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Booking History Tab */}
            {activeTab === "history" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Booking History</h2>
                
                {historyLoading ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading booking history...</p>
                  </div>
                ) : bookingHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <History size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet</h3>
                    <p className="text-gray-600 mb-6">When you book services, they will appear here</p>
                    <button
                      onClick={() => navigate("/user/book-request")}
                      className="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-black font-semibold rounded-lg transition-colors"
                    >
                      Book a Service
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookingHistory.map((booking) => (
                      <div key={booking._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{booking.category}</h3>
                            <p className="text-sm text-gray-600 mt-1">{booking.description}</p>
                            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {formatDate(booking.createdAt)}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin size={14} />
                                {booking.address?.city}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                            <button
                              onClick={() => navigate(`/user/bookings/${booking._id}`)}
                              className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
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
