import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearToast } from '../../store/slices/electricianSlice'
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi'

const CONFIG = {
  success: {
    icon: FiCheckCircle,
    bar:  'bg-emerald-500',
    iconCls: 'text-emerald-500',
    border: 'border-emerald-100',
  },
  error: {
    icon: FiAlertCircle,
    bar:  'bg-red-500',
    iconCls: 'text-red-500',
    border: 'border-red-100',
  },
  info: {
    icon: FiInfo,
    bar:  'bg-blue-500',
    iconCls: 'text-blue-500',
    border: 'border-blue-100',
  },
}

export default function Toast() {
  const dispatch = useDispatch()
  const toast = useSelector(s => s.electrician.toast)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => dispatch(clearToast()), 3000)
    return () => clearTimeout(t)
  }, [toast, dispatch])

  if (!toast) return null

  const c = CONFIG[toast.type] || CONFIG.info
  const Icon = c.icon

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className={`bg-white rounded-2xl shadow-xl border ${c.border} overflow-hidden min-w-75 max-w-sm`}>
        <div className="flex items-start gap-3 px-4 py-3.5">
          <Icon className={`text-lg mt-0.5 shrink-0 ${c.iconCls}`} />
          <p className="text-sm text-slate-700 flex-1 leading-snug">{toast.msg}</p>
          <button
            onClick={() => dispatch(clearToast())}
            className="text-slate-300 hover:text-slate-500 transition-colors mt-0.5"
          >
            <FiX className="text-base" />
          </button>
        </div>
        <div className={`h-0.5 ${c.bar} animate-shrink-width`} />
      </div>
    </div>
  )
}