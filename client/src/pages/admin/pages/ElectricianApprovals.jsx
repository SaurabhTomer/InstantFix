import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { setPendingElectricians, removeFromPending, setToast } from "../../../store/adminSlice"
import Spinner from "../../../components/Spinner"
import ConfirmModal from "../../../components/ConfirmModal"
import { MdCheckCircle, MdCancel, MdPerson, MdPhone, MdEmail, MdWork } from "react-icons/md"

export default function ElectricianApprovals() {
  const dispatch = useDispatch()
  const { pendingElectricians } = useSelector(s => s.admin)
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState(null)  // electrician jis par action ho raha
  const [modal, setModal] = useState(null)         // { id, type: 'approve' | 'reject' }

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/admin/electricians/pending",
          { withCredentials: true }
        )
        dispatch(setPendingElectricians(data.electricians))
      } catch {
        dispatch(setToast({ message: "Data load nahi hua", type: "error" }))
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const handleAction = async () => {
    const { id, type } = modal
    setModal(null)
    setActionId(id)
    try {
      await axios.put(
        `http://localhost:5000/api/admin/electricians/${id}/${type}`,
        {},
        { withCredentials: true }
      )
      dispatch(removeFromPending(id))
      dispatch(setToast({
        message: type === "approve"
          ? "Electrician approve ho gaya ✅"
          : "Electrician reject kar diya ❌",
        type: type === "approve" ? "success" : "error"
      }))
    } catch {
      dispatch(setToast({ message: "Action fail hua", type: "error" }))
    } finally {
      setActionId(null)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64"><Spinner /></div>
  )

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Electrician Approvals
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {pendingElectricians.length} pending approval{pendingElectricians.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Empty state */}
      {pendingElectricians.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center
          border border-gray-100 dark:border-gray-700">
          <MdCheckCircle size={48} className="text-green-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Koi pending approval nahi hai
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {pendingElectricians.map(e => (
            <div
              key={e._id}
              className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm
                border border-gray-100 dark:border-gray-700 animate-slide-up"
            >
              {/* Avatar + Name */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-yellow-400 flex items-center
                  justify-center text-gray-900 font-bold text-lg">
                  {e.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">{e.name}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100
                    dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-medium">
                    Pending
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 mb-5">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <MdEmail size={16} className="text-gray-400 shrink-0" />
                  <span className="truncate">{e.email}</span>
                </div>
                {e.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MdPhone size={16} className="text-gray-400 shrink-0" />
                    <span>{e.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <MdWork size={16} className="text-gray-400 shrink-0" />
                  <span>{e.experience} years experience</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <MdPerson size={16} className="text-gray-400 shrink-0" />
                  <span>₹{e.hourlyRate}/hr</span>
                </div>
                {e.address?.city && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    📍 {e.address.city}, {e.address.state}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setModal({ id: e._id, type: "approve" })}
                  disabled={actionId === e._id}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg
                    bg-green-500 hover:bg-green-600 text-white text-sm font-medium
                    transition-all disabled:opacity-50"
                >
                  {actionId === e._id
                    ? <Spinner small />
                    : <><MdCheckCircle size={16} /> Approve</>
                  }
                </button>
                <button
                  onClick={() => setModal({ id: e._id, type: "reject" })}
                  disabled={actionId === e._id}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg
                    bg-red-500 hover:bg-red-600 text-white text-sm font-medium
                    transition-all disabled:opacity-50"
                >
                  <MdCancel size={16} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Modal */}
      {modal && (
        <ConfirmModal
          title={modal.type === "approve" ? "Approve Electrician?" : "Reject Electrician?"}
          message={
            modal.type === "approve"
              ? "Is electrician ko approve karne par woh jobs le sakta hai."
              : "Is electrician ko reject kar doge? Woh login nahi kar payega."
          }
          confirmText={modal.type === "approve" ? "Approve" : "Reject"}
          confirmColor={modal.type === "approve" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}
          onConfirm={handleAction}
          onCancel={() => setModal(null)}
        />
      )}

    </div>
  )
}