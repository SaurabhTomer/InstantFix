import { useEffect, useState } from "react";
import { Routes, Route, Link, useParams } from "react-router-dom";
import AdminNavbar from "../AdminNavbar";
import AdminProfile from "../AdminProfile";
import axios from "axios";
import { useSelector } from "react-redux";

const serverUrl = "http://localhost:3000/api";

function AdminDashboard() {
  const admin = useSelector((state) => state.user.userData);

  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState("");
  const [counts, setCounts] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      setStatsLoading(true);
      setStatsError("");

      try {
        const [pendingRes, allRes, approvedRes, rejectedRes] = await Promise.all([
          axios.get(`${serverUrl}/admin/electricians/pending?limit=1&page=1`, { withCredentials: true }),
          axios.get(`${serverUrl}/admin/electricians?limit=1&page=1`, { withCredentials: true }),
          axios.get(`${serverUrl}/admin/electricians?status=approved&limit=1&page=1`, { withCredentials: true }),
          axios.get(`${serverUrl}/admin/electricians?status=rejected&limit=1&page=1`, { withCredentials: true }),
        ]);

        setCounts({
          total: allRes.data?.total || 0,
          pending: pendingRes.data?.total || 0,
          approved: approvedRes.data?.total || 0,
          rejected: rejectedRes.data?.total || 0,
        });

      } catch (err) {
        setStatsError(err?.response?.data?.message || "Failed to load admin stats");
      } finally {
        setStatsLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const stats = [
    { label: "Total Electricians", value: String(counts.total), icon: "👨‍🔧", color: "from-green-500 to-green-600" },
    { label: "Pending", value: String(counts.pending), icon: "⏳", color: "from-yellow-500 to-yellow-600" },
    { label: "Approved", value: String(counts.approved), icon: "✅", color: "from-blue-500 to-blue-600" },
    { label: "Rejected", value: String(counts.rejected), icon: "❌", color: "from-purple-500 to-purple-600" }
  ];

  const quickActions = [
    { title: "Pending Approvals", desc: "Approve/reject electricians", icon: "🧾", link: "/dashboard/admin/electricians/pending" },
    { title: "All Electricians", desc: "View electrician directory", icon: "📋", link: "/dashboard/admin/electricians" },
    { title: "Approved", desc: "Approved list", icon: "✅", link: "/dashboard/admin/electricians?status=approved" },
    { title: "Rejected", desc: "Rejected list", icon: "❌", link: "/dashboard/admin/electricians?status=rejected" }
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
      <div className="p-6 border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all">
        <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{action.icon}</div>
        <h3 className="font-semibold text-gray-800 mb-1">{action.title}</h3>
        <p className="text-sm text-gray-600">{action.desc}</p>
      </div>
    </Link>
  );

  const ElectricianItem = ({ electrician }) => (
    <Link
      to={`/dashboard/admin/electricians/${electrician._id}`}
      className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-gray-800">{electrician.name}</p>
          <p className="text-sm text-gray-600">{electrician.email}</p>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${electrician.approvalStatus === 'approved' ? 'bg-green-100 text-green-800' :
            electrician.approvalStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
          }`}>
          {electrician.approvalStatus}
        </span>
      </div>
    </Link>
  );

  const DashboardOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {admin.name}! 🛡️</h1>
        <p className="text-purple-100">System overview and management dashboard</p>
      </div>

      {/* Stats Grid */}
      {statsError && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {statsError}
        </div>
      )}

      <div className="grid md:grid-cols-4 gap-4">
        {statsLoading ? (
          <div className="md:col-span-4 text-gray-600">Loading...</div>
        ) : (
          stats.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <ActionCard key={index} action={action} />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Pending Electricians</h2>
            <Link to="/dashboard/admin/electricians/pending" className="text-purple-600 hover:text-purple-800 text-sm font-medium">View All</Link>
          </div>
          <PendingElectriciansPreview />
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Recently Added Electricians</h2>
            <Link to="/dashboard/admin/electricians" className="text-purple-600 hover:text-purple-800 text-sm font-medium">View All</Link>
          </div>
          <AllElectriciansPreview />
        </div>
      </div>
    </div>
  );

  const PendingElectriciansPreview = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
      const fetchList = async () => {
        setLoading(true);
        setError("");
        try {
          const res = await axios.get(`${serverUrl}/admin/electricians/pending?limit=3&page=1`, {
            withCredentials: true,
          });
          setList(res.data?.electricians || []);
        } catch (err) {
          setError(err?.response?.data?.message || "Failed to load pending electricians");
        } finally {
          setLoading(false);
        }
      };

      fetchList();
    }, []);

    if (loading) return <div className="text-sm text-gray-600">Loading...</div>;
    if (error) return <div className="text-sm text-red-600">{error}</div>;
    if (list.length === 0) return <div className="text-sm text-gray-600">No pending approvals.</div>;

    return (
      <div className="space-y-3">
        {list.map((e) => (
          <ElectricianItem key={e._id} electrician={e} />
        ))}
      </div>
    );
  };

  const AllElectriciansPreview = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
      const fetchList = async () => {
        setLoading(true);
        setError("");
        try {
          const res = await axios.get(`${serverUrl}/admin/electricians?limit=3&page=1`, {
            withCredentials: true,
          });
          setList(res.data?.electricians || []);
        } catch (err) {
          setError(err?.response?.data?.message || "Failed to load electricians");
        } finally {
          setLoading(false);
        }
      };

      fetchList();
    }, []);

    if (loading) return <div className="text-sm text-gray-600">Loading...</div>;
    if (error) return <div className="text-sm text-red-600">{error}</div>;
    if (list.length === 0) return <div className="text-sm text-gray-600">No electricians found.</div>;

    return (
      <div className="space-y-3">
        {list.map((e) => (
          <ElectricianItem key={e._id} electrician={e} />
        ))}
      </div>
    );
  };

  const PendingElectriciansPage = () => {
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
          const res = await axios.get(`${serverUrl}/admin/electricians/pending?limit=10&page=${page}`, {
            withCredentials: true,
          });
          setList(res.data?.electricians || []);
          setTotalPages(res.data?.totalPages || 1);
        } catch (err) {
          setError(err?.response?.data?.message || "Failed to load pending electricians");
        } finally {
          setLoading(false);
        }
      };

      fetchList();
    }, [page]);

    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Pending Electricians</h2>
          <p className="text-gray-600 mt-1">Approve or reject electrician accounts</p>
        </div>

        {error && (
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              {error}
            </div>
          </div>
        )}

        {loading ? (
          <div className="p-6 text-gray-600">Loading...</div>
        ) : (
          <div className="p-6 space-y-3">
            {list.map((e) => (
              <ElectricianItem key={e._id} electrician={e} />
            ))}

            {list.length === 0 && !error && (
              <div className="text-gray-600">No pending electricians.</div>
            )}
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

  const ElectriciansPage = () => {
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const statusParam = params.get("status") || "";
      setStatus(statusParam);
    }, []);

    useEffect(() => {
      const fetchList = async () => {
        setLoading(true);
        setError("");
        try {
          const url = status
            ? `${serverUrl}/admin/electricians?status=${status}&limit=10&page=${page}`
            : `${serverUrl}/admin/electricians?limit=10&page=${page}`;

          const res = await axios.get(url, { withCredentials: true });
          setList(res.data?.electricians || []);
          setTotalPages(res.data?.totalPages || 1);
        } catch (err) {
          setError(err?.response?.data?.message || "Failed to load electricians");
        } finally {
          setLoading(false);
        }
      };

      fetchList();
    }, [page, status]);

    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Electricians</h2>
              <p className="text-gray-600 mt-1">{status ? `Filter: ${status}` : "All electricians"}</p>
            </div>
            <Link to="/dashboard/admin/electricians/pending" className="text-purple-600 hover:text-purple-800 font-medium">
              View Pending
            </Link>
          </div>
        </div>

        {error && (
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              {error}
            </div>
          </div>
        )}

        {loading ? (
          <div className="p-6 text-gray-600">Loading...</div>
        ) : (
          <div className="p-6 space-y-3">
            {list.map((e) => (
              <ElectricianItem key={e._id} electrician={e} />
            ))}

            {list.length === 0 && !error && (
              <div className="text-gray-600">No electricians found.</div>
            )}
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

  const ElectricianDetailsPage = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    const fetchDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${serverUrl}/admin/electricians/${id}`, { withCredentials: true });
        setData(res.data?.electrician || null);
        setStats(res.data?.stats || null);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load electrician details");
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchDetails();
    }, [id]);

    const approve = async () => {
      setActionLoading(true);
      try {
        await axios.patch(`${serverUrl}/admin/electrician/${id}/approve`, {}, { withCredentials: true });
        await fetchDetails();
      } catch (err) {
        setError(err?.response?.data?.msg || err?.response?.data?.message || "Approve failed");
      } finally {
        setActionLoading(false);
      }
    };

    const reject = async () => {
      setActionLoading(true);
      try {
        await axios.patch(`${serverUrl}/admin/electrician/${id}/reject`, {}, { withCredentials: true });
        await fetchDetails();
      } catch (err) {
        setError(err?.response?.data?.msg || err?.response?.data?.message || "Reject failed");
      } finally {
        setActionLoading(false);
      }
    };

    if (loading) {
      return <div className="bg-white rounded-xl shadow-md p-6 text-gray-600">Loading...</div>;
    }

    if (error) {
      return (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      );
    }

    if (!data) {
      return <div className="bg-white rounded-xl shadow-md p-6 text-gray-600">No data found.</div>;
    }

    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Electrician Details</h2>
              <p className="text-sm text-gray-500 mt-1">{data._id}</p>
            </div>
            <Link to="/dashboard/admin/electricians" className="text-purple-600 hover:text-purple-800 font-medium">
              Back
            </Link>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-800">{data.name}</p>
              <p className="text-sm text-gray-600">{data.email}</p>
              <p className="text-sm text-gray-600">{data.phone}</p>
            </div>
            <span className={`px-2 py-1 text-xs rounded-full ${data.approvalStatus === 'approved' ? 'bg-green-100 text-green-800' :
                data.approvalStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
              }`}>
              {data.approvalStatus}
            </span>
          </div>

          {stats && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Total Requests</p>
                <p className="text-xl font-bold text-gray-800">{stats.totalRequests}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-xl font-bold text-gray-800">{stats.completedRequests}</p>
              </div>
            </div>
          )}

          {data.approvalStatus === "pending" && (
            <div className="flex gap-3 pt-2">
              <button
                onClick={approve}
                disabled={actionLoading}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50"
              >
                Approve
              </button>
              <button
                onClick={reject}
                disabled={actionLoading}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<DashboardOverview />} />
          <Route path="/profile" element={<AdminProfile />} />
          <Route path="/electricians/pending" element={<PendingElectriciansPage />} />
          <Route path="/electricians" element={<ElectriciansPage />} />
          <Route path="/electricians/:id" element={<ElectricianDetailsPage />} />
        </Routes>
      </div>
      
    </div>
  );
}

export default AdminDashboard;
