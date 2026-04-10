import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Users, UserCheck, UserX, Calendar, CheckCircle, Clock, XCircle,
  TrendingUp, Activity, AlertCircle, Zap, Shield, Eye
} from "lucide-react";
import api from "../../api/axios.js";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    users: { total: 0 },
    electricians: { total: 0, pending: 0, approved: 0, rejected: 0 },
    requests: { total: 0, pending: 0, inProgress: 0, completed: 0, cancelled: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const response = await api.get('/api/admin/stats');
      
      if (response.data.success) {
        setStats(response.data.stats);
      } else {
        setError("Failed to fetch admin statistics");
      }
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      setError(error.response?.data?.message || "Failed to fetch statistics");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.users.total,
      icon: Users,
      color: "bg-blue-500",
      change: "+12%",
      changeType: "increase"
    },
    {
      title: "Total Electricians",
      value: stats.electricians.total,
      icon: UserCheck,
      color: "bg-green-500",
      change: "+8%",
      changeType: "increase"
    },
    {
      title: "Pending Electricians",
      value: stats.electricians.pending,
      icon: Clock,
      color: "bg-yellow-500",
      change: "+3",
      changeType: "neutral"
    },
    {
      title: "Total Requests",
      value: stats.requests.total,
      icon: Calendar,
      color: "bg-purple-500",
      change: "+15%",
      changeType: "increase"
    },
    {
      title: "Pending Requests",
      value: stats.requests.pending,
      icon: Activity,
      color: "bg-orange-500",
      change: "+5",
      changeType: "neutral"
    },
    {
      title: "Completed Requests",
      value: stats.requests.completed,
      icon: CheckCircle,
      color: "bg-teal-500",
      change: "+22%",
      changeType: "increase"
    }
  ];

  const quickActions = [
    {
      title: "View All Users",
      description: "Manage customer accounts",
      icon: Users,
      path: "/admin/users",
      color: "bg-blue-100 text-blue-600 hover:bg-blue-200"
    },
    {
      title: "Manage Electricians",
      description: "Approve or reject electrician applications",
      icon: UserCheck,
      path: "/admin/electricians",
      color: "bg-green-100 text-green-600 hover:bg-green-200"
    },
    {
      title: "View All Requests",
      description: "Monitor service requests",
      icon: Calendar,
      path: "/admin/requests",
      color: "bg-purple-100 text-purple-600 hover:bg-purple-200"
    },
    {
      title: "System Status",
      description: "Check system health and performance",
      icon: Activity,
      path: "/admin/system",
      color: "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={fetchAdminStats}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <Shield size={16} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">
                Admin <span className="text-purple-500">Panel</span>
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name || 'Admin'}</span>
              <button
                onClick={() => {
                  localStorage.removeItem('accessToken');
                  localStorage.removeItem('refreshToken');
                  navigate('/login');
                }}
                className="px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage users, electricians, and service requests</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                    stat.changeType === 'increase' ? 'bg-green-100 text-green-700' :
                    stat.changeType === 'decrease' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {stat.change}
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => navigate(action.path)}
                  className={`p-6 rounded-xl border border-gray-200 hover:border-gray-300 transition-all ${action.color}`}
                >
                  <Icon size={32} className="mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Electricians Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <UserCheck className="mr-2 text-green-500" size={20} />
              Electricians Status
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle size={16} className="text-green-600 mr-2" />
                  <span className="font-medium text-green-900">Approved</span>
                </div>
                <span className="text-2xl font-bold text-green-600">{stats.electricians.approved}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center">
                  <Clock size={16} className="text-yellow-600 mr-2" />
                  <span className="font-medium text-yellow-900">Pending</span>
                </div>
                <span className="text-2xl font-bold text-yellow-600">{stats.electricians.pending}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center">
                  <UserX size={16} className="text-red-600 mr-2" />
                  <span className="font-medium text-red-900">Rejected</span>
                </div>
                <span className="text-2xl font-bold text-red-600">{stats.electricians.rejected}</span>
              </div>
            </div>
          </div>

          {/* Requests Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Activity className="mr-2 text-purple-500" size={20} />
              Service Requests Status
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center">
                  <Clock size={16} className="text-yellow-600 mr-2" />
                  <span className="font-medium text-yellow-900">Pending</span>
                </div>
                <span className="text-2xl font-bold text-yellow-600">{stats.requests.pending}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <Zap size={16} className="text-blue-600 mr-2" />
                  <span className="font-medium text-blue-900">In Progress</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">{stats.requests.inProgress}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle size={16} className="text-green-600 mr-2" />
                  <span className="font-medium text-green-900">Completed</span>
                </div>
                <span className="text-2xl font-bold text-green-600">{stats.requests.completed}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center">
                  <XCircle size={16} className="text-red-600 mr-2" />
                  <span className="font-medium text-red-900">Cancelled</span>
                </div>
                <span className="text-2xl font-bold text-red-600">{stats.requests.cancelled}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
