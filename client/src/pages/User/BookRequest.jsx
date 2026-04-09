import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import { ArrowLeft, Calendar, Clock, MapPin, Home, User, Phone, Mail, FileText, Camera, Upload, X, Navigation } from "lucide-react";
import { useGPSCoordinates, useAddressCoordinates } from "../../hooks/useCoordinates.js";

export default function BookRequest() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [countdown, setCountdown] = useState(4);
  
  // Custom hooks for coordinate operations
  const { getGPSLocation, loading: gpsLoading } = useGPSCoordinates();
  const { getCoordinatesFromAddress, loading: addressLoading } = useAddressCoordinates();
  
  const [formData, setFormData] = useState({
    issueDescription: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: ""
    },
    coordinates: { lat: null, lng: null }
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [locationMethod, setLocationMethod] = useState("manual"); // "manual" or "gps"

  // Countdown effect for success popup
  useEffect(() => {
    let timer;
    if (showSuccess && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (showSuccess && countdown === 0) {
      navigate("/user/bookings");
    }
    
    return () => clearTimeout(timer);
  }, [showSuccess, countdown, navigate]);

  const categories = [
    { id: 1, name: "Home Wiring", description: "Complete electrical wiring solutions", icon: "⚡" },
    { id: 2, name: "LED Installation", description: "Energy-efficient LED lighting setup", icon: "💡" },
    { id: 3, name: "AC Repair", description: "Air conditioner electrical repair", icon: "❄️" },
    { id: 4, name: "Switchboard", description: "Switchboard installation & repair", icon: "🔘" },
    { id: 5, name: "Safety Inspection", description: "Electrical safety inspection", icon: "🛡️" },
    { id: 6, name: "Panel Upgrade", description: "Electrical panel upgrade", icon: "⚙️" }
  ];

  // Handle GPS location
  const handleGPSLocation = async () => {
    try {
      const result = await getGPSLocation();
      setFormData(prev => ({
        ...prev,
        address: result.address,
        coordinates: result.coordinates
      }));
      setLocationMethod("gps");
    } catch (error) {
      alert(error.message);
    }
  };

  // Handle other input changes (non-address)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (!name.includes('address.')) {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle address change and auto-fetch coordinates
  const handleAddressChange = async (e) => {
    const { name, value } = e.target;
    
    if (name.includes('address.')) {
      const addressField = name.split('.')[1];
      const newAddress = {
        ...formData.address,
        [addressField]: value
      };
      
      setFormData(prev => ({
        ...prev,
        address: newAddress
      }));

      // Auto-fetch coordinates when address is complete
      if (newAddress.street && 
          newAddress.city && 
          newAddress.state && 
          newAddress.pincode && 
          newAddress.pincode.length === 6) {
        
        // Clear previous coordinates and fetch new ones
        setFormData(prev => ({
          ...prev,
          address: newAddress,
          coordinates: { lat: null, lng: null }
        }));
        
        try {
          const coordinates = await getCoordinatesFromAddress(newAddress);
          setFormData(prev => ({
            ...prev,
            coordinates
          }));
        } catch (error) {
          console.error("Auto-fetch coordinates failed:", error);
        }
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));
    setUploadedImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setUploadedImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.coordinates.lat || !formData.coordinates.lng) {
    alert("Please get location coordinates before submitting.");
    return;
  }

  try {
    setLoading(true);

    // ✅ Send as FormData because multer middleware is on this route
    const fd = new FormData();
    fd.append("category", selectedCategory);
    fd.append("description", formData.issueDescription);  // ✅ was issueDescription
    fd.append("address", JSON.stringify({                  // ✅ stringify for multer
      street: formData.address.street,
      city: formData.address.city,
      state: formData.address.state,
      pincode: formData.address.pincode
    }));
    fd.append("location", JSON.stringify({                 // ✅ was "coordinates"
      type: "Point",
      coordinates: [formData.coordinates.lng, formData.coordinates.lat]
    }));

    // ✅ Append images directly into same FormData (no separate request needed)
    uploadedImages.forEach((image) => {
      fd.append("photos", image.file);                     // ✅ matches upload.array('photos')
    });

    // Debug FormData contents
    console.log("=== FORM DATA DEBUG ===");
    console.log("Category:", selectedCategory);
    console.log("Description:", formData.issueDescription);
    console.log("Address:", JSON.stringify({
      street: formData.address.street,
      city: formData.address.city,
      state: formData.address.state,
      pincode: formData.address.pincode
    }));
    console.log("Location:", JSON.stringify({
      type: "Point",
      coordinates: [formData.coordinates.lng, formData.coordinates.lat]
    }));
    console.log("Images count:", uploadedImages.length);
    console.log("Auth token:", localStorage.getItem('accessToken') ? "Present" : "Missing");
    console.log("======================");

    const response = await api.post('/api/requests', fd);

    console.log("Backend response:", response.data);

    setShowSuccess(true);
    setCountdown(4); // Start countdown from 4

  } catch (error) {
    console.error("=== SUBMISSION ERROR ===");
    console.error("Full error:", error);
    console.error("Error message:", error.message);
    console.error("Error response:", error.response);
    console.error("Error status:", error.response?.status);
    console.error("Error data:", error.response?.data);
    console.error("Error config:", error.config);
    console.error("========================");
    
    // Show more detailed error message
    let errorMessage = "Failed to submit request. Please try again.";
    
    if (error.response?.data?.message) {
      errorMessage = `Error: ${error.response.data.message}`;
    } else if (error.response?.data?.error) {
      errorMessage = `Error: ${error.response.data.error}`;
    } else if (error.response?.status === 401) {
      errorMessage = "You are not authenticated. Please login again.";
    } else if (error.response?.status === 400) {
      errorMessage = `Invalid data: ${error.response.data?.message || "Check your form inputs."}`;
    } else if (error.response?.status === 404) {
      errorMessage = "API endpoint not found. Check server configuration.";
    } else if (error.response?.status === 500) {
      errorMessage = "Server error. Please try again later.";
    } else if (error.code === "NETWORK_ERROR" || !error.response) {
      errorMessage = "Network error. Please check your internet connection and ensure the server is running.";
    }
    
    alert(errorMessage);
  } finally {
    setLoading(false);
  }
};

  const nextStep = () => {
    if (currentStep === 1 && !selectedCategory) {
      alert("Please select a category");
      return;
    }
    if (currentStep === 2 && !formData.issueDescription) {
      alert("Please describe the issue");
      return;
    }
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                step <= currentStep 
                  ? 'bg-amber-400 text-black' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {step < currentStep ? '✓' : step}
              </div>
              {step < 4 && (
                <div className={`w-16 h-1 mx-2 transition-colors ${
                  step < currentStep ? 'bg-amber-400' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Book a Service</h1>
            <p className="text-gray-600">
              {currentStep === 1 && "Select the category that best describes your issue"}
              {currentStep === 2 && "Describe your electrical issue in detail"}
              {currentStep === 3 && "Upload images of the issue (optional)"}
              {currentStep === 4 && "Provide your service location"}
            </p>
          </div>

          <div className="p-6">
            {/* Step 1: Category Selection */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setSelectedCategory(category.name)}
                      className={`
                        p-4 rounded-xl border-2 transition-all duration-200 text-left
                        ${selectedCategory === category.name
                          ? 'border-amber-400 bg-amber-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                        }
                      `}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-2xl">{category.icon}</span>
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          selectedCategory === category.name
                            ? 'border-amber-400 bg-amber-400'
                            : 'border-gray-300'
                        }`}>
                          {selectedCategory === category.name && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm">{category.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">{category.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Issue Description */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <FileText size={16} />
                    Describe Your Issue
                  </label>
                  <textarea
                    name="issueDescription"
                    value={formData.issueDescription}
                    onChange={handleInputChange}
                    rows={6}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-colors resize-none"
                    placeholder="Please describe the electrical issue you're facing in detail. Include when it started, how often it occurs, and any troubleshooting you've already tried..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.issueDescription.length}/500 characters
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Image Upload */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Camera size={16} />
                    Upload Images (Optional)
                  </label>
                  <p className="text-sm text-gray-600 mb-4">
                    Upload photos of the issue to help electricians better understand the problem
                  </p>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-amber-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Click to upload images</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB each</p>
                    </label>
                  </div>

                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image.preview}
                            alt={image.name}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                          <p className="text-xs text-gray-500 mt-1 truncate">{image.name}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Location Only */}
            {currentStep === 4 && (
              <div className="space-y-6">
                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin size={16} />
                    Service Location
                  </label>
                  
                  <div className="flex gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setLocationMethod("manual")}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                        locationMethod === "manual"
                          ? "bg-amber-400 text-black"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Enter Address
                    </button>
                    <button
                      type="button"
                      onClick={handleGPSLocation}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                        locationMethod === "gps"
                          ? "bg-amber-400 text-black"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <Navigation size={16} />
                      {gpsLoading ? "Getting location..." : "Use GPS"}
                    </button>
                  </div>

                  {/* Address Fields */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                      <input
                        type="text"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleAddressChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-colors"
                        placeholder="123 Main Street, Apartment 4B"
                      />
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                          type="text"
                          name="address.city"
                          value={formData.address.city}
                          onChange={handleAddressChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-colors"
                          placeholder="New Delhi"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                        <input
                          type="text"
                          name="address.state"
                          value={formData.address.state}
                          onChange={handleAddressChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-colors"
                          placeholder="Delhi"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                      <input
                        type="text"
                        name="address.pincode"
                        value={formData.address.pincode}
                        onChange={handleAddressChange}
                        required
                        maxLength={6}
                        pattern="[0-9]{6}"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-colors"
                        placeholder="110001"
                      />
                    </div>
                  </div>
                  
                  {/* Fetching coordinates status */}
                  {addressLoading && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-amber-600">
                      <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>Fetching coordinates...</span>
                    </div>
                  )}
                  
                  {formData.coordinates.lat && formData.coordinates.lng && (
                    <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                      <MapPin size={12} />
                      Location coordinates saved ({formData.coordinates.lat.toFixed(6)}, {formData.coordinates.lng.toFixed(6)})
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
              )}
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 px-6 py-3 bg-amber-400 hover:bg-amber-500 text-black font-semibold rounded-xl transition-colors"
                >
                  Next
                </button>
              ) : (
                <form onSubmit={handleSubmit} className="flex-1">
                  <button
                    type="submit"
                    disabled={loading || gpsLoading || addressLoading || !formData.coordinates.lat || !formData.coordinates.lng}
                    className="w-full px-6 py-3 bg-amber-400 hover:bg-amber-500 text-black font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </>
                    ) : gpsLoading || addressLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        Getting location...
                      </>
                    ) : !formData.coordinates.lat || !formData.coordinates.lng ? (
                      "Enter complete address to enable submit"
                    ) : (
                      "Submit Request"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h2>
            <p className="text-gray-600 mb-4">
              Your service request has been successfully submitted. An electrician will contact you soon.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-amber-600">
              <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Redirecting to your bookings in {countdown} seconds...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
