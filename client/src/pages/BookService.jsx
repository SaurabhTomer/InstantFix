import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const serverUrl = "http://localhost:3000/api";

function BookService() {
  const navigate = useNavigate();
  
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  
  const [formData, setFormData] = useState({
    issueType: "",
    description: "",
    addressId: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: ""
    },
    saveAddress: false,
    useSavedAddress: true
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const issueTypes = ["Fan", "Light", "Switch", "Wiring", "Other"];

  useEffect(() => {
    const fetchAddresses = async () => {
      setLoadingAddresses(true);
      setError("");
      
      try {
        const res = await axios.get(`${serverUrl}/user/address/addresses`, {
          withCredentials: true,
        });
        const list = res.data?.addresses || [];
        setAddresses(list);

        const defaultAddress = list.find((a) => a.isDefault);
        const firstAddress = list[0];
        const selected = defaultAddress?._id || firstAddress?._id || "";

        setFormData((prev) => ({
          ...prev,
          addressId: selected,
          useSavedAddress: list.length > 0,
        }));
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load saved addresses");
      } finally {
        setLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 2) {
      setError("Maximum 2 images allowed");
      return;
    }
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const submitData = new FormData();
      submitData.append("issueType", formData.issueType);
      submitData.append("description", formData.description);

      if (formData.useSavedAddress) {
        if (!formData.addressId) {
          throw new Error("Please select a saved address");
        }
        submitData.append("addressId", formData.addressId);
      } else {
        submitData.append("street", formData.address.street);
        submitData.append("city", formData.address.city);
        submitData.append("state", formData.address.state);
        submitData.append("pincode", formData.address.pincode);
        submitData.append("saveAddress", formData.saveAddress.toString());
      }

      for (let i = 0; i < images.length; i++) {
        submitData.append("images", images[i]);
      }

      const response = await axios.post(
        `${serverUrl}/service/create`,
        submitData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setSuccess("Service request created successfully!");
      setTimeout(() => {
        navigate("/dashboard/user");
      }, 1500);

    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to create service request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Book a Service</h1>
          <p className="text-gray-600">Fill in the details to request electrical service</p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-6">
          {/* Issue Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issue Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.issueType}
              onChange={(e) => handleInputChange("issueType", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select issue type</option>
              {issueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your electrical issue in detail..."
              required
            />
          </div>

          {/* Address Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Service Address</h3>
            
            {/* Address Type Toggle */}
            <div className="flex gap-4 mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={formData.useSavedAddress}
                  onChange={() => handleInputChange("useSavedAddress", true)}
                  className="mr-2"
                />
                <span className="text-gray-700">Use saved address</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={!formData.useSavedAddress}
                  onChange={() => handleInputChange("useSavedAddress", false)}
                  className="mr-2"
                />
                <span className="text-gray-700">Enter new address</span>
              </label>
            </div>

            {formData.useSavedAddress ? (
              <div>
                <select
                  value={formData.addressId}
                  onChange={(e) => handleInputChange("addressId", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loadingAddresses}
                >
                  <option value="">{loadingAddresses ? "Loading addresses..." : "Select saved address"}</option>
                  {addresses.map((addr) => (
                    <option key={addr._id} value={addr._id}>
                      {addr.street}, {addr.city}, {addr.state} {addr.pincode}{addr.isDefault ? " (Default)" : ""}
                    </option>
                  ))}
                </select>
                {addresses.length === 0 && !loadingAddresses && (
                  <p className="text-sm text-gray-500 mt-2">
                    No saved address found. Please choose "Enter new address".
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.address.street}
                    onChange={(e) => handleAddressChange("street", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="123 Main Street"
                    required={!formData.useSavedAddress}
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.address.city}
                      onChange={(e) => handleAddressChange("city", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="New York"
                      required={!formData.useSavedAddress}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.address.state}
                      onChange={(e) => handleAddressChange("state", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="NY"
                      required={!formData.useSavedAddress}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.address.pincode}
                    onChange={(e) => handleAddressChange("pincode", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="12345"
                    required={!formData.useSavedAddress}
                  />
                </div>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.saveAddress}
                    onChange={(e) => handleInputChange("saveAddress", e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-gray-700">Save this address for future use</span>
                </label>
              </div>
            )}
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Images (Optional - Max 2)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Upload images of the electrical issue for better understanding
            </p>
            
            {images.length > 0 && (
              <div className="mt-2 flex gap-2">
                {images.map((image, index) => (
                  <div key={index} className="text-sm text-gray-600">
                    {image.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? "Creating Request..." : "Book Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookService;
