import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setHistoryLoading, setHistory } from '../../store/slices/electricianSlice'
import StatusBadge from '../../components/electrician/StatusBadge'
import { PageLoader, EmptyState } from '../../components/shared/Spinner'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export default function JobHistory() {
  const dispatch    = useDispatch()
  const accessToken = useSelector(s => s.auth.accessToken)
  const { history, historyLoading, historyMeta } = useSelector(s => s.electrician)
  const [page, setPage] = useState(1)
  const LIMIT = 10

  useEffect(() => {
    const fetchHistory = async () => {
      dispatch(setHistoryLoading())
      try {
        const res = await axios.get(
          `http://localhost:5000/api/electrician/history?page=${page}&limit=${LIMIT}`,
          { headers: { Authorization: `Bearer ${accessToken}` }, withCredentials: true }
        )
        dispatch(setHistory({
          jobs: res.data.jobs || res.data,
          meta: res.data.meta || null,
        }))
      } catch {}
    }
    fetchHistory()
  }, [page, dispatch, accessToken])

  const totalPages = historyMeta?.totalPages || 1

  return (
    <div className="space-y-5 animate-fade-in">

      {/* header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">Job History</h1>
        <p className="text-xs text-slate-400 mt-0.5">All completed and cancelled jobs</p>
      </div>

      {historyLoading ? (
        <PageLoader />
      ) : history.length === 0 ? (
        <EmptyState icon="🕐" title="No history yet" sub="Completed jobs will appear here" />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Job ID', 'Service', 'Customer', 'Date', 'Earned', 'Status'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {history.map(job => (
                  <tr key={job._id} className="hover:bg-blue-50/40 transition-colors group">
                    <td className="px-5 py-4">
                      <span className="font-mono text-[11px] text-slate-400 bg-slate-100 group-hover:bg-white px-2 py-1 rounded-lg transition-colors">
                        #{job._id?.slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-slate-700 max-w-40 truncate">
                        {job.title || job.serviceType}
                      </p>
                      {job.address && (
                        <p className="text-xs text-slate-400 truncate max-w-40">{job.address}</p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">
                      {job.customer?.name || '—'}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">
                      {new Date(job.completedAt || job.updatedAt).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`text-sm font-bold ${job.status === 'completed' ? 'text-emerald-600' : 'text-slate-300'}`}>
                        {job.status === 'completed'
                          ? `₹${(job.fare || 0).toLocaleString('en-IN')}`
                          : '—'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={job.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-slate-50">
              <p className="text-xs text-slate-400">
                Page <span className="font-semibold text-slate-600">{page}</span> of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <FiChevronLeft className="text-sm" />
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <FiChevronRight className="text-sm" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}