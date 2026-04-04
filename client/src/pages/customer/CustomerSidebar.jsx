import {
   FiGrid, FiPlusCircle,
  FiList, FiUser,
} from 'react-icons/fi'
import { useSelector } from 'react-redux'

const NAV = [
  {
    section: 'Menu',
    items: [
      { key: 'home',          label: 'Dashboard',      icon: FiGrid },
      { key: 'createRequest', label: 'New Request',     icon: FiPlusCircle },
      { key: 'myRequests',    label: 'My Requests',     icon: FiList },
    ],
  },
  {
    section: 'Account',
    items: [
      { key: 'profile', label: 'Profile', icon: FiUser },
    ],
  },
]

export default function CustomerSidebar({ activePage, onNavigate }) {
  const pendingCount = useSelector(s =>
    s.customer.requests.filter(r => r.status === 'pending').length
  )

  return (
    <aside className="w-56 bg-white border-r border-slate-100 flex flex-col shrink-0 h-full">
    

      {/* nav */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-4">
        {NAV.map(group => (
          <div key={group.section}>
            <p className="px-5 mb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
              {group.section}
            </p>
            {group.items.map(item => {
              const isActive = activePage === item.key
              const Icon = item.icon
              return (
                <button
                  key={item.key}
                  onClick={() => onNavigate(item.key)}
                  className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm transition-all
                    ${isActive
                      ? 'text-blue-700 bg-blue-50 font-semibold border-r-[3px] border-blue-600'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                >
                  <Icon className={`text-base shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.key === 'myRequests' && pendingCount > 0 && (
                    <span className="bg-amber-400 text-amber-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">
                      {pendingCount}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </nav>

      {/* bottom hint */}
      <div className="px-4 py-3 border-t border-slate-100">
        <button
          onClick={() => onNavigate('createRequest')}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors"
        >
          <FiPlusCircle className="text-sm" />
          Book a Service
        </button>
      </div>
    </aside>
  )
}