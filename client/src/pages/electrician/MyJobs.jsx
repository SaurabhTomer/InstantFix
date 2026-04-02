import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setJobsLoading, setJobs, setJobsError } from '../../store/slices/electricianSlice'
import JobCard from '../../components/electrician/JobCard'
import { PageLoader, EmptyState } from '../../components/shared/Spinner'

const FILTERS = [
  { key: 'all',       label: 'All' },
  { key: 'pending',   label: 'Pending' },
  { key: 'active',    label: 'Active' },
  { key: 'ongoing',   label: 'Ongoing' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
]

export default function MyJobs() {
  const dispatch    = useDispatch()
  const accessToken = useSelector(s => s.auth.accessToken)
  const { jobs, jobsLoading, jobsError } = useSelector(s => s.electrician)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const fetchJobs = async () => {
      dispatch(setJobsLoading())
      try {
        const url = filter === 'all'
          ? 'http://localhost:5000/api/electrician/jobs'
          : `http://localhost:5000/api/electrician/jobs?status=${filter}`
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        })
        dispatch(setJobs(res.data.jobs || res.data))
      } catch (err) {
        dispatch(setJobsError(err.response?.data?.message || 'Failed to load jobs'))
      }
    }
    fetchJobs()
  }, [filter, dispatch, accessToken])

  const counts = FILTERS.reduce((acc, f) => {
    acc[f.key] = f.key === 'all' ? jobs.length : jobs.filter(j => j.status === f.key).length
    return acc
  }, {})

  return (
    <div className="space-y-5 animate-fade-in">

      {/* header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">My Jobs</h1>
        <p className="text-xs text-slate-400 mt-0.5">All your assigned and active work</p>
      </div>

      {/* filter chips */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all
              ${filter === f.key
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200'
                : 'bg-white text-slate-500 border-slate-200 hover:border-blue-200 hover:text-blue-700'
              }`}
          >
            {f.label}
            {counts[f.key] > 0 && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none
                ${filter === f.key ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {counts[f.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* list */}
      {jobsLoading ? (
        <PageLoader />
      ) : jobsError ? (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl p-4 text-center">
          {jobsError}
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState icon="📋" title={`No ${filter !== 'all' ? filter : ''} jobs`} sub="Nothing to show here" />
      ) : (
        <div className="space-y-3">
          {jobs.map(job => <JobCard key={job._id} job={job} />)}
        </div>
      )}
    </div>
  )
}