import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import {
  setSelectedLoading, setSelectedRequest,
  setCancellingId, updateRequestStatus, showToast,
} from '../../store/slices/customerSlice'
import ConfirmModal from '../../components/shared/ConfirmModal'
import { PageLoader } from '../../components/shared/Spinner'
import { useState } from 'react'
import {
  FiArrowLeft, FiMapPin, FiCalendar, FiClock,
  FiUser, FiPhone, FiStar, FiDollarSign,
  FiX, FiZap, FiCheck, FiAlertCircle,
} from 'react-icons/fi'
import { useParams, useNavigate } from 'react-router-dom'

const STATUS_STEPS = ['pending', 'accepted', 'started', 'completed']

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-400' },
  accepted: { label: 'Accepted', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', dot: 'bg-blue-500' },
  started: { label: 'Started', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200', dot: 'bg-indigo-500' },
  completed: { label: 'Completed', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  cancelled: { label: 'Cancelled', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', dot: 'bg-red-400' },
}


export default function RequestDetail() {

  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const accessToken = useSelector(s => s.auth.accessToken)
  const { selectedRequest, selectedLoading, cancellingId } = useSelector(s => s.customer)
  const [cancelModal, setCancelModal] = useState(false)
  const [activePhoto, setActivePhoto] = useState(null)

  useEffect(() => {
    if (!id) return
    fetchDetail()
  }, [id])

  const fetchDetail = async () => {
    dispatch(setSelectedLoading())
    try {
      const res = await axios.get(
        `http://localhost:5000/api/requests/${id}`,
        { headers: { Authorization: `Bearer ${accessToken}` }, withCredentials: true }
      )
      dispatch(setSelectedRequest(res.data.request))
    } catch (err) {
      dispatch(showToast({
        msg: err.response?.data?.message || 'Failed to load request',
        type: 'error',
      }))
      // onNavigate('myRequests')
      navigate('/customer/requests')
    }
  }

  const handleOnlinePayment = async () => {
    // create order
    const { data } = await axios.post(
      'http://localhost:5000/api/payments/create-order',
      { requestId: req._id },
      { headers: { Authorization: `Bearer ${accessToken}` }, withCredentials: true }
    )

    // open Razorpay checkout
    const options = {
      key: data.keyId,
      amount: data.amount * 100,
      currency: 'INR',
      order_id: data.orderId,
      name: 'InstantFix',
      description: `Payment for ${req.category}`,
      handler: async (response) => {
        // verify on backend
        await axios.post(
          'http://localhost:5000/api/payments/verify',
          {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            paymentId: data.paymentId,
          },
          { headers: { Authorization: `Bearer ${accessToken}` }, withCredentials: true }
        )
        // refresh request detail
        fetchDetail()
      },
      prefill: { name: user?.name, contact: user?.phone },
      theme: { color: '#2563eb' },
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }
  const handleCancel = async () => {
    dispatch(setCancellingId(id))
    try {
      await axios.put(
        `http://localhost:5000/api/requests/${id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` }, withCredentials: true }
      )
      dispatch(updateRequestStatus({ id: id, status: 'cancelled' }))
      dispatch(setSelectedRequest({ ...selectedRequest, status: 'cancelled' }))
      dispatch(showToast({ msg: 'Request cancelled', type: 'info' }))
    } catch (err) {
      dispatch(setCancellingId(null))
      dispatch(showToast({
        msg: err.response?.data?.message || 'Failed to cancel',
        type: 'error',
      }))
    }
    setCancelModal(false)
  }

  if (selectedLoading) return <PageLoader />
  if (!selectedRequest) return null

  const req = selectedRequest
  const sc = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending
  const currentStep = STATUS_STEPS.indexOf(req.status)

  return (
    <>
      {/* photo lightbox */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setActivePhoto(null)}
        >
          <img src={activePhoto} alt="" className="max-w-full max-h-full rounded-2xl object-contain" />
          <button
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 text-white rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors"
            onClick={() => setActivePhoto(null)}
          >
            <FiX className="text-lg" />
          </button>
        </div>
      )}

      <ConfirmModal
        isOpen={cancelModal}
        onClose={() => setCancelModal(false)}
        onConfirm={handleCancel}
        title="Cancel Request"
        message="Are you sure you want to cancel this request? This cannot be undone."
        confirmLabel="Yes, cancel it"
        danger={true}
        loading={!!cancellingId}
      />

      <div className="max-w-2xl space-y-5 animate-fade-in">

        {/* back + header */}
        <div className="flex items-center gap-3">
          <button
            //  onClick={onBack} 
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 hover:bg-blue-50 hover:border-blue-200 text-slate-500 hover:text-blue-600 transition-all"
          >
            <FiArrowLeft className="text-base" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-800">{req.category}</h1>
            <p className="text-xs text-slate-400 font-mono">
              #{req._id?.slice(-8).toUpperCase()}
            </p>
          </div>
          <div className="ml-auto">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${sc.bg} ${sc.border} ${sc.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
              {sc.label}
            </span>
          </div>
        </div>

        {/* progress tracker */}
        {req.status !== 'cancelled' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">
              Request Progress
            </h3>
            <div className="flex items-center">
              {STATUS_STEPS.map((step, i) => {
                const isDone = currentStep >= i
                const isCurrent = currentStep === i
                return (
                  <div key={step} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center gap-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all
                        ${isDone
                          ? 'bg-blue-600 border-blue-600'
                          : 'bg-white border-slate-200'
                        }
                        ${isCurrent ? 'ring-4 ring-blue-100' : ''}`}
                      >
                        {isDone
                          ? <FiCheck className="text-white text-xs" />
                          : <span className="w-2 h-2 rounded-full bg-slate-300" />
                        }
                      </div>
                      <span className={`text-[10px] font-semibold capitalize ${isDone ? 'text-blue-600' : 'text-slate-400'}`}>
                        {step}
                      </span>
                    </div>
                    {i < STATUS_STEPS.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-1 mb-4 transition-all ${currentStep > i ? 'bg-blue-600' : 'bg-slate-200'}`} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* cancelled banner */}
        {req.status === 'cancelled' && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3.5">
            <FiAlertCircle className="text-red-500 shrink-0 text-lg" />
            <div>
              <p className="text-sm font-semibold text-red-700">Request Cancelled</p>
              <p className="text-xs text-red-500 mt-0.5">This service request has been cancelled.</p>
            </div>
          </div>
        )}

        {/* description */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Problem Description
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">{req.description}</p>

          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 pt-4 border-t border-slate-100">
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <FiCalendar className="text-blue-400 shrink-0" />
              {new Date(req.createdAt).toLocaleDateString('en-IN', {
                day: '2-digit', month: 'long', year: 'numeric',
              })}
            </span>
            {req.address?.city && (
              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <FiMapPin className="text-blue-400 shrink-0" />
                {[req.address.street, req.address.city, req.address.state, req.address.pincode]
                  .filter(Boolean).join(', ')}
              </span>
            )}
            {req.startTime && (
              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <FiClock className="text-blue-400 shrink-0" />
                Started: {new Date(req.startTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
        </div>

        {/* photos */}
        {req.photos?.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Photos ({req.photos.length})
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {req.photos.map((photo, i) => (
                <button
                  key={i}
                  onClick={() => setActivePhoto(photo)}
                  className="aspect-square rounded-xl overflow-hidden border border-slate-100 hover:border-blue-300 transition-colors group"
                >
                  <img
                    src={photo} alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* electrician card */}
        {req.electrician ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">
              Assigned Electrician
            </h3>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-lg font-bold shrink-0">
                {req.electrician.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800">{req.electrician.name}</p>
                <div className="flex items-center gap-3 mt-1">
                  {req.electrician.experience && (
                    <span className="text-xs text-slate-500">
                      {req.electrician.experience} yrs exp
                    </span>
                  )}
                  {req.electrician.hourlyRate && (
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <FiDollarSign className="text-emerald-500 shrink-0" />
                      ₹{req.electrician.hourlyRate}/hr
                    </span>
                  )}
                </div>
              </div>
              {req.electrician.phone && (
                <a
                  href={`tel:${req.electrician.phone}`}
                  className="flex items-center gap-2 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold rounded-xl transition-colors"
                >
                  <FiPhone className="text-sm" />
                  Call
                </a>
              )}
            </div>

            {/* electrician extra info */}
            {req.electrician.address && (
              <div className="mt-3 pt-3 border-t border-slate-100">
                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                  <FiMapPin className="text-blue-400 shrink-0" />
                  {req.electrician.address}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
              <FiZap className="text-amber-500 text-base" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-800">Finding an electrician...</p>
              <p className="text-xs text-amber-600 mt-0.5">
                We're matching you with the best available electrician nearby.
              </p>
            </div>
          </div>
        )}

        {/* payment summary */}
        {(req.status === 'completed' || req.totalAmount > 0) && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">
              Payment Summary
            </h3>
            <div className="space-y-2.5">
              {req.hourlyRate > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Hourly Rate</span>
                  <span className="text-slate-700">₹{req.hourlyRate}/hr</span>
                </div>
              )}
              {req.startTime && req.endTime && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Duration</span>
                  <span className="text-slate-700">
                    {Math.round((new Date(req.endTime) - new Date(req.startTime)) / 60000)} min
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2.5 border-t border-slate-100">
                <span className="text-sm font-bold text-slate-800">Total</span>
                <span className="text-base font-bold text-emerald-600">
                  ₹{req.totalAmount?.toLocaleString('en-IN') || 0}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-400">Payment Status</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border
                  ${req.paymentStatus === 'paid'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                  {req.paymentStatus === 'paid' ? '✓ Paid' : 'Pending'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* cancel action */}
        {req.status === 'pending' && (
          <button
            onClick={() => setCancelModal(true)}
            disabled={!!cancellingId}
            className="w-full flex items-center justify-center gap-2 py-3 bg-white hover:bg-red-50 text-red-600 border border-red-200 text-sm font-semibold rounded-2xl transition-colors disabled:opacity-60"
          >
            {cancellingId
              ? <span className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
              : <FiX className="text-base" />
            }
            Cancel This Request
          </button>
        )}
      </div>
    </>
  )
}