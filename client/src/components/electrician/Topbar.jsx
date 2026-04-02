import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { FiBell, FiZap, FiChevronDown, FiLogOut, FiUser } from 'react-icons/fi'
import { clearAuth } from '../../store/slices/authSlice'

export default function Topbar({ online, onToggle }) {
  const dispatch    = useDispatch()
  const user        = useSelector(s => s.auth.user)
  const accessToken = useSelector(s => s.auth.accessToken)
  const pendingCount = useSelector(s =>
    s.electrician.jobs.filter(j => j.status === 'pending').length
  )
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await axios.post(
        'http://localhost:5000/api/auth/logout',
        {},
        { headers: { Authorization: `Bearer ${accessToken}` }, withCredentials: true }
      )
    } catch {}
    dispatch(clearAuth())
    window.location.href = '/login'
  }

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'EL'

  return (
    <header className="h-14 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0 z-20">

      {/* left - brand */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
          <FiZap className="text-white text-sm" />
        </div>
        <span className="text-[15px] font-bold text-slate-900 tracking-tight">
          Instant<span className="text-blue-600">Fix</span>
        </span>
        <span className="hidden sm:block text-xs text-slate-300 ml-1">/ Electrician</span>
      </div>

      {/* right */}
      <div className="flex items-center gap-3">

        {/* online toggle */}
        <button
          onClick={onToggle}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all
            ${online
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-slate-100 border-slate-200 text-slate-500'
            }`}
        >
          <div className={`w-2 h-2 rounded-full transition-colors ${online ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
          {online ? 'Online' : 'Offline'}
          {/* mini toggle track */}
          <div className={`relative w-8 h-4 rounded-full transition-colors ml-1 ${online ? 'bg-blue-500' : 'bg-slate-300'}`}>
            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all duration-200 ${online ? 'left-4.5' : 'left-0.5'}`} />
          </div>
        </button>

        {/* notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 hover:bg-blue-50 hover:border-blue-200 transition-colors">
          <FiBell className="text-slate-500 text-base" />
          {pendingCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
              {pendingCount > 9 ? '9+' : pendingCount}
            </span>
          )}
        </button>

        {/* user menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(p => !p)}
            className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-xl border border-slate-200 hover:border-blue-200 hover:bg-blue-50 transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white text-[11px] font-bold">
              {initials}
            </div>
            <span className="hidden sm:block text-xs font-medium text-slate-700 max-w-25 truncate">
              {user?.name || 'Electrician'}
            </span>
            <FiChevronDown className={`text-slate-400 text-xs transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-bounce-in">
                <div className="px-4 py-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <FiLogOut className="text-base" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}