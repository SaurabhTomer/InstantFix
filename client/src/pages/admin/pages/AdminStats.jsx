import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { setStats, setToast } from "../../../store/adminSlice"
import Spinner from "../../../components/Spinner"
import {
  MdTrendingUp, MdCurrencyRupee, MdElectricBolt,
  MdCheckCircle, MdCancel, MdPending
} from "react-icons/md"

const BAR_COLORS = [
  "bg-blue-500", "bg-yellow-400", "bg-purple-500",
  "bg-green-500", "bg-orange-400", "bg-pink-500"
]

const StatRow = ({ label, value, total, color }) => {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">{label}</span>
        <span className="font-semibold text-gray-800 dark:text-white">
          {value} <span className="text-xs text-gray-400 font-normal">({pct}%)</span>
        </span>
      </div>
      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export default function AdminStats() {
  const dispatch = useDispatch()
  const { stats } = useSelector(s => s.admin)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/admin/stats",
          { withCredentials: true }
        )
        dispatch(setStats(data.stats))
      } catch {
        dispatch(setToast({ message: "Stats load nahi hue", type: "error" }))
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64"><Spinner /></div>
  )

  const maxRequests = Math.max(...(stats.monthlyData?.map(m => m.requests) || [1]))
  const maxRevenue  = Math.max(...(stats.monthlyData?.map(m => m.revenue)  || [1]))

  const completionRate = stats.totalRequests
    ? Math.round((stats.completedRequests / stats.totalRequests) * 100) : 0

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Stats & Analytics
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Platform ka performance overview
        </p>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* Revenue */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm
          border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30
              flex items-center justify-center">
              <MdCurrencyRupee size={22} className="text-emerald-600" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
          </div>
          <p className="text-3xl font-bold text-emerald-600">
            ₹{stats.revenue?.toLocaleString("en-IN") || 0}
          </p>
          <p className="text-xs text-gray-400 mt-1">Completed payments se</p>
        </div>

        {/* Completion Rate */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm
          border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30
              flex items-center justify-center">
              <MdCheckCircle size={22} className="text-green-600" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Completion Rate</p>
          </div>
          <p className="text-3xl font-bold text-green-600">{completionRate}%</p>
          <div className="mt-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
            <div
              className="bg-green-500 h-1.5 rounded-full transition-all duration-700"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Avg Revenue per request */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm
          border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30
              flex items-center justify-center">
              <MdTrendingUp size={22} className="text-blue-600" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Avg per Request</p>
          </div>
          <p className="text-3xl font-bold text-blue-600">
            ₹{stats.completedRequests > 0
              ? Math.round(stats.revenue / stats.completedRequests).toLocaleString("en-IN")
              : 0
            }
          </p>
          <p className="text-xs text-gray-400 mt-1">Completed requests ka average</p>
        </div>
      </div>

      {/* Monthly Requests Bar Chart */}
      {stats.monthlyData?.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm
          border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-6">
            <MdTrendingUp size={20} className="text-yellow-500" />
            <h3 className="text-base font-semibold text-gray-700 dark:text-gray-200">
              Monthly Requests (Last 6 Months)
            </h3>
          </div>

          <div className="flex items-end gap-3 h-48">
            {stats.monthlyData.map((m, i) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  {m.requests}
                </span>
                <div
                  className="w-full rounded-t-lg transition-all duration-700"
                  style={{
                    height: `${Math.max((m.requests / maxRequests) * 160, 4)}px`
                  }}
                >
                  <div className={`w-full h-full rounded-t-lg ${BAR_COLORS[i % BAR_COLORS.length]}`} />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{m.month}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monthly Revenue Bar Chart */}
      {stats.monthlyData?.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm
          border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-6">
            <MdCurrencyRupee size={20} className="text-emerald-500" />
            <h3 className="text-base font-semibold text-gray-700 dark:text-gray-200">
              Monthly Revenue (Last 6 Months)
            </h3>
          </div>

          <div className="flex items-end gap-3 h-48">
            {stats.monthlyData.map((m, i) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  ₹{m.revenue?.toLocaleString("en-IN") || 0}
                </span>
                <div
                  className="w-full rounded-t-lg transition-all duration-700"
                  style={{
                    height: `${Math.max((m.revenue / maxRevenue) * 160, 4)}px`
                  }}
                >
                  <div className="w-full h-full rounded-t-lg bg-emerald-500 rounded-t-lg" />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{m.month}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Request Status Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm
        border border-gray-100 dark:border-gray-700">
        <h3 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-5">
          Request Status Breakdown
        </h3>
        <div className="space-y-4">
          <StatRow
            label="Completed"
            value={stats.completedRequests}
            total={stats.totalRequests}
            color="bg-green-500"
          />
          <StatRow
            label="Pending"
            value={stats.pendingRequests}
            total={stats.totalRequests}
            color="bg-orange-400"
          />
          <StatRow
            label="Cancelled"
            value={stats.cancelledRequests}
            total={stats.totalRequests}
            color="bg-red-500"
          />
          <StatRow
            label="In Progress (accepted + started)"
            value={
              stats.totalRequests -
              stats.completedRequests -
              stats.pendingRequests -
              stats.cancelledRequests
            }
            total={stats.totalRequests}
            color="bg-blue-500"
          />
        </div>
      </div>

      {/* Platform Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm
        border border-gray-100 dark:border-gray-700">
        <h3 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-5">
          Platform Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Customers",   value: stats.totalUsers,          icon: <MdCheckCircle size={18} className="text-blue-500" /> },
            { label: "Electricians",      value: stats.totalElectricians,   icon: <MdElectricBolt size={18} className="text-yellow-500" /> },
            { label: "Total Requests",    value: stats.totalRequests,       icon: <MdPending size={18} className="text-purple-500" /> },
            { label: "Cancelled",         value: stats.cancelledRequests,   icon: <MdCancel size={18} className="text-red-500" /> },
          ].map(item => (
            <div key={item.label}
              className="bg-gray-50 dark:bg-gray-900/40 rounded-xl p-4 text-center">
              <div className="flex justify-center mb-2">{item.icon}</div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{item.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}