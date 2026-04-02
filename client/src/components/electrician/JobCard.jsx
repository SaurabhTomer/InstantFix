import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import {
  setActionLoadingId,
  updateJobStatus,
  removeJob,
  showToast,
} from '../../store/slices/electricianSlice'
import StatusBadge from './StatusBadge'
import ConfirmModal from '../shared/ConfirmModal'
import {
  FiMapPin, FiClock, FiDollarSign,
  FiCheck, FiX, FiPlay, FiSlash,
} from 'react-icons/fi'

const BORDER = {
  pending:   'border-l-amber-400',
  active:    'border-l-blue-500',
  ongoing:   'border-l-indigo-500',
  completed: 'border-l-emerald-500',
  cancelled: 'border-l-red-400',
}

export default function JobCard({ job, showActions = true }) {
  const dispatch = useDispatch()
  const { accessToken } = useSelector(s => s.auth)
  const actionLoadingId = useSelector(s => s.electrician.actionLoadingId)
  const [modal, setModal] = useState(null)

  const isLoading = actionLoadingId === job._id

  const callApi = async (endpoint, nextStatus, remove = false) => {
    dispatch(setActionLoadingId(job._id))
    try {
      await axios.post(
        `http://localhost:5000/api/electrician/jobs/${job._id}/${endpoint}`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` }, withCredentials: true }
      )
      if (remove) {
        dispatch(removeJob(job._id))
      } else {
        dispatch(updateJobStatus({ id: job._id, status: nextStatus }))
      }
      dispatch(showToast({ msg: `Job ${endpoint}ed successfully!`, type: 'success' }))
    } catch (err) {
      dispatch(setActionLoadingId(null))
      dispatch(showToast({
        msg: err.response?.data?.message || `Failed to ${endpoint} job`,
        type: 'error',
      }))
    }
    setModal(null)
  }

  const ACTIONS = {
    accept: {
      label: 'Accept',
      confirmLabel: 'Yes, accept',
      message: `Accept "${job.title || job.serviceType}" from ${job.customer?.name || 'this customer'}?`,
      danger: false,
      fn: () => callApi('accept', 'active'),
    },
    reject: {
      label: 'Decline',
      confirmLabel: 'Yes, decline',
      message: `Decline "${job.title || job.serviceType}"? This cannot be undone.`,
      danger: true,
      fn: () => callApi('reject', null, true),
    },
    start: {
      label: 'Start Job',
      confirmLabel: 'Start now',
      message: `Confirm you've arrived and are starting this job?`,
      danger: false,
      fn: () => callApi('start', 'ongoing'),
    },
    cancel: {
      label: 'Cancel',
      confirmLabel: 'Cancel job',
      message: `Cancel this job? It may affect your rating.`,
      danger: true,
      fn: () => callApi('cancel', 'cancelled'),
    },
  }

  const STATUS_ACTIONS = {
    pending:   ['accept', 'reject'],
    active:    ['start', 'cancel'],
    ongoing:   ['cancel'],
    completed: [],
    cancelled: [],
  }

  const BTN_STYLES = {
    accept: 'bg-blue-600 hover:bg-blue-700 text-white',
    reject: 'bg-white hover:bg-red-50 text-red-600 border border-red-200',
    start:  'bg-amber-400 hover:bg-amber-500 text-amber-900',
    cancel: 'bg-white hover:bg-red-50 text-red-500 border border-red-200',
  }

  const BTN_ICONS = {
    accept: <FiCheck className="text-xs" />,
    reject: <FiX className="text-xs" />,
    start:  <FiPlay className="text-xs" />,
    cancel: <FiSlash className="text-xs" />,
  }

  const availableActions = STATUS_ACTIONS[job.status] || []

  return (
    <>
      <div className={`bg-white rounded-2xl border-l-4 ${BORDER[job.status] || 'border-l-slate-200'} shadow-sm hover:shadow-md transition-shadow duration-200 p-4`}>

        {/* top row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-slate-800 truncate">
              {job.title || job.serviceType || 'Service Request'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              {job.customer?.name || 'Customer'}
              {job.customer?.phone ? ` · ${job.customer.phone}` : ''}
            </p>
          </div>
          <StatusBadge status={job.status} />
        </div>

        {/* meta row */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-4">
          {job.address && (
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <FiMapPin className="text-blue-400 shrink-0" />
              {job.address}
            </span>
          )}
          {job.distance != null && (
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <FiMapPin className="text-amber-400 shrink-0" />
              {typeof job.distance === 'number' ? job.distance.toFixed(1) : job.distance} km away
            </span>
          )}
          {(job.scheduledAt || job.createdAt) && (
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <FiClock className="text-blue-400 shrink-0" />
              {new Date(job.scheduledAt || job.createdAt).toLocaleDateString('en-IN', {
                day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
              })}
            </span>
          )}
          {job.fare != null && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <FiDollarSign className="text-emerald-500 shrink-0" />
              ₹{job.fare.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* description */}
        {job.description && (
          <p className="text-xs text-slate-500 bg-slate-50 rounded-xl px-3 py-2 mb-4 line-clamp-2">
            {job.description}
          </p>
        )}

        {/* actions */}
        {showActions && availableActions.length > 0 && (
          <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
            {isLoading ? (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              availableActions.map(key => (
                <button
                  key={key}
                  onClick={() => setModal(key)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${BTN_STYLES[key]}`}
                >
                  {BTN_ICONS[key]}
                  {ACTIONS[key].label}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!modal}
        onClose={() => setModal(null)}
        onConfirm={() => modal && ACTIONS[modal].fn()}
        title={modal ? ACTIONS[modal].label : ''}
        message={modal ? ACTIONS[modal].message : ''}
        confirmLabel={modal ? ACTIONS[modal].confirmLabel : ''}
        danger={modal ? ACTIONS[modal].danger : false}
        loading={isLoading}
      />
    </>
  )
}