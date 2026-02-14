import { useEffect, useState } from "react";
import { Routes, Route, Link, useParams } from "react-router-dom";
import UserNavbar from "../UserNavbar";
import UserProfile from "../UserProfile";
import axios from "axios";
import { useSelector } from "react-redux";
import { useFetchUser } from "../../hooks/useFetchUser";

const serverUrl = "http://localhost:3000/api";

function UserDashboard() {
  const {userData}=useSelector(state=>state.user)
  const { loading: userLoading, error: userError } = useFetchUser();

  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsError, setRequestsError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      setRequestsLoading(true);
      setRequestsError("");
      try {
        const res = await axios.get(`${serverUrl}/service?limit=5&page=1`, {
          withCredentials: true,
        });
        setRequests(res.data?.data || []);
      } catch (err) {
        setRequestsError(err?.response?.data?.message || "Failed to load requests");
      } finally {
        setRequestsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const total = requests.length;
  const completed = requests.filter((r) => r.status === "completed").length;
  const inProgress = requests.filter((r) => r.status === "in-progress" || r.status === "accepted").length;

  const stats = [
    { label: "Recent Requests", value: String(total), icon: "🔧", color: "from-blue-500 to-blue-600" },
    { label: "Completed", value: String(completed), icon: "✅", color: "from-green-500 to-green-600" },
    { label: "In Progress", value: String(inProgress), icon: "⏳", color: "from-yellow-500 to-yellow-600" },
    { label: "Support", value: "24/7", icon: "�", color: "from-purple-500 to-purple-600" }
  ];

  const quickActions = [
    { title: "Book Service", desc: "Schedule new service", icon: "📅", link: "/book-service" },
    { title: "Find Electrician", desc: "Browse electricians", icon: "👨‍🔧", link: "/dashboard/user/electricians" },
    { title: "Emergency Help", desc: "Get urgent help", icon: "🚨", link: "/dashboard/user/emergency" },
    { title: "View History", desc: "Past services", icon: "📋", link: "/dashboard/user/history" }
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

  const RequestItem = ({ request }) => (
    <Link to={`/dashboard/user/requests/${request._id}`} className="block">
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
        <div>
          <p className="font-medium text-gray-800">{request.issueType}</p>
          <p className="text-sm text-gray-600">{new Date(request.createdAt).toLocaleDateString()}</p>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${
          request.status === 'completed' ? 'bg-green-100 text-green-800' :
          request.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {request.status}
        </span>
      </div>
    </Link>
  );

  const RequestsPage = () => {
    const [page, setPage] = useState(1);
    const [list, setList] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
      const fetchList = async () => {
        setLoading(true);
        setError("");
        try {
          const res = await axios.get(`${serverUrl}/service?limit=10&page=${page}`, {
            withCredentials: true,
          });
          setList(res.data?.data || []);
          setTotalPages(res.data?.totalPages || 1);
        } catch (err) {
          setError(err?.response?.data?.message || "Failed to load requests");
        } finally {
          setLoading(false);
        }
      };

      fetchList();
    }, [page]);

    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">My Requests</h2>
            <Link
              to="/book-service"
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              + Book Service
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
          <div className="divide-y divide-gray-200">
            {list.map((r) => (
              <Link
                key={r._id}
                to={`/dashboard/user/requests/${r._id}`}
                className="block p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{r.issueType}</p>
                    <p className="text-sm text-gray-600 mt-1">{r.description}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(r.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    r.status === 'completed' ? 'bg-green-100 text-green-800' :
                    r.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {r.status}
                  </span>
                </div>
              </Link>
            ))}

            {list.length === 0 && (
              <div className="p-6 text-gray-600">No requests found.</div>
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

  const RequestDetailsPage = ({ requestId }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
      const fetchOne = async () => {
        setLoading(true);
        setError("");
        try {
          const res = await axios.get(`${serverUrl}/service/my-request/${requestId}`, {
            withCredentials: true,
          });
          setData(res.data?.request || null);
        } catch (err) {
          setError(err?.response?.data?.message || "Failed to load request details");
        } finally {
          setLoading(false);
        }
      };

      fetchOne();
    }, [requestId]);

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
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Request Details</h2>
              <p className="text-sm text-gray-500 mt-1">{data._id}</p>
            </div>
            <Link to="/dashboard/user/requests" className="text-blue-600 hover:text-blue-800 font-medium">
              Back
            </Link>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-gray-800">{data.issueType}</p>
            <span className={`px-2 py-1 text-xs rounded-full ${
              data.status === 'completed' ? 'bg-green-100 text-green-800' :
              data.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {data.status}
            </span>
          </div>

          <div>
            <p className="text-sm text-gray-500">Description</p>
            <p className="text-gray-800 mt-1">{data.description}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Address</p>
            <p className="text-gray-800 mt-1">
              {data.address?.street}, {data.address?.city}, {data.address?.state} {data.address?.pincode}
            </p>
          </div>

          {data.electrician && (
            <div>
              <p className="text-sm text-gray-500">Assigned Electrician</p>
              <p className="text-gray-800 mt-1">{data.electrician?.name}</p>
              <p className="text-gray-600 text-sm">{data.electrician?.phone}</p>
            </div>
          )}

          {Array.isArray(data.images) && data.images.length > 0 && (
            <div>
              <p className="text-sm text-gray-500">Images</p>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {data.images.map((img) => (
                  <a
                    key={img}
                    href={img}
                    target="_blank"
                    rel="noreferrer"
                    className="block"
                  >
                    <img src={img} alt="issue" className="w-full h-32 object-cover rounded-lg border" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const RequestDetailsRoute = () => {
    const { requestId } = useParams();
    return <RequestDetailsPage requestId={requestId} />;
  };

  const DashboardOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-yellow-500 text-white rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {userData?.name || "User"}! 👋</h1>
        <p className="text-blue-100">Here's what's happening with your electrical services today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
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
            <h2 className="text-xl font-bold text-gray-800">Recent Requests</h2>
            <Link to="/dashboard/user/requests" className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All</Link>
          </div>
          <div className="space-y-3">
            {requestsError && (
              <div className="text-sm text-red-600">{requestsError}</div>
            )}

            {requestsLoading && (
              <div className="text-sm text-gray-600">Loading...</div>
            )}

            {!requestsLoading && !requestsError && requests.slice(0, 3).map((request) => (
              <RequestItem key={request._id} request={request} />
            ))}

            {!requestsLoading && !requestsError && requests.length === 0 && (
              <div className="text-sm text-gray-600">No requests yet.</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Upcoming Bookings</h2>
            <Link to="/dashboard/user/bookings" className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All</Link>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-800">Installation Service</p>
                  <p className="text-sm text-gray-600">Tomorrow, 2:00 PM</p>
                  <p className="text-sm text-gray-600">Electrician: Sarah Johnson</p>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Confirmed</span>
              </div>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-800">Maintenance Check</p>
                  <p className="text-sm text-gray-600">Jan 28, 10:00 AM</p>
                  <p className="text-sm text-gray-600">Electrician: Mike Wilson</p>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Scheduled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<DashboardOverview />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/requests" element={<RequestsPage />} />
          <Route path="/requests/:requestId" element={<RequestDetailsRoute />} />
        </Routes>
      </div>
    </div>
  );
}

export default UserDashboard;
