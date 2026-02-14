import { useEffect, useState } from "react";
import { Routes, Route, Link, useParams } from "react-router-dom";
import ElectricianNavbar from "../ElectricianNavbar";
import ElectricianProfile from "../ElectricianProfile";
import axios from "axios";
import { useFetchUser } from "../../hooks/useFetchUser";
import { useSelector } from "react-redux";

const serverUrl = "http://localhost:3000/api";

function ElectricianDashboard() {
  const { loading: meLoading, error: meError } = useFetchUser();
  const me = useSelector((state) => state.user.userData);

  const quickActions = [
    { title: "Available Jobs", desc: "Find nearby pending requests", icon: "📋", link: "/dashboard/electrician/jobs" },
    { title: "Assigned Jobs", desc: "Accepted or in-progress", icon: "🧾", link: "/dashboard/electrician/assigned" },
    { title: "Completed", desc: "View completed requests", icon: "✅", link: "/dashboard/electrician/completed" },
    { title: "Set Availability", desc: "Go online/offline", icon: "🟢", link: "/dashboard/electrician/settings" }
  ];

  const StatCard = ({ stat }) => (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <span className="text-3xl">{stat.icon}</span>
        <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg opacity-20`}></div>
      </div>
      <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
      <p className="text-gray-600 text-sm">{stat.label}</p>
    </div>
  );

  const ActionCard = ({ action }) => (
    <Link to={action.link} className="group">
      <div className="p-6 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all">
        <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{action.icon}</div>
        <h3 className="font-semibold text-gray-800 mb-1">{action.title}</h3>
        <p className="text-sm text-gray-600">{action.desc}</p>
      </div>
    </Link>
  );

  const RequestItem = ({ request, showDistance }) => (
    <Link
      to={`/dashboard/electrician/requests/${request._id}`}
      className="block border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-800">{request.issueType}</h3>
          <p className="text-sm text-gray-600">{request.description}</p>
          <p className="text-sm text-gray-600">
            📍 {request.address?.street}, {request.address?.city}, {request.address?.state} - {request.address?.pincode}
          </p>
          {showDistance && typeof request.distance === "number" && (
            <p className="text-sm text-gray-600">Distance: {(request.distance / 1000).toFixed(1)} km</p>
          )}
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${
          request.status === "completed" ? "bg-green-100 text-green-800" :
          request.status === "in-progress" ? "bg-yellow-100 text-yellow-800" :
          request.status === "accepted" ? "bg-blue-100 text-blue-800" :
          "bg-gray-100 text-gray-800"
        }`}>
          {request.status}
        </span>
      </div>
    </Link>
  );

  const DashboardOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-500 text-white rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {me?.name || "Electrician"}! 👨‍🔧</h1>
        <p className="text-green-100">Manage your jobs and availability</p>
      </div>

      {meLoading && <div className="text-gray-600">Loading...</div>}
      {meError && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {meError}
        </div>
      )}

      <StatsGrid />

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <ActionCard key={index} action={action} />
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Nearby Requests</h2>
            <Link to="/dashboard/electrician/jobs" className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All</Link>
          </div>
          <NearbyPreview />
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Assigned Requests</h2>
            <Link to="/dashboard/electrician/assigned" className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All</Link>
          </div>
          <AssignedPreview />
        </div>
      </div>
    </div>
  );

  const StatsGrid = () => {
    const [counts, setCounts] = useState({ nearby: 0, assigned: 0, completed: 0, available: "-" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
      const fetchCounts = async () => {
        setLoading(true);
        setError("");
        try {
          const [nearbyRes, assignedRes, completedRes] = await Promise.all([
            axios.get(`${serverUrl}/electrician/nearby-requests?limit=1&page=1`, { withCredentials: true }),
            axios.get(`${serverUrl}/electrician/assigned-requests?limit=1&page=1`, { withCredentials: true }),
            axios.get(`${serverUrl}/electrician/completed-requests?limit=1&page=1`, { withCredentials: true }),
          ]);

          setCounts({
            nearby: nearbyRes.data?.count || nearbyRes.data?.data?.length || 0,
            assigned: assignedRes.data?.total || assignedRes.data?.requests?.length || 0,
            completed: completedRes.data?.total || completedRes.data?.requests?.length || 0,
            available: me?.isAvailable ? "Online" : "Offline",
          });
        } catch (err) {
          setError(err?.response?.data?.message || "Failed to load stats");
        } finally {
          setLoading(false);
        }
      };

      fetchCounts();
    }, []);

    const stats = [
      { label: "Nearby", value: String(counts.nearby), icon: "📍", color: "from-blue-500 to-blue-600" },
      { label: "Assigned", value: String(counts.assigned), icon: "🧾", color: "from-green-500 to-green-600" },
      { label: "Completed", value: String(counts.completed), icon: "✅", color: "from-purple-500 to-purple-600" },
      { label: "Availability", value: String(counts.available), icon: "🟢", color: "from-yellow-500 to-yellow-600" },
    ];

    if (loading) return <div className="text-gray-600">Loading...</div>;
    if (error) return <div className="text-red-600">{error}</div>;

    return (
      <div className="grid md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>
    );
  };

  const NearbyPreview = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
      const fetchList = async () => {
        setLoading(true);
        setError("");
        try {
          const res = await axios.get(`${serverUrl}/electrician/nearby-requests?limit=3&page=1`, { withCredentials: true });
          setList(res.data?.data || []);
        } catch (err) {
          setError(err?.response?.data?.message || "Failed to load nearby requests");
        } finally {
          setLoading(false);
        }
      };
      fetchList();
    }, []);

    if (loading) return <div className="text-sm text-gray-600">Loading...</div>;
    if (error) return <div className="text-sm text-red-600">{error}</div>;
    if (list.length === 0) return <div className="text-sm text-gray-600">No nearby requests.</div>;

    return (
      <div className="space-y-3">
        {list.map((r) => (
          <RequestItem key={r._id} request={r} showDistance={true} />
        ))}
      </div>
    );
  };

  const AssignedPreview = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
      const fetchList = async () => {
        setLoading(true);
        setError("");
        try {
          const res = await axios.get(`${serverUrl}/electrician/assigned-requests?limit=3&page=1`, { withCredentials: true });
          setList(res.data?.requests || []);
        } catch (err) {
          setError(err?.response?.data?.message || "Failed to load assigned requests");
        } finally {
          setLoading(false);
        }
      };
      fetchList();
    }, []);

    if (loading) return <div className="text-sm text-gray-600">Loading...</div>;
    if (error) return <div className="text-sm text-red-600">{error}</div>;
    if (list.length === 0) return <div className="text-sm text-gray-600">No assigned requests.</div>;

    return (
      <div className="space-y-3">
        {list.map((r) => (
          <RequestItem key={r._id} request={r} />
        ))}
      </div>
    );
  };

  const NearbyJobsPage = () => {
    const [page, setPage] = useState(1);
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
      const fetchList = async () => {
        setLoading(true);
        setError("");
        try {
          const res = await axios.get(`${serverUrl}/electrician/nearby-requests?limit=10&page=${page}`, { withCredentials: true });
          setList(res.data?.data || []);
        } catch (err) {
          setError(err?.response?.data?.message || "Failed to load nearby requests");
        } finally {
          setLoading(false);
        }
      };
      fetchList();
    }, [page]);

    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Available Jobs (Nearby)</h2>
          <p className="text-gray-600 mt-1">Pending requests near your location</p>
        </div>

        {error && (
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">{error}</div>
          </div>
        )}

        {loading ? (
          <div className="p-6 text-gray-600">Loading...</div>
        ) : (
          <div className="p-6 space-y-3">
            {list.map((r) => (
              <RequestItem key={r._id} request={r} showDistance={true} />
            ))}
            {list.length === 0 && !error && <div className="text-gray-600">No nearby requests.</div>}
          </div>
        )}

        <div className="p-6 flex items-center justify-between">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 disabled:opacity-50"
          >
            Prev
          </button>
          <p className="text-sm text-gray-600">Page {page}</p>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={list.length === 0}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const AssignedJobsPage = () => {
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
      const fetchList = async () => {
        setLoading(true);
        setError("");
        try {
          const res = await axios.get(`${serverUrl}/electrician/assigned-requests?limit=10&page=${page}`, { withCredentials: true });
          setList(res.data?.requests || []);
          setTotalPages(res.data?.totalPages || 1);
        } catch (err) {
          setError(err?.response?.data?.message || "Failed to load assigned requests");
        } finally {
          setLoading(false);
        }
      };
      fetchList();
    }, [page]);

    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Assigned Jobs</h2>
          <p className="text-gray-600 mt-1">Accepted or in-progress requests</p>
        </div>

        {error && (
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">{error}</div>
          </div>
        )}

        {loading ? (
          <div className="p-6 text-gray-600">Loading...</div>
        ) : (
          <div className="p-6 space-y-3">
            {list.map((r) => (
              <RequestItem key={r._id} request={r} />
            ))}
            {list.length === 0 && !error && <div className="text-gray-600">No assigned requests.</div>}
          </div>
        )}

        <div className="p-6 flex items-center justify-between">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 disabled:opacity-50"
          >
            Prev
          </button>
          <p className="text-sm text-gray-600">Page {page} of {totalPages}</p>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const CompletedJobsPage = () => {
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
      const fetchList = async () => {
        setLoading(true);
        setError("");
        try {
          const res = await axios.get(`${serverUrl}/electrician/completed-requests?limit=10&page=${page}`, { withCredentials: true });
          setList(res.data?.requests || []);
          setTotalPages(res.data?.totalPages || 1);
        } catch (err) {
          setError(err?.response?.data?.message || "Failed to load completed requests");
        } finally {
          setLoading(false);
        }
      };
      fetchList();
    }, [page]);

    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Completed Jobs</h2>
          <p className="text-gray-600 mt-1">Your completed requests</p>
        </div>

        {error && (
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">{error}</div>
          </div>
        )}

        {loading ? (
          <div className="p-6 text-gray-600">Loading...</div>
        ) : (
          <div className="p-6 space-y-3">
            {list.map((r) => (
              <RequestItem key={r._id} request={r} />
            ))}
            {list.length === 0 && !error && <div className="text-gray-600">No completed requests.</div>}
          </div>
        )}

        <div className="p-6 flex items-center justify-between">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 disabled:opacity-50"
          >
            Prev
          </button>
          <p className="text-sm text-gray-600">Page {page} of {totalPages}</p>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const RequestDetailsPage = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    const fetchDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${serverUrl}/electrician/requests/${id}`, { withCredentials: true });
        setData(res.data?.request || null);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load request");
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchDetails();
    }, [id]);

    const accept = async () => {
      setActionLoading(true);
      try {
        await axios.patch(`${serverUrl}/service/electrician/request/${id}/accept`, {}, { withCredentials: true });
        await fetchDetails();
      } catch (err) {
        setError(err?.response?.data?.message || "Accept failed");
      } finally {
        setActionLoading(false);
      }
    };

    const reject = async () => {
      setActionLoading(true);
      try {
        await axios.patch(`${serverUrl}/electrician/requests/${id}/reject`, {}, { withCredentials: true });
        await fetchDetails();
      } catch (err) {
        setError(err?.response?.data?.message || "Reject failed");
      } finally {
        setActionLoading(false);
      }
    };

    const start = async () => {
      setActionLoading(true);
      try {
        await axios.patch(`${serverUrl}/service/requests/${id}/start`, {}, { withCredentials: true });
        await fetchDetails();
      } catch (err) {
        setError(err?.response?.data?.message || "Start failed");
      } finally {
        setActionLoading(false);
      }
    };

    const complete = async () => {
      setActionLoading(true);
      try {
        await axios.patch(`${serverUrl}/service/requests/${id}/complete`, {}, { withCredentials: true });
        await fetchDetails();
      } catch (err) {
        setError(err?.response?.data?.message || "Complete failed");
      } finally {
        setActionLoading(false);
      }
    };

    if (loading) return <div className="bg-white rounded-xl shadow-md p-6 text-gray-600">Loading...</div>;
    if (error) {
      return (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">{error}</div>
        </div>
      );
    }
    if (!data) return <div className="bg-white rounded-xl shadow-md p-6 text-gray-600">No data found.</div>;

    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Request Details</h2>
              <p className="text-sm text-gray-500 mt-1">{data._id}</p>
            </div>
            <Link to="/dashboard/electrician/assigned" className="text-blue-600 hover:text-blue-800 font-medium">Back</Link>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-800">{data.issueType}</p>
              <p className="text-sm text-gray-600">{data.description}</p>
              <p className="text-sm text-gray-600">
                📍 {data.address?.street}, {data.address?.city}, {data.address?.state} - {data.address?.pincode}
              </p>
            </div>
            <span className={`px-2 py-1 text-xs rounded-full ${
              data.status === "completed" ? "bg-green-100 text-green-800" :
              data.status === "in-progress" ? "bg-yellow-100 text-yellow-800" :
              data.status === "accepted" ? "bg-blue-100 text-blue-800" :
              "bg-gray-100 text-gray-800"
            }`}>
              {data.status}
            </span>
          </div>

          {data.customer && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Customer</p>
              <p className="font-medium text-gray-800">{data.customer.name}</p>
              <p className="text-sm text-gray-600">{data.customer.phone}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            {data.status === "pending" && (
              <>
                <button
                  onClick={accept}
                  disabled={actionLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50"
                >
                  Accept
                </button>
                <button
                  onClick={reject}
                  disabled={actionLoading}
                  className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium disabled:opacity-50"
                >
                  Reject
                </button>
              </>
            )}

            {data.status === "accepted" && (
              <button
                onClick={start}
                disabled={actionLoading}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50"
              >
                Start Job
              </button>
            )}

            {data.status === "in-progress" && (
              <button
                onClick={complete}
                disabled={actionLoading}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50"
              >
                Complete
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ElectricianNavbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<DashboardOverview />} />
          <Route path="/profile" element={<ElectricianProfile />} />
          <Route path="/jobs" element={<NearbyJobsPage />} />
          <Route path="/assigned" element={<AssignedJobsPage />} />
          <Route path="/completed" element={<CompletedJobsPage />} />
          <Route path="/requests/:id" element={<RequestDetailsPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default ElectricianDashboard;
