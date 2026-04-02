import { useSelector } from 'react-redux'
import {
  FiZap, FiGrid, FiBriefcase, FiNavigation,
  FiClock, FiBarChart2, FiUser, FiMapPin,
} from 'react-icons/fi'

const NAV = [
  {
    section: 'Jobs',
    items: [
      { key: 'overview',  label: 'Overview',    icon: FiGrid },
      { key: 'myjobs',    label: 'My Jobs',     icon: FiBriefcase, badge: true },
      { key: 'nearby',    label: 'Nearby Jobs', icon: FiNavigation },
      { key: 'history',   label: 'History',     icon: FiClock },
    ],
  },
  {
    section: 'Analytics',
    items: [
      { key: 'stats',     label: 'Stats',       icon: FiBarChart2 },
    ],
  },
  {
    section: 'Account',
    items: [
      { key: 'profile',   label: 'Profile',     icon: FiUser },
      { key: 'location',  label: 'Location',    icon: FiMapPin },
    ],
  },
]

export default function Sidebar({ activePage, onNavigate }) {
  const pendingCount = useSelector(s =>
    s.electrician.jobs.filter(j => j.status === 'pending').length
  )

  return (
    <aside className="w-56 bg-white border-r border-slate-100 flex flex-col shrink-0 h-full">
      {/* brand */}
      <div className="flex items-center gap-2.5 px-5 h-14 border-b border-slate-100 shrink-0">
        <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
          <FiZap className="text-white text-sm" />
        </div>
        <span className="text-[15px] font-bold text-slate-900 tracking-tight">
          Instant<span className="text-blue-600">Fix</span>
        </span>
      </div>

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
                  className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm transition-all relative
                    ${isActive
                      ? 'text-blue-700 bg-blue-50 font-semibold border-r-[3px] border-blue-600'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                >
                  <Icon className={`text-base shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && pendingCount > 0 && (
                    <span className="bg-amber-400 text-amber-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-4.5 text-center leading-none">
                      {pendingCount}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </nav>

      {/* bottom user hint */}
      <div className="px-4 py-3 border-t border-slate-100">
        <div className="flex items-center gap-2.5 px-3 py-2.5 bg-blue-50 rounded-xl">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shrink-0" />
          <span className="text-xs text-blue-700 font-medium">You are online</span>
        </div>
      </div>
    </aside>
  )
}