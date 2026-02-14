import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import UserProfile from "../components/UserProfile";

function UserDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 8900",
    joinDate: "Jan 15, 2024",
    totalRequests: 5,
    completedRequests: 3
  };

  const recentRequests = [
    { id: 1, service: "Emergency Repair", status: "completed", date: "2024-01-20", electrician: "Mike Wilson", rating: 5 },
    { id: 2, service: "Installation", status: "in-progress", date: "2024-01-22", electrician: "Sarah Johnson", rating: null },
    { id: 3, service: "Maintenance", status: "pending", date: "2024-01-25", electrician: "Not assigned", rating: null }
  ];

  const stats = [
    { label: "Total Services", value: "12", icon: "🔧", color: "from-blue-500 to-blue-600" },
    { label: "Completed", value: "8", icon: "✅", color: "from-green-500 to-green-600" },
    { label: "In Progress", value: "2", icon: "⏳", color: "from-yellow-500 to-yellow-600" },
    { label: "Saved Money", value: "$450", icon: "💰", color: "from-purple-500 to-purple-600" }
  ];

  const quickActions = [
    { title: "Book Service", desc: "Schedule a new electrical service", icon: "📅", link: "/dashboard/book" },
    { title: "Find Electrician", desc: "Browse verified electricians", icon: "👨‍🔧", link: "/dashboard/electricians" },
    { title: "Emergency Help", desc: "Get immediate assistance", icon: "🚨", link: "/dashboard/emergency" },
    { title: "View History", desc: "Check past services", icon: "📋", link: "/dashboard/history" }
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
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div>
        <p className="font-medium text-gray-800">{request.service}</p>
        <p className="text-sm text-gray-600">{request.date}</p>
      </div>
      <span className={`px-2 py-1 text-xs rounded-full ${
        request.status === 'completed' ? 'bg-green-100 text-green-800' :
        request.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {request.status}
      </span>
    </div>
  );

  const BookingCard = ({ title, date, electrician, status, statusColor }) => (
    <div className={`p-3 ${statusColor} border rounded-lg`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium text-gray-800">{title}</p>
          <p className="text-sm text-gray-600">{date}</p>
          <p className="text-sm text-gray-600">Electrician: {electrician}</p>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${
          status === 'Confirmed' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
        }`}>
          {status}
        </span>
      </div>
    </div>
  );

  const DashboardOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-yellow-500 text-white rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
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
            <Link to="/dashboard/requests" className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All</Link>
          </div>
          <div className="space-y-3">
            {recentRequests.slice(0, 3).map((request) => (
              <RequestItem key={request.id} request={request} />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Upcoming Bookings</h2>
            <Link to="/dashboard/bookings" className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All</Link>
          </div>
          <div className="space-y-3">
            <BookingCard
              title="Installation Service"
              date="Tomorrow, 2:00 PM"
              electrician="Sarah Johnson"
              status="Confirmed"
              statusColor="bg-yellow-50 border-yellow-200"
            />
            <BookingCard
              title="Maintenance Check"
              date="Jan 28, 10:00 AM"
              electrician="Mike Wilson"
              status="Scheduled"
              statusColor="bg-blue-50 border-blue-200"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const RequestsPage = () => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Service Requests</h2>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            + New Request
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Electrician</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {recentRequests.map((request) => (
              <tr key={request.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{request.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.service}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    request.status === 'completed' ? 'bg-green-100 text-green-800' :
                    request.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {request.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.electrician}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {request.rating ? "⭐".repeat(request.rating) : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className="text-blue-600 hover:text-blue-800 mr-3">View</button>
                  {request.status === 'completed' && !request.rating && (
                    <button className="text-yellow-600 hover:text-yellow-800">Rate</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
        </Routes>
      </div>
    </div>
  );
}

export default UserDashboard;
