import React, { useState } from 'react';
import { FaChartLine, FaChartBar, FaChartPie, FaCalendarAlt, FaDownload, FaFilter, FaDollarSign, FaUsers, FaTools, FaClipboardList, FaStar, FaArrowUp, FaArrowDown, FaEye, FaClock } from 'react-icons/fa';

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Mock data for analytics
  const revenueData = [
    { date: '2024-01-01', revenue: 2400, orders: 12 },
    { date: '2024-01-02', revenue: 3200, orders: 16 },
    { date: '2024-01-03', revenue: 2800, orders: 14 },
    { date: '2024-01-04', revenue: 3600, orders: 18 },
    { date: '2024-01-05', revenue: 4200, orders: 21 },
    { date: '2024-01-06', revenue: 3800, orders: 19 },
    { date: '2024-01-07', revenue: 4500, orders: 23 },
  ];

  const userGrowthData = [
    { month: 'Jan', users: 450, newUsers: 120 },
    { month: 'Feb', users: 580, newUsers: 130 },
    { month: 'Mar', users: 720, newUsers: 140 },
    { month: 'Apr', users: 890, newUsers: 170 },
    { month: 'May', users: 1050, newUsers: 160 },
    { month: 'Jun', users: 1247, newUsers: 197 },
  ];

  const serviceCategories = [
    { name: 'Residential Wiring', value: 45, color: 'bg-blue-500' },
    { name: 'Commercial Electrical', value: 25, color: 'bg-green-500' },
    { name: 'Industrial Electrical', value: 15, color: 'bg-yellow-500' },
    { name: 'HVAC Electrical', value: 10, color: 'bg-purple-500' },
    { name: 'Emergency Services', value: 5, color: 'bg-red-500' },
  ];

  const topPerformers = [
    { name: 'Robert Chen', jobs: 45, revenue: 22500, rating: 4.8, completionRate: 93 },
    { name: 'James Wilson', jobs: 38, revenue: 19000, rating: 4.6, completionRate: 92 },
    { name: 'Maria Garcia', jobs: 32, revenue: 16000, rating: 4.9, completionRate: 94 },
    { name: 'Lisa Anderson', jobs: 28, revenue: 14000, rating: 4.5, completionRate: 89 },
    { name: 'David Kim', jobs: 25, revenue: 12500, rating: 4.7, completionRate: 91 },
  ];

  const keyMetrics = [
    {
      title: 'Total Revenue',
      value: '$124,500',
      change: '+23.5%',
      changeType: 'positive',
      icon: FaDollarSign,
      color: 'from-green-400 to-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Orders',
      value: '1,847',
      change: '+18.2%',
      changeType: 'positive',
      icon: FaClipboardList,
      color: 'from-blue-400 to-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Users',
      value: '1,247',
      change: '+12.8%',
      changeType: 'positive',
      icon: FaUsers,
      color: 'from-purple-400 to-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Active Electricians',
      value: '89',
      change: '+5.2%',
      changeType: 'positive',
      icon: FaTools,
      color: 'from-orange-400 to-orange-500',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Avg. Rating',
      value: '4.7',
      change: '+0.2',
      changeType: 'positive',
      icon: FaStar,
      color: 'from-yellow-400 to-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Completion Rate',
      value: '91.2%',
      change: '+2.1%',
      changeType: 'positive',
      icon: FaChartLine,
      color: 'from-red-400 to-red-500',
      bgColor: 'bg-red-50'
    }
  ];

  const getTrendIcon = (type) => {
    return type === 'positive' ? FaArrowUp : FaArrowDown;
  };

  const getTrendColor = (type) => {
    return type === 'positive' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div>
      {/* Add CSS animations */}
      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .chart-bar {
          transition: all 0.3s ease;
        }
        
        .chart-bar:hover {
          opacity: 0.8;
          transform: translateY(-2px);
        }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaChartLine className="w-6 h-6 text-blue-500" />
            Analytics & Reports
          </h2>
          <p className="text-gray-600 mt-1">Detailed insights and platform performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
            <FaDownload />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {keyMetrics.map((metric, index) => {
          const Icon = metric.icon;
          const TrendIcon = getTrendIcon(metric.changeType);
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300"
              style={{
                animation: `slide-up 0.5s ease-out ${0.1 * (index + 1)}s both`
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${metric.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor(metric.changeType)}`}>
                  <TrendIcon className="w-3 h-3" />
                  {metric.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">{metric.value}</h3>
              <p className="text-sm text-gray-600">{metric.title}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Revenue Trend</h3>
            <div className="flex items-center gap-2">
              <FaDollarSign className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-600">Last 7 days</span>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {revenueData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="relative w-full flex flex-col items-center">
                  <div
                    className="chart-bar w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg hover:from-green-600 hover:to-green-500 cursor-pointer"
                    style={{ height: `${(data.revenue / 4500) * 100}%` }}
                    title={`$${data.revenue} - ${data.orders} orders`}
                  />
                  <div className="text-xs text-gray-600 mt-2">
                    ${data.revenue}
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(data.date).getDate()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">User Growth</h3>
            <div className="flex items-center gap-2">
              <FaUsers className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600">Last 6 months</span>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {userGrowthData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="relative w-full flex flex-col items-center">
                  <div
                    className="chart-bar w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg hover:from-blue-600 hover:to-blue-500 cursor-pointer"
                    style={{ height: `${(data.users / 1247) * 100}%` }}
                    title={`${data.users} total users, ${data.newUsers} new`}
                  />
                  <div className="text-xs text-gray-600 mt-2">
                    {data.users}
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {data.month}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Service Categories */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Service Categories</h3>
            <FaChartPie className="w-4 h-4 text-purple-500" />
          </div>
          <div className="space-y-3">
            {serviceCategories.map((category, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${category.color}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">{category.name}</span>
                    <span className="text-sm font-medium text-gray-900">{category.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${category.color}`}
                      style={{ width: `${category.value}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Top Electricians</h3>
            <FaStar className="w-4 h-4 text-yellow-500" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="pb-3">Electrician</th>
                  <th className="pb-3">Jobs</th>
                  <th className="pb-3">Revenue</th>
                  <th className="pb-3">Rating</th>
                  <th className="pb-3">Completion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topPerformers.map((performer, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold text-orange-600">
                            {performer.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{performer.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-gray-600">{performer.jobs}</td>
                    <td className="py-3 text-sm text-gray-600">${performer.revenue.toLocaleString()}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        <FaStar className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{performer.rating}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${performer.completionRate}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{performer.completionRate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
          <FaClock className="w-4 h-4 text-orange-500" />
        </div>
        <div className="space-y-3">
          {[
            { user: 'John Doe', action: 'completed a service request', time: '2 minutes ago', type: 'completed' },
            { user: 'Sarah Wilson', action: 'registered as new user', time: '15 minutes ago', type: 'user' },
            { user: 'Robert Chen', action: 'completed emergency repair', time: '1 hour ago', type: 'completed' },
            { user: 'Admin', action: 'approved new electrician', time: '2 hours ago', type: 'admin' },
            { user: 'Mike Smith', action: 'created a service request', time: '3 hours ago', type: 'request' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className={`w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm`}>
                {activity.type === 'completed' && <FaCheckCircle className="w-4 h-4 text-green-500" />}
                {activity.type === 'user' && <FaUsers className="w-4 h-4 text-blue-500" />}
                {activity.type === 'admin' && <FaTools className="w-4 h-4 text-orange-500" />}
                {activity.type === 'request' && <FaClipboardList className="w-4 h-4 text-purple-500" />}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">
                  <span className="font-semibold">{activity.user}</span> {activity.action}
                </p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
