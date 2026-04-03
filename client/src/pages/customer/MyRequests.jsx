import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import {
  setRequestsLoading, setRequests, setRequestsError,
  setCancellingId, updateRequestStatus, showToast,
} from '../../store/slices/customerSlice'
import ConfirmModal from '../../components/shared/ConfirmModal'
import { PageLoader, EmptyState } from '../../components/shared/Spinner'
import {
  FiClock, FiCheck, FiX, FiZap,
  FiChevronLeft, FiChevronRight, FiEye,
  FiMapPin, FiUser, FiCalendar,
} from 'react-icons/fi'

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   cls: 'bg-amber-50 text-amber-700 border-amber-200',     dot: 'bg-amber-400' },
  accepted:  { label: 'Accepted',  cls: 'bg-blue-50 text-blue-700 border-blue-200',         dot: 'bg-blue-500' },
  started:   { label: 'Started',   cls: 'bg-indigo-50 text-indigo-700 border-indigo-200',   dot: 'bg-indigo-500' },
  completed: { label: 'Completed', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  cancelled: { label: 'Cancelled', cls: 'bg-red-50 text-red-600 border-red-200',             dot: 'bg-red-400' },
}

const FILTERS = [
  { key: 'all',       label: 'All' },
  { key: 'pending',   label: 'Pending' },
  { key: 'accepted',  label: 'Accepted' },
  { key: 'started',   label: 'Started' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
]

function StatusBadge({ status }) {
  const c = STATUS_CONFIG[status] || STATUS_CONFIG.pending
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${c.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  )
}

export default function MyRequests({ onNavigate }) {
  const dispatch    = useDispatch()
  const accessToken = useSelector(s => s.auth.accessToken)
  const { requests, requestsLoading, requestsError, pagination, cancellingId } = useSelector(s => s.customer)

  const [filter,      setFilter]      = useState('all')
  const [page,        setPage]        = useState(1)
  const [cancelModal, setCancelModal] = useState(null)
  const LIMIT = 8

  useEffect(() => {
    fetchRequests()
  }, [filter, page])

  const fetchRequests = async () => {
    dispatch(setRequestsLoading())
    try {
      const params = new URLSearchParams({ page, limit: LIMIT })
      if (filter !== 'all') params.append('status', filter)

      const res = await axios.get(
        `http://localhost:5000/api/requests/my?${params}`,
        { headers: { Authorization: `Bearer ${accessToken}` }, withCredentials: true }
      )
      dispatch(setRequests({
        requests:   res.data.requests,
        pagination: res.data.pagination,
      }))
    } catch (err) {
      dispatch(setRequestsError(err.response?.data?.message || 'Failed to load requests'))
    }
  }

  const handleCancel = async () => {
    if (!cancelModal) return
    dispatch(setCancellingId(cancelModal))
    try {
      await axios.put(
        `http://localhost:5000/api/requests/${cancelModal}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` }, withCredentials: true }
      )
      dispatch(updateRequestStatus({ id: cancelModal, status: 'cancelled' }))
      dispatch(showToast({ msg: 'Request cancelled successfully', type: 'info' }))
    } catch (err) {
      dispatch(setCancellingId(null))
      dispatch(showToast({
        msg: err.response?.data?.message || 'Failed to cancel request',
        type: 'error',
      }))
    }
    setCancelModal(null)
  }

  const totalPages = pagination?.totalPages || 1

  return (
    <>
      <ConfirmModal
        isOpen={!!cancelModal}
        onClose={() => setCancelModal(null)}
        onConfirm={handleCancel}
        title="Cancel Request"
        message="Are you sure you want to cancel this service request? This cannot be undone."
        confirmLabel="Yes, cancel it"
        danger={true}
        loading={!!cancellingId}
      />

      <div className="space-y-5 animate-fade-in">

        {/* header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800">My Requests</h1>
            <p className="text-xs text-slate-400 mt-0.5">Track all your service requests</p>
          </div>
          <button
            onClick={() => onNavigate('createRequest')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm shadow-blue-200"
          >
            + New Request
          </button>
        </div>

        {/* filters */}
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => { setFilter(f.key); setPage(1) }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all
                ${filter === f.key
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-blue-200 hover:text-blue-700'
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* list */}
        {requestsLoading ? (
          <PageLoader />
        ) : requestsError ? (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl p-4 text-center">
            {requestsError}
          </div>
        ) : requests.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No requests found"
            sub={filter !== 'all' ? `No ${filter} requests` : 'Create your first service request'}
          />
        ) : (
          <div className="space-y-3">
            {requests.map(req => (
              <div
                key={req._id}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* category icon */}
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                      <FiZap className="text-blue-600 text-base" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-slate-800 truncate">
                        {req.category}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                        {req.description}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={req.status} />
                </div>

                {/* meta */}
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-3">
                  {req.address?.city && (
                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                      <FiMapPin className="text-blue-400 shrink-0" />
                      {req.address.city}{req.address.state ? `, ${req.address.state}` : ''}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 text-xs text-slate-500">
                    <FiCalendar className="text-blue-400 shrink-0" />
                    {new Date(req.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit', month: 'short', year: 'numeric',
                    })}
                  </span>
                  {req.electrician && (
                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                      <FiUser className="text-emerald-500 shrink-0" />
                      {req.electrician.name}
                    </span>
                  )}
                  {req.totalAmount > 0 && (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                      ₹{req.totalAmount.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                {/* photos strip */}
                {req.photos?.length > 0 && (
                  <div className="flex gap-1.5 mb-3">
                    {req.photos.slice(0, 4).map((photo, i) => (
                      <img
                        key={i}
                        src={photo}
                        alt=""
                        className="w-12 h-12 object-cover rounded-lg border border-slate-100"
                      />
                    ))}
                    {req.photos.length > 4 && (
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                        <span className="text-xs text-slate-500 font-semibold">
                          +{req.photos.length - 4}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => onNavigate('requestDetail', req._id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 hover:border-blue-200 text-xs font-semibold rounded-xl transition-all"
                  >
                    <FiEye className="text-xs" />
                    View Details
                  </button>

                  {req.status === 'pending' && (
                    <button
                      onClick={() => setCancelModal(req._id)}
                      disabled={cancellingId === req._id}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-red-50 text-red-500 border border-red-200 text-xs font-semibold rounded-xl transition-all disabled:opacity-50"
                    >
                      {cancellingId === req._id
                        ? <span className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                        : <FiX className="text-xs" />
                      }
                      Cancel
                    </button>
                  )}

                  {req.status === 'completed' && (
                    <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                      <FiCheck className="text-xs" />
                      Completed · ₹{req.totalAmount?.toLocaleString('en-IN') || 0}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-slate-100 px-5 py-3">
            <p className="text-xs text-slate-400">
              Page <span className="font-semibold text-slate-600">{page}</span> of {totalPages}
              {pagination?.total && (
                <span className="ml-1">· {pagination.total} total</span>
              )}
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
    </>
  )
}