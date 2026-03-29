import { useEffect } from 'react'

const Toast = ({ message, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [show])

  if (!show) return null

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <div className="bg-white border border-gray-100 rounded-2xl shadow-lg px-6 py-5 flex flex-col items-center gap-3">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-800">{message}</p>
          <p className="text-xs text-gray-400 mt-0.5">Redirecting you shortly...</p>
        </div>
      </div>
    </div>
  )
}

export default Toast