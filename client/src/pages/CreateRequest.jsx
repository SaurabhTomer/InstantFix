import React, { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

function CreateServiceRequest() {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");

  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");

  const [saveAddress, setSaveAddress] = useState(false);

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const issueTypes = [
    "Fan not working",
    "Switch board issue",
    "Wiring problem",
    "Short circuit",
    "MCB trip",
    "Other"
  ];

  // Handle Multiple Images
  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  //handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!issueType || !description) {
      return toast.warning("Issue type and description required");
    }

    if (!street || !city || !stateName || !pincode) {
      return toast.warning("Complete address required");
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("issueType", issueType);
      formData.append("description", description);

      formData.append("street", street);
      formData.append("city", city);
      formData.append("state", stateName);
      formData.append("pincode", pincode);

      formData.append("saveAddress", saveAddress);

      images.forEach((img) => {
        formData.append("images", img);
      });

      await axios.post(
        `${serverUrl}/api/service/create`,
        formData,
        { withCredentials: true }
      );

      toast.success("Service request created 🚀");
      navigate("/");

    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-50 p-6 relative">

      <IoIosArrowRoundBack
        size={35}
        className="absolute top-5 left-5 text-blue-600 cursor-pointer hover:text-yellow-500"
        onClick={() => navigate(-1)}
      />

      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl border border-blue-200">

        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">
          Create Service Request
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          <select
            className="w-full border border-blue-200 px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-400"
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
          >
            <option value="">Select Issue Type</option>
            {issueTypes.map((issue, index) => (
              <option key={index} value={issue}>{issue}</option>
            ))}
          </select>

          <textarea
            placeholder="Describe your issue"
            className="w-full border border-blue-200 px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-400"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="text"
            placeholder="Street"
            className="w-full border border-blue-200 px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-400"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />

          <input
            type="text"
            placeholder="City"
            className="w-full border border-blue-200 px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-400"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <input
            type="text"
            placeholder="State"
            className="w-full border border-blue-200 px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-400"
            value={stateName}
            onChange={(e) => setStateName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Pincode"
            className="w-full border border-blue-200 px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-400"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={saveAddress}
              onChange={(e) => setSaveAddress(e.target.checked)}
            />
            <span className="text-sm text-gray-600">Save this address</span>
          </div>

          <input
            type="file"
            multiple
            accept="image/*"
            className="w-full border border-blue-200 px-4 py-2 rounded-lg"
            onChange={handleImages}
          />

          {previewImages.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {previewImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt=""
                  className="h-24 w-full object-cover rounded-lg"
                />
              ))}
            </div>
          )}

          <button
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="white" /> : "Submit Request"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default CreateServiceRequest;