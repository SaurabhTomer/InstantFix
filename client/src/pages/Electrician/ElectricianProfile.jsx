import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "../../api/axios.js";
import { setUser } from "../../store/authSlice.js";
import { Camera, Save, Edit2, MapPin, Phone, Mail, Briefcase, Star, Award, CheckCircle } from "lucide-react";

export default function ElectricianProfile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    hourlyRate: "",
    bio: ""
  });
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await api.get('/api/electrician/profile');
      console.log("Electrician profile data:", response.data);
      
      if (response.data.success) {
        const electricianData = response.data.electrician;
        setProfileData({
          name: electricianData.name || "",
          email: electricianData.email || "",
          phone: electricianData.phone || "",
          experience: electricianData.experience || "",
          hourlyRate: electricianData.hourlyRate || "",
          bio: electricianData.bio || ""
        });
        setImagePreview(electricianData.avatar || "");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError(error.response?.data?.message || "Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.put('/api/electrician/profile', profileData);
      
      if (response.data.success) {
        setSuccess("Profile updated successfully!");
        // Update the user state with the new profile data
        const updatedElectrician = response.data.electrician;
        dispatch(setUser({
          ...user,
          name: updatedElectrician.name,
          phone: updatedElectrician.phone,
          avatar: updatedElectrician.avatar
        }));
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      const formData = new FormData();
      formData.append('avatar', file);

      try {
        setSaving(true);
        const response = await api.put('/api/electrician/profile', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        if (response.data.success) {
          setImagePreview(response.data.electrician.avatar || URL.createObjectURL(file));
          setSuccess("Profile image updated successfully!");
          // Update the user state with the new avatar
          dispatch(setUser({
            ...user,
            avatar: response.data.electrician.avatar
          }));
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        setError(error.response?.data?.message || "Failed to upload profile image");
      } finally {
        setSaving(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {isEditing ? <CheckCircle size={18} /> : <Edit2 size={18} />}
              {isEditing ? "Done" : "Edit"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-600">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Image & Basic Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              {/* Profile Image */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl font-bold text-blue-500">
                        {profileData.name?.charAt(0)?.toUpperCase() || 'E'}
                      </span>
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
                      <Camera size={18} className="text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <h2 className="text-xl font-bold text-gray-900 mt-4">{profileData.name}</h2>
                <p className="text-sm text-gray-500">Electrician</p>
              </div>

              {/* Role Badge */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3">
                  <Briefcase size={20} className="text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Role</p>
                    <p className="text-lg font-bold text-blue-600">Electrician</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Experience</span>
                  <span className="text-sm font-medium">{profileData.experience ? `${profileData.experience} years` : 'Not specified'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Hourly Rate</span>
                  <span className="text-sm font-medium">{profileData.hourlyRate ? `₹${profileData.hourlyRate}/hr` : 'Not specified'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Professional Information</h3>
              
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                  <input
                    type="text"
                    value={profileData.experience}
                    onChange={(e) => setProfileData({...profileData, experience: e.target.value})}
                    disabled={!isEditing}
                    placeholder="e.g., 5 years"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                {/* Hourly Rate */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate (₹)</label>
                  <input
                    type="number"
                    value={profileData.hourlyRate}
                    onChange={(e) => setProfileData({...profileData, hourlyRate: e.target.value})}
                    disabled={!isEditing}
                    placeholder="e.g., 500"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    disabled={!isEditing}
                    rows={4}
                    placeholder="Tell us about yourself and your expertise..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                {/* Save Button */}
                {isEditing && (
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
