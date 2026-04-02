import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import {
  setJobsLoading, setJobs, setJobsError,
  setStatsLoading, setStats,
} from '../../store/slices/electricianSlice'
import JobCard from '../../components/electrician/JobCard'
import { PageLoader, EmptyState } from '../../components/shared/Spinner'
import {
  FiBriefcase, FiClock, FiDollarSign,
  FiStar, FiTrendingUp, FiAlertCircle,
} from 'react-icons/fi'

function StatCard({ icon: Icon, label, value, sub, iconBg, iconColor, accent }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${iconBg}`}>
        <Icon className={`text-xl ${iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-400 font-medium mb-0.5">{label}</p>
        <p className={`text-2xl font-bold tracking-tight ${accent}`}>{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

export default function Overview() {
  const dispatch    = useDispatch()
  const accessToken = useSelector(s => s.auth.accessToken)
  const user        = useSelector(s => s.auth.user)
  const { jobs, jobsLoading, stats } = useSelector(s => s.electrician)

  useEffect(() => {
    const fetchJobs = async () => {
      dispatch(setJobsLoading())
      try {
        const res = await axios.get(
          'http://localhost:5000/api/electrician/jobs?limit=10',
          { headers: { Authorization: `Bearer ${accessToken}` }, withCredentials: true }
        )
        dispatch(setJobs(res.data.jobs || res.data))
      } catch (err) {
        dispatch(setJobsError(err.response?.data?.message || 'Failed to load jobs'))
      }
    }

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

    fetchJobs()
    fetchStats()
  }, [dispatch, accessToken])

  const pending = jobs.filter(j => j.status === 'pending')
  const active  = jobs.filter(j => j.status === 'active' || j.status === 'ongoing')

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-6 animate-fade-in">

      {/* greeting banner */}
      <div className="relative bg-blue-600 rounded-2xl p-6 overflow-hidden">
        {/* decorative circles */}
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-500 rounded-full opacity-40" />
        <div className="absolute -bottom-8 -right-2 w-24 h-24 bg-blue-700 rounded-full opacity-30" />
        <div className="relative z-10">
          <p className="text-blue-200 text-sm mb-1">{greeting},</p>
          <h1 className="text-2xl font-bold text-white">{user?.name || 'Electrician'} 👋</h1>
          <p className="text-blue-200 text-sm mt-1">
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
            })}
          </p>
          {pending.length > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
              <FiAlertCircle className="text-amber-300 shrink-0" />
              <span className="text-sm font-semibold text-white">
                {pending.length} pending job{pending.length > 1 ? 's' : ''} need your attention
              </span>
            </div>
          )}
        </div>
      </div>

      {/* stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={FiBriefcase}
          label="Active Jobs"
          value={active.length}
          sub="In progress"
          iconBg="bg-blue-50" iconColor="text-blue-600" accent="text-blue-700"
        />
        <StatCard
          icon={FiClock}
          label="Pending"
          value={pending.length}
          sub="Needs action"
          iconBg="bg-amber-50" iconColor="text-amber-500" accent="text-amber-600"
        />
        <StatCard
          icon={FiDollarSign}
          label="This Month"
          value={stats ? `₹${(stats.monthlyEarnings || 0).toLocaleString('en-IN')}` : '—'}
          sub={stats?.earningsChange != null
            ? `${stats.earningsChange >= 0 ? '+' : ''}${stats.earningsChange}% vs last`
            : 'Loading...'}
          iconBg="bg-emerald-50" iconColor="text-emerald-600" accent="text-emerald-700"
        />
        <StatCard
          icon={FiStar}
          label="Rating"
          value={stats?.rating ? stats.rating.toFixed(1) : '—'}
          sub={stats?.totalReviews ? `${stats.totalReviews} reviews` : 'No reviews yet'}
          iconBg="bg-amber-50" iconColor="text-amber-400" accent="text-amber-600"
        />
      </div>

      {/* pending jobs */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-700">Pending Requests</h2>
          <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
            Action needed
          </span>
        </div>
        {jobsLoading ? (
          <PageLoader />
        ) : pending.length === 0 ? (
          <EmptyState icon="📭" title="No pending requests" sub="New jobs will appear here" />
        ) : (
          <div className="space-y-3">
            {pending.map(job => <JobCard key={job._id} job={job} />)}
          </div>
        )}
      </div>

      {/* active jobs */}
      {active.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-700">Active Jobs</h2>
            <span className="text-xs text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg font-semibold">
              {active.length} in progress
            </span>
          </div>
          <div className="space-y-3">
            {active.map(job => <JobCard key={job._id} job={job} />)}
          </div>
        </div>
      )}
    </div>
  )
}