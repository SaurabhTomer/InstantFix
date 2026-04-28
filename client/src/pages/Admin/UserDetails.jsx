import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Phone, Calendar, FileText, AlertCircle } from "lucide-react";
import api from "../../api/axios.js";

export default function UserDetails() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [userRes, reqRes] = await Promise.all([
        api.get(`/api/admin/users/${userId}`),
        api.get(`/api/admin/requests?customer=${userId}&limit=20`),
      ]);
      if (userRes.data.success) setUser(userRes.data.user);
      if (reqRes.data.success) setRequests(reqRes.data.requests || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load user details");
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    pending:   "bg-amber-100 text-amber-700",
    accepted:  "bg-blue-100 text-blue-700",
    started:   "bg-purple-100 text-purple-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <AlertCircle size={40} className="text-red-400" />
        <p className="text-gray-600">{error}</p>
        <button onClick={() => navigate("/admin/users")} className="px-4 py-2 bg-purple-500 text-white rounded-lg">
          Back to Users
        </button>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => navigate("/admin/users")}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Users
      </button>

      {/* User Info Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
            {user.avatar
              ? <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-full object-cover" />
              : <User size={28} className="text-purple-600" />
            }
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <span className="text-sm text-gray-500 capitalize">{user.role}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Mail size={16} className="text-gray-400" />
            {user.email || "—"}
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Phone size={16} className="text-gray-400" />
            {user.phone || "—"}
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Calendar size={16} className="text-gray-400" />
            Joined: {new Date(user.createdAt).toLocaleDateString("en-IN")}
          </div>
        </div>
      </div>

      {/* Requests */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText size={18} className="text-gray-400" />
          Service Requests ({requests.length})
        </h3>

        {requests.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-6">No requests found for this user</p>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => (
              <div key={req._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{req.category}</p>
                  <p className="text-xs text-gray-500">{new Date(req.createdAt).toLocaleDateString("en-IN")}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[req.status] || "bg-gray-100 text-gray-600"}`}>
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
