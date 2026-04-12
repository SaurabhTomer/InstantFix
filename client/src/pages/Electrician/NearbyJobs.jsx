import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin, Search, Clock, Calendar,
  AlertCircle, CheckCircle, Navigation,
  RefreshCw, Users, Phone, ArrowRight
} from "lucide-react";
import api from "../../api/axios.js";

export default function NearbyJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [selectedRadius, setSelectedRadius] = useState(5);
  const [userLocation, setUserLocation] = useState(null);
  const [acceptingId, setAcceptingId] = useState(null);

  const radiusOptions = [
    { value: 1, label: "1 km" }, { value: 3, label: "3 km" },
    { value: 5, label: "5 km" }, { value: 10, label: "10 km" },
    { value: 15, label: "15 km" }, { value: 25, label: "25 km" },
  ];

  const urgencyConfig = {
    emergency: { color: "bg-red-50 text-red-700 border-red-200",       label: "Emergency" },
    urgent:    { color: "bg-orange-50 text-orange-700 border-orange-200", label: "Urgent" },
    normal:    { color: "bg-gray-50 text-gray-600 border-gray-200",     label: "Normal" },
  };

  useEffect(() => { getUserLocation(); }, []);
  useEffect(() => { if (userLocation) fetchNearbyJobs(); }, [userLocation, selectedRadius]);

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setUserLocation({ lat: 28.6139, lng: 77.2090 });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setUserLocation({ lat: 28.6139, lng: 77.2090 })
    );
  };

  const fetchNearbyJobs = async () => {
    if (!userLocation) return;
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        lat: userLocation.lat, lng: userLocation.lng, radius: selectedRadius
      });
      const res = await api.get(`/api/electrician/jobs/nearby?${params}`);
      if (res.data.success) setJobs(res.data.jobs || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch nearby jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptJob = async (jobId) => {
    setAcceptingId(jobId);
    setError("");
    try {
      const res = await api.put(`/api/electrician/jobs/${jobId}/accept`);
      if (res.data.success) {
        setJobs(prev => prev.filter(j => j._id !== jobId));
        setSuccessMsg("Job accepted! Check My Bookings.");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to accept job");
    } finally {
      setAcceptingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5">

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Nearby Jobs</h1>
            <p className="text-sm text-gray-400 mt-0.5">Find service requests in your area</p>
          </div>
          <button
            onClick={fetchNearbyJobs}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <MapPin size={14} className="text-blue-500" />
              <span className="text-xs font-medium text-gray-600">Your Location</span>
            </div>
            <p className="text-xs text-gray-500">
              {userLocation ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}` : "Detecting..."}
            </p>
            <button onClick={getUserLocation} className="mt-1.5 text-xs text-blue-500 flex items-center gap-1 hover:underline">
              <Navigation size={11} /> Update
            </button>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Search Radius</label>
            <select
              value={selectedRadius}
              onChange={(e) => setSelectedRadius(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {radiusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">{error}</div>}
      {successMsg && <div className="px-4 py-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">{successMsg}</div>}

      {/* Jobs */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 text-center py-16">
          <Search size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No jobs found nearby</p>
          <p className="text-xs text-gray-300 mt-1">Try expanding your search radius</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => {
            const urgency = urgencyConfig[job.urgency] || urgencyConfig.normal;
            const distance = job.distanceKm || 0;
            const isAccepting = acceptingId === job._id;

            return (
              <div key={job._id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900">{job.category || 'Electrical Service'}</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${urgency.color}`}>
                        <AlertCircle size={10} />
                        {urgency.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">{job.description || '—'}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={13} className="text-gray-300" />
                        <span>{distance.toFixed(1)} km away</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-gray-300" />
                        <span>{new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users size={13} className="text-gray-300" />
                        <span>{job.customer?.name || 'Customer'}</span>
                      </div>
                      {job.customer?.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone size={13} className="text-gray-300" />
                          <span>{job.customer.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => handleAcceptJob(job._id)}
                      disabled={isAccepting}
                      className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {isAccepting
                        ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        : <><CheckCircle size={14} /> Accept</>
                      }
                    </button>
                    <button
                      onClick={() => navigate(`/electrician/job-details/${job._id}`)}
                      className="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                    >
                      <ArrowRight size={14} /> Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}