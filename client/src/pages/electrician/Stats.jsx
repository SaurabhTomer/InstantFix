import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setStatsLoading, setStats } from '../../store/slices/electricianSlice'
import { PageLoader } from '../../components/shared/Spinner'
import {
  FiBarChart2, FiCheckCircle, FiXCircle,
  FiTrendingUp, FiStar, FiDollarSign, FiClock,
} from 'react-icons/fi'

function MiniBar({ label, value, max, color }) {
  const pct = max > 0 ? Math.min(Math.round((value / max) * 100), 100) : 0
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-400 w-20 shrink-0">{label}</span>
      <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-slate-600 w-8 text-right shrink-0">
        {value}
      </span>
    </div>
  )
}

function KpiCard({ icon: Icon, label, value, sub, iconBg, iconColor }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        <Icon className={`text-lg ${iconColor}`} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-slate-400 font-medium">{label}</p>
        <p className="text-lg font-bold text-slate-800 leading-tight">{value}</p>
        {sub && <p className="text-[11px] text-slate-400">{sub}</p>}
      </div>
    </div>
  )
}

export default function Stats() {
  const dispatch    = useDispatch()
  const accessToken = useSelector(s => s.auth.accessToken)
  const { stats, statsLoading } = useSelector(s => s.electrician)

  useEffect(() => {
    const fetchStats = async () => {
      dispatch(setStatsLoading())
      try {
        const res = await axios.get(
          'http://localhost:5000/api/electrician/stats',
          { headers: { Authorization: `Bearer ${accessToken}` }, withCredentials: true }
        )
        dispatch(setStats(res.data.stats || res.data))
      } catch {}
    }
    fetchStats()
  }, [dispatch, accessToken])

  if (statsLoading) return <PageLoader />

  const s = stats || {
    totalJobs: 0, completedJobs: 0, cancelledJobs: 0,
    pendingJobs: 0, ongoingJobs: 0,
    rating: 0, totalReviews: 0,
    monthlyEarnings: 0, totalEarnings: 0,
    completionRate: 0, avgResponseTime: 0,
    monthlyBreakdown: [],
  }

  const months      = s.monthlyBreakdown || []
  const maxEarnings = Math.max(...months.map(m => m.earnings || 0), 1)

  return (
    <div className="space-y-6 animate-fade-in">

      {/* header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">Performance Stats</h1>
        <p className="text-xs text-slate-400 mt-0.5">Your metrics and earnings overview</p>
      </div>

      {/* kpi grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <KpiCard
          icon={FiBarChart2}  label="Total Jobs"
          value={s.totalJobs} sub="All time"
          iconBg="bg-blue-50"    iconColor="text-blue-600"
        />
        <KpiCard
          icon={FiCheckCircle} label="Completed"
          value={s.completedJobs} sub="Successfully done"
          iconBg="bg-emerald-50"  iconColor="text-emerald-600"
        />
        <KpiCard
          icon={FiXCircle}    label="Cancelled"
          value={s.cancelledJobs} sub="By you or customer"
          iconBg="bg-red-50"     iconColor="text-red-500"
        />
        <KpiCard
          icon={FiTrendingUp} label="Completion Rate"
          value={`${s.completionRate || 0}%`} sub="Jobs finished"
          iconBg="bg-indigo-50"  iconColor="text-indigo-600"
        />
        <KpiCard
          icon={FiStar}       label="Rating"
          value={`${(s.rating || 0).toFixed(1)} ★`}
          sub={`${s.totalReviews || 0} reviews`}
          iconBg="bg-amber-50"   iconColor="text-amber-500"
        />
        <KpiCard
          icon={FiDollarSign} label="Total Earned"
          value={`₹${(s.totalEarnings || 0).toLocaleString('en-IN')}`}
          sub="All time"
          iconBg="bg-emerald-50"  iconColor="text-emerald-600"
        />
      </div>

      {/* charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* monthly earnings bar chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-slate-700">Monthly Earnings</h3>
            <span className="text-xs text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg">
              Last 6 months
            </span>
          </div>
          {months.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-sm text-slate-300">
              No data yet
            </div>
          ) : (
            <>
              <div className="flex items-end gap-2 h-36">
                {months.slice(-6).map((m, i) => {
                  const pct    = Math.max((m.earnings / maxEarnings) * 100, 3)
                  const isLast = i === Math.min(months.length, 6) - 1
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                      <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                        ₹{m.earnings >= 1000
                          ? `${(m.earnings / 1000).toFixed(1)}k`
                          : m.earnings}
                      </span>
                      <div className="w-full flex items-end" style={{ height: '100px' }}>
                        <div
                          className={`w-full rounded-t-xl transition-all duration-700 cursor-pointer
                            ${isLast
                              ? 'bg-blue-600 hover:bg-blue-700'
                              : 'bg-blue-100 hover:bg-blue-200'
                            }`}
                          style={{ height: `${pct}%` }}
                        />
                      </div>
                      <span className={`text-[10px] font-medium ${isLast ? 'text-blue-600' : 'text-slate-400'}`}>
                        {m.month || `M${i + 1}`}
                      </span>
                    </div>
                  )
                })}
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">This month</span>
                <span className="text-sm font-bold text-blue-700">
                  ₹{(s.monthlyEarnings || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </>
          )}
        </div>

        {/* job breakdown */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h3 className="text-sm font-bold text-slate-700 mb-5">Job Breakdown</h3>

          <div className="space-y-4 mb-6">
            <MiniBar label="Completed"  value={s.completedJobs} max={s.totalJobs} color="bg-emerald-400" />
            <MiniBar label="Pending"    value={s.pendingJobs}   max={s.totalJobs} color="bg-amber-400"   />
            <MiniBar label="Ongoing"    value={s.ongoingJobs}   max={s.totalJobs} color="bg-blue-400"    />
            <MiniBar label="Cancelled"  value={s.cancelledJobs} max={s.totalJobs} color="bg-red-300"     />
          </div>

          <div className="space-y-0 border-t border-slate-100 pt-4">
            {[
              { icon: FiTrendingUp, label: 'Completion Rate',    value: `${s.completionRate || 0}%`,       color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { icon: FiClock,      label: 'Avg Response Time',  value: s.avgResponseTime ? `${s.avgResponseTime} min` : '—', color: 'text-blue-600', bg: 'bg-blue-50' },
              { icon: FiDollarSign, label: 'This Month',         value: `₹${(s.monthlyEarnings || 0).toLocaleString('en-IN')}`, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            ].map(row => (
              <div key={row.label} className="flex items-center gap-3 py-2.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${row.bg}`}>
                  <row.icon className={`text-sm ${row.color}`} />
                </div>
                <span className="text-xs text-slate-500 flex-1">{row.label}</span>
                <span className="text-sm font-bold text-slate-700">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}