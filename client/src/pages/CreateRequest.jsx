import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTools, FaLightbulb, FaFan, FaBolt, FaPlug, FaCamera, FaMapMarkerAlt, FaPlus, FaMinus, FaTrash, FaFileImage } from "react-icons/fa";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import { updateRequestCount } from "../redux/userSlice";
import { ClipLoader } from "react-spinners";

function CreateServiceRequest() {

    const { latitude, longitude } = useSelector(
        (state) => state.user.location
    );

    const { currentCity, currentState, currentAddress , currentPincode } = useSelector(
        (state) => state.user
    );

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

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
        { label: "Fan not working", value: "Fan" },
        { label: "Switch board issue", value: "Switch" },
        { label: "Wiring problem", value: "Wiring" },
        { label: "Short circuit", value: "Wiring" },
        { label: "MCB trip", value: "Other" },
        { label: "Other", value: "Other" }
    ];

    // Auto-fill address fields when location data is available
    useEffect(() => {
        if (currentAddress) {
            setStreet(currentAddress);
        }
        if (currentCity) {
            setCity(currentCity);
        }
        if (currentState) {
            setStateName(currentState);
        }
         if (currentPincode) {
            setPincode(currentPincode);
        }
    }, [currentAddress, currentCity, currentState,currentPincode]);

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

            //  Redux se aaye lat/long
            formData.append("latitude", latitude);
            formData.append("longitude", longitude);

            formData.append("saveAddress", saveAddress);

            images.forEach((img) => {
                formData.append("images", img);
            });

            await axios.post(
                `${serverUrl}/api/service/create`,
                formData,
                { withCredentials: true }
            );

            // Increment pending count in Redux
            dispatch(updateRequestCount({ status: 'pending', increment: 1 }));

            toast.success("Service request created ");
            navigate("/user");

        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to create request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-yellow-50 via-amber-50 to-blue-50 relative overflow-hidden">
            {/* Background decoration */}
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fbbf24' fill-opacity='0.05'%3E%3Cpath d='M30 30l15-15v30L30 30zm0 0L15 45V15l15 15z'/%3E%3C/g%3E%3C/svg%3E")`
              }}
            ></div>

            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-2xl p-8 border border-yellow-200/50 relative z-10">
              
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
                        <FaTools className="w-8 h-8 text-white" />
                    </div>
                
                    <div className="relative inline-block">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Create Service Request
                        </h2>
                        <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full"></div>
                    </div>
             
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Issue Type */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                            <FaBolt className="w-4 h-4 text-yellow-500" />
                            Issue Type
                        </label>
                        <select
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                            value={issueType}
                            onChange={(e) => setIssueType(e.target.value)}
                        >
                            <option value="">Select Issue Type</option>
                            {issueTypes.map((issue, index) => (
                                <option key={index} value={issue.value}>{issue.label}</option>
                            ))}
                        </select>
                    </div>


                    {/* Description */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                            <FaTools className="w-4 h-4 text-blue-500" />
                            Issue Description
                        </label>
                        <textarea
                            placeholder="Describe your electrical issue in detail..."
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
                            rows="4"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {/* Address Section */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <FaMapMarkerAlt className="w-4 h-4 text-red-500" />
                            Service Address
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <input
                                    type="text"
                                    placeholder="Street Address"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 bg-white"
                                    value={street}
                                    onChange={(e) => setStreet(e.target.value)}
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="City"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 bg-white"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="State"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 bg-white"
                                    value={stateName}
                                    onChange={(e) => setStateName(e.target.value)}
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Pincode"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 bg-white"
                                    value={pincode}
                                    onChange={(e) => setPincode(e.target.value)}
                                />
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-4">
                            <input
                                type="checkbox"
                                id="saveAddress"
                                checked={saveAddress}
                                onChange={(e) => setSaveAddress(e.target.checked)}
                                className="w-4 h-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-400"
                            />
                            <label htmlFor="saveAddress" className="text-sm text-gray-600 cursor-pointer">
                                Save this address for future requests
                            </label>
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                            <FaCamera className="w-4 h-4 text-blue-500" />
                            Upload Images (Optional)
                        </label>
                        <div className="relative">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
                                onChange={handleImages}
                            />
                        </div>

                        {previewImages.length > 0 && (
                            <div className="mt-4">
                                <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                                    <FaFileImage className="w-4 h-4" />
                                    Preview Images
                                </p>
                                <div className="grid grid-cols-3 gap-3">
                                    {previewImages.map((img, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={img}
                                                alt={`Preview ${index + 1}`}
                                                className="h-24 w-full object-cover rounded-xl border border-gray-200 group-hover:shadow-lg transition-shadow"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-xl transition-all"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        className="w-full font-bold py-4 rounded-xl transition-all duration-200 bg-gradient-to-r from-yellow-400 to-amber-500 text-white hover:from-yellow-500 hover:to-amber-600 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none"
                        disabled={loading}
                    >
                        {loading ? <ClipLoader size={20} color="white" /> : "Submit Service Request"}
                    </button>
                </form>
            </div>

            {/* Back Button */}
            <button
                className="absolute top-6 left-6 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform border border-yellow-200/50"
                onClick={() => navigate(-1)}
            >
                <IoIosArrowRoundBack size={24} className="text-yellow-600" />
            </button>
        </div>
    );
}

export default CreateServiceRequest;