import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { FiBell, FiZap, FiChevronDown, FiLogOut, FiPlusCircle } from 'react-icons/fi'
import { clearAuth } from '../../store/slices/authSlice'

export default function CustomerTopbar({ onNavigate }) {
  const dispatch    = useDispatch()
  const user        = useSelector(s => s.auth.user)
  const accessToken = useSelector(s => s.auth.accessToken)
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
    : 'CU'

  return (
    <header className="h-14 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0 z-20">

      {/* left */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
          <FiZap className="text-white text-sm" />
        </div>
        <span className="text-[15px] font-bold text-slate-900 tracking-tight">
          Instant<span className="text-blue-600">Fix</span>
        </span>
        <span className="hidden sm:block text-xs text-slate-300 ml-1">/ Customer</span>
      </div>

      {/* right */}
      <div className="flex items-center gap-3">

        {/* quick book btn */}
        <button
          onClick={() => onNavigate('createRequest')}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors"
        >
          <FiPlusCircle className="text-sm" />
          New Request
        </button>

        {/* notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 hover:bg-blue-50 hover:border-blue-200 transition-colors">
          <FiBell className="text-slate-500 text-base" />
        </button>

        {/* user menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(p => !p)}
            className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-xl border border-slate-200 hover:border-blue-200 hover:bg-blue-50 transition-all"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="w-7 h-7 rounded-lg object-cover" />
            ) : (
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white text-[11px] font-bold">
                {initials}
              </div>
            )}
            <span className="hidden sm:block text-xs font-medium text-slate-700 max-w-[100px] truncate">
              {user?.name || 'Customer'}
            </span>
            <FiChevronDown className={`text-slate-400 text-xs transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-bounce-in">
                <div className="px-4 py-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="" className="w-8 h-8 rounded-xl object-cover shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {initials}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => { setMenuOpen(false); onNavigate('profile') }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Profile
                </button>
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