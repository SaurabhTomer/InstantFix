import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { setStats, setToast } from "../../../store/adminSlice"
import Spinner from "../../../components/Spinner"
import {
  MdPeople, MdElectricBolt, MdListAlt,
  MdCheckCircle, MdPending, MdCancel, MdCurrencyRupee
} from "react-icons/md"

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 flex items-center gap-4
    shadow-sm border border-gray-100 dark:border-gray-700 animate-slide-up">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
    </div>
  </div>
)

const BAR_COLORS = [
  "bg-blue-500", "bg-yellow-400", "bg-purple-500",
  "bg-green-500", "bg-orange-400", "bg-pink-500"
]

export default function AdminOverview() {
  const dispatch = useDispatch()
  const { stats } = useSelector(s => s.admin)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/admin/stats",
          { withCredentials: true })
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
    <div className="flex items-center justify-center h-64">
      <Spinner />
    </div>
  )

  const cards = [
    {
      icon: <MdPeople size={24} className="text-blue-600" />,
      label: "Total Customers",
      value: stats.totalUsers,
      color: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
      icon: <MdElectricBolt size={24} className="text-yellow-600" />,
      label: "Electricians",
      value: stats.totalElectricians,
      color: "bg-yellow-100 dark:bg-yellow-900/30"
    },
    {
      icon: <MdListAlt size={24} className="text-purple-600" />,
      label: "Total Requests",
      value: stats.totalRequests,
      color: "bg-purple-100 dark:bg-purple-900/30"
    },
    {
      icon: <MdCheckCircle size={24} className="text-green-600" />,
      label: "Completed",
      value: stats.completedRequests,
      color: "bg-green-100 dark:bg-green-900/30"
    },
    {
      icon: <MdPending size={24} className="text-orange-500" />,
      label: "Pending",
      value: stats.pendingRequests,
      color: "bg-orange-100 dark:bg-orange-900/30"
    },
    {
      icon: <MdCancel size={24} className="text-red-500" />,
      label: "Cancelled",
      value: stats.cancelledRequests,
      color: "bg-red-100 dark:bg-red-900/30"
    },
    {
      icon: <MdCurrencyRupee size={24} className="text-emerald-600" />,
      label: "Total Revenue",
      value: `₹${stats.revenue?.toLocaleString("en-IN") || 0}`,
      color: "bg-emerald-100 dark:bg-emerald-900/30"
    },
  ]

  // Bar chart max value
  const maxRequests = Math.max(...(stats.monthlyData?.map(m => m.requests) || [1]))

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Greeting */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Welcome, Admin 👋
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          InstantFix platform ka full overview
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cards.map(c => <StatCard key={c.label} {...c} />)}
      </div>

      {/* Monthly Chart */}
      {stats.monthlyData?.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm
          border border-gray-100 dark:border-gray-700">
          <h3 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-6">
            Monthly Requests (Last 6 Months)
          </h3>

          <div className="flex items-end gap-4 h-48">
            {stats.monthlyData.map((m, i) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                {/* Value */}
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  {m.requests}
                </span>
                {/* Bar */}
                <div className="w-full rounded-t-lg transition-all duration-500"
                  style={{
                    height: `${(m.requests / maxRequests) * 160}px`,
                    minHeight: "4px"
                  }}
                >
                  <div className={`w-full h-full rounded-t-lg ${BAR_COLORS[i % BAR_COLORS.length]}`} />
                </div>
                {/* Month label */}
                <span className="text-xs text-gray-500 dark:text-gray-400">{m.month}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Revenue + Completion Rate */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Revenue card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm
          border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
            Total Revenue
          </h3>
          <p className="text-3xl font-bold text-emerald-600">
            ₹{stats.revenue?.toLocaleString("en-IN") || 0}
          </p>
          <p className="text-xs text-gray-400 mt-1">Completed payments se</p>
        </div>

        {/* Completion rate */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm
          border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
            Completion Rate
          </h3>
          {(() => {
            const rate = stats.totalRequests
              ? Math.round((stats.completedRequests / stats.totalRequests) * 100)
              : 0
            return (
              <>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl font-bold text-green-600">{rate}%</span>
                  <span className="text-xs text-gray-400">
                    {stats.completedRequests} / {stats.totalRequests}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-green-500 h-2.5 rounded-full transition-all duration-700"
                    style={{ width: `${rate}%` }}
                  />
                </div>
              </>
            )
          })()}
        </div>
      </div>

    </div>
  )
}