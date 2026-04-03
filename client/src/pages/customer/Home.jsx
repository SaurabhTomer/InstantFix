import { useSelector } from 'react-redux'
import { FiZap, FiSun, FiWind, FiDroplet, FiTool, FiMonitor, FiAlertCircle, FiArrowRight } from 'react-icons/fi'

const CATEGORIES = [
  { key: 'Wiring',           icon: FiZap,       color: 'bg-blue-50 text-blue-600',    border: 'border-blue-100' },
  { key: 'Fan Installation', icon: FiWind,      color: 'bg-indigo-50 text-indigo-600', border: 'border-indigo-100' },
  { key: 'AC Service',       icon: FiSun,       color: 'bg-amber-50 text-amber-600',   border: 'border-amber-100' },
  { key: 'Water Heater',     icon: FiDroplet,   color: 'bg-cyan-50 text-cyan-600',     border: 'border-cyan-100' },
  { key: 'Panel Repair',     icon: FiTool,      color: 'bg-rose-50 text-rose-600',     border: 'border-rose-100' },
  { key: 'Smart Home',       icon: FiMonitor,   color: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100' },
  { key: 'Emergency',        icon: FiAlertCircle, color: 'bg-red-50 text-red-600',     border: 'border-red-100' },
  { key: 'Other',            icon: FiTool,      color: 'bg-slate-50 text-slate-600',   border: 'border-slate-100' },
]

const SEASONAL = [
  {
    title: 'Summer AC Check',
    desc: 'Get your AC serviced before peak summer. Avoid breakdowns.',
    icon: FiSun,
    bg: 'bg-amber-50',
    iconColor: 'text-amber-500',
    tag: 'Popular this season',
    tagColor: 'bg-amber-100 text-amber-700',
    category: 'AC Service',
  },
  {
    title: 'Monsoon Wiring Safety',
    desc: 'Check all exposed wiring before monsoon to prevent short circuits.',
    icon: FiDroplet,
    bg: 'bg-cyan-50',
    iconColor: 'text-cyan-500',
    tag: 'Safety first',
    tagColor: 'bg-cyan-100 text-cyan-700',
    category: 'Wiring',
  },
  {
    title: 'Fan Installation',
    desc: 'Install ceiling fans before summer hits. Quick same-day service.',
    icon: FiWind,
    bg: 'bg-indigo-50',
    iconColor: 'text-indigo-500',
    tag: 'Fast service',
    tagColor: 'bg-indigo-100 text-indigo-700',
    category: 'Fan Installation',
  },
]

export default function Home({ onNavigate }) {
  const user = useSelector(s => s.auth.user)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-8 animate-fade-in">

      {/* hero banner */}
      <div className="relative bg-blue-600 rounded-2xl p-6 overflow-hidden">
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-blue-500 rounded-full opacity-40" />
        <div className="absolute -bottom-10 right-10 w-28 h-28 bg-blue-700 rounded-full opacity-30" />
        <div className="absolute top-4 right-4 w-16 h-16 bg-blue-400 rounded-full opacity-20" />
        <div className="relative z-10">
          <p className="text-blue-200 text-sm mb-1">{greeting},</p>
          <h1 className="text-2xl font-bold text-white mb-1">
            {user?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="text-blue-100 text-sm mb-5">
            What electrical service do you need today?
          </p>
          <button
            onClick={() => onNavigate('createRequest')}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 text-sm font-bold rounded-xl hover:bg-blue-50 transition-colors"
          >
            <FiZap className="text-base" />
            Book a Service Now
          </button>
        </div>
      </div>

      {/* categories */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-800">Service Categories</h2>
          <button
            onClick={() => onNavigate('createRequest')}
            className="flex items-center gap-1 text-xs text-blue-600 font-semibold hover:underline"
          >
            Book now <FiArrowRight className="text-xs" />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon
            return (
              <button
                key={cat.key}
                onClick={() => onNavigate('createRequest', cat.key)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border ${cat.border} ${cat.color.split(' ')[0]} hover:shadow-md transition-all group`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cat.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="text-lg" />
                </div>
                <span className="text-xs font-semibold text-slate-700 text-center leading-tight">
                  {cat.key}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* seasonal services */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-800">Recommended This Season</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {SEASONAL.map(s => {
            const Icon = s.icon
            return (
              <div
                key={s.title}
                className={`${s.bg} rounded-2xl p-4 border border-white hover:shadow-md transition-all cursor-pointer`}
                onClick={() => onNavigate('createRequest', s.category)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm`}>
                    <Icon className={`text-lg ${s.iconColor}`} />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${s.tagColor}`}>
                    {s.tag}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">{s.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                <button className="mt-3 flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline">
                  Book now <FiArrowRight className="text-xs" />
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* quick stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Fast Response',    value: '< 30 min', sub: 'Average arrival', color: 'text-blue-600',    bg: 'bg-blue-50' },
          { label: 'Verified Experts', value: '100%',     sub: 'Background checked', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Happy Customers',  value: '4.8 ★',   sub: 'Average rating',  color: 'text-amber-600',   bg: 'bg-amber-50' },
        ].map(stat => (
          <div key={stat.label} className={`${stat.bg} rounded-2xl p-4 text-center`}>
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs font-semibold text-slate-700 mt-0.5">{stat.label}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>
    </div>
  )
}