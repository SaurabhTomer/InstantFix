import { FiAlertTriangle, FiX } from 'react-icons/fi'

export default function ConfirmModal({
  isOpen, onClose, onConfirm,
  title, message,
  confirmLabel = 'Confirm',
  danger = false,
  loading = false,
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* modal box */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-bounce-in overflow-hidden">
        {/* top accent bar */}
        <div className={`h-1 w-full ${danger ? 'bg-red-500' : 'bg-blue-500'}`} />

        <div className="p-6">
          {/* header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${danger ? 'bg-red-50' : 'bg-blue-50'}`}>
                <FiAlertTriangle className={`text-lg ${danger ? 'text-red-500' : 'text-blue-500'}`} />
              </div>
              <h3 className="text-base font-semibold text-slate-800">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-slate-500 transition-colors p-1 rounded-lg hover:bg-slate-100"
            >
              <FiX className="text-lg" />
            </button>
          </div>

          {/* message */}
          <p className="text-sm text-slate-500 leading-relaxed mb-6 pl-13">
            {message}
          </p>

          {/* actions */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`px-5 py-2 text-sm font-semibold text-white rounded-xl transition-colors flex items-center gap-2 disabled:opacity-60
                ${danger ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {loading && (
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}