import { useSelector } from 'react-redux'
import { useRef } from 'react'
import {
  FiArrowRight,
  FiChevronLeft, FiChevronRight,
  FiShield, FiClock, FiStar, FiThumbsUp,
  FiCheckCircle, FiZap,
} from 'react-icons/fi'

const CATEGORIES = [
  { key: 'Wiring',           icon: '⚡', color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-100',    iconBg: 'bg-blue-100'    },
  { key: 'Fan Installation', icon: '🌀', color: 'text-indigo-600',  bg: 'bg-indigo-50',  border: 'border-indigo-100',  iconBg: 'bg-indigo-100'  },
  { key: 'AC Service',       icon: '❄️', color: 'text-cyan-600',    bg: 'bg-cyan-50',    border: 'border-cyan-100',    iconBg: 'bg-cyan-100'    },
  { key: 'Water Heater',     icon: '🚿', color: 'text-sky-600',     bg: 'bg-sky-50',     border: 'border-sky-100',     iconBg: 'bg-sky-100'     },
  { key: 'Panel Repair',     icon: '🔧', color: 'text-rose-600',    bg: 'bg-rose-50',    border: 'border-rose-100',    iconBg: 'bg-rose-100'    },
  { key: 'Smart Home',       icon: '📱', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', iconBg: 'bg-emerald-100' },
  { key: 'Emergency',        icon: '🚨', color: 'text-red-600',     bg: 'bg-red-50',     border: 'border-red-100',     iconBg: 'bg-red-100'     },
  { key: 'Other',            icon: '🔩', color: 'text-slate-600',   bg: 'bg-slate-50',   border: 'border-slate-200',   iconBg: 'bg-slate-100'   },
]

const BANNERS = [
  {
    id: 1,
    tag: 'Most Booked',
    title: 'AC Service at your doorstep!',
    desc: 'Gas refill, deep clean & more',
    bg: 'from-cyan-500 to-cyan-600',
    accent: 'bg-cyan-400',
    btn: 'bg-white text-cyan-700 hover:bg-cyan-50',
    img: '❄️',
    category: 'AC Service',
  },
  {
    id: 2,
    tag: 'Popular this season',
    title: 'Wiring & panel experts',
    desc: 'Fix short circuits instantly',
    bg: 'from-amber-400 to-orange-500',
    accent: 'bg-amber-300',
    btn: 'bg-white text-amber-700 hover:bg-amber-50',
    img: '⚡',
    category: 'Wiring',
  },
  {
    id: 3,
    tag: 'Safety first',
    title: 'No time for a short circuit?',
    desc: 'Get wiring fixed instantly',
    bg: 'from-blue-600 to-blue-700',
    accent: 'bg-blue-500',
    btn: 'bg-white text-blue-700 hover:bg-blue-50',
    img: '🔌',
    category: 'Wiring',
  },
  {
    id: 4,
    tag: 'Fast service',
    title: 'Fan installation same day',
    desc: 'Book now, done today',
    bg: 'from-emerald-500 to-emerald-600',
    accent: 'bg-emerald-400',
    btn: 'bg-white text-emerald-700 hover:bg-emerald-50',
    img: '🌀',
    category: 'Fan Installation',
  },
  {
    id: 5,
    tag: 'Emergency',
    title: 'Power trip? We fix it fast',
    desc: 'MCB & panel experts on call',
    bg: 'from-red-500 to-rose-600',
    accent: 'bg-red-400',
    btn: 'bg-white text-red-700 hover:bg-red-50',
    img: '🔧',
    category: 'Panel Repair',
  },
]

const POPULAR_SERVICES = [
  { title: 'Switch & Socket Repair',   price: '₹199', time: '30 min', icon: '🔌', category: 'Wiring'           },
  { title: 'Ceiling Fan Installation', price: '₹299', time: '45 min', icon: '🌀', category: 'Fan Installation' },
  { title: 'AC Gas Refilling',         price: '₹599', time: '60 min', icon: '❄️', category: 'AC Service'       },
  { title: 'MCB Replacement',          price: '₹349', time: '30 min', icon: '⚡', category: 'Panel Repair'     },
  { title: 'Geyser Installation',      price: '₹399', time: '45 min', icon: '🚿', category: 'Water Heater'     },
  { title: 'Emergency Wiring',         price: '₹499', time: '60 min', icon: '🚨', category: 'Emergency'        },
]

// ── Banner Slider ──────────────────────────────────────────
function BannerSlider({ onNavigate }) {
  const scrollRef = useRef()

  const scroll = (dir) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir === 'left' ? -380 : 380, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      <button
        onClick={() => scroll('left')}
        className="absolute -left-3 top-1/2 -translate-y-1/2 z-10
          w-9 h-9 bg-white rounded-full shadow-lg border border-slate-200
          flex items-center justify-center hover:bg-blue-50 hover:border-blue-300
          transition-all"
      >
        <FiChevronLeft className="text-slate-600" />
      </button>

      <button
        onClick={() => scroll('right')}
        className="absolute -right-3 top-1/2 -translate-y-1/2 z-10
          w-9 h-9 bg-white rounded-full shadow-lg border border-slate-200
          flex items-center justify-center hover:bg-blue-50 hover:border-blue-300
          transition-all"
      >
        <FiChevronRight className="text-slate-600" />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto px-1 py-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {BANNERS.map(b => (
          <div
            key={b.id}
            onClick={() => onNavigate('createRequest', b.category)}
            className={`
              bg-gradient-to-br ${b.bg}
              rounded-2xl p-6 cursor-pointer
              shrink-0 w-[340px]
              relative overflow-hidden
              hover:scale-[1.02] active:scale-[0.98]
              transition-transform duration-200
            `}
          >
            {/* decorative circles */}
            <div className={`absolute -top-6 -left-6 w-28 h-28 ${b.accent} rounded-full opacity-40`} />
            <div className={`absolute -bottom-8 -right-4 w-32 h-32 ${b.accent} rounded-full opacity-30`} />
            <div className={`absolute top-3 right-16 w-14 h-14 ${b.accent} rounded-full opacity-20`} />

            <div className="relative z-10 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <span className="inline-block text-[11px] font-bold px-2.5 py-1 rounded-lg mb-3 bg-white/20 text-white">
                  {b.tag}
                </span>
                <h3 className="text-lg font-bold text-white leading-snug mb-1">
                  {b.title}
                </h3>
                <p className="text-sm text-white/80 mb-5">
                  {b.desc}
                </p>
                <button className={`px-5 py-2 rounded-xl text-sm font-bold shadow-md transition-colors ${b.btn}`}>
                  Book Now
                </button>
              </div>
              <div className="text-6xl shrink-0 select-none">
                {b.img}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────
export default function Home({ onNavigate }) {
  const user = useSelector(s => s.auth.user)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-10 animate-fade-in pb-10">

      {/* ── Hero Banner ── */}
      <div className="relative bg-blue-600 rounded-2xl p-7 overflow-hidden">
        <div className="absolute -top-8 -right-8 w-48 h-48 bg-blue-500 rounded-full opacity-40" />
        <div className="absolute -bottom-10 right-10 w-32 h-32 bg-blue-700 rounded-full opacity-30" />
        <div className="absolute top-4 right-4 w-20 h-20 bg-blue-400 rounded-full opacity-20" />
        <div className="relative z-10">
          <p className="text-blue-200 text-sm mb-1">{greeting},</p>
          <h1 className="text-3xl font-bold text-white mb-2">
            {user?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="text-blue-100 text-sm mb-6 max-w-xs">
            Fast, verified electricians at your doorstep. Book in under 2 minutes.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => onNavigate('createRequest')}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 text-sm font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-md"
            >
              <FiZap className="text-base" />
              Book a Service
            </button>
            <button
              onClick={() => onNavigate('myRequests')}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/20 text-white text-sm font-semibold rounded-xl hover:bg-white/30 transition-colors"
            >
              My Requests
            </button>
          </div>
        </div>
      </div>

      {/* ── Trust bar ── */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { icon: FiClock,    value: '< 30 min', label: 'Avg arrival',      color: 'text-blue-600',    bg: 'bg-blue-50'    },
          { icon: FiShield,   value: '100%',     label: 'Verified experts', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { icon: FiStar,     value: '4.8 ★',    label: 'Average rating',   color: 'text-amber-600',   bg: 'bg-amber-50'   },
          { icon: FiThumbsUp, value: '10k+',     label: 'Happy customers',  color: 'text-indigo-600',  bg: 'bg-indigo-50'  },
        ].map(stat => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className={`${stat.bg} rounded-2xl p-4 text-center`}>
              <Icon className={`text-xl mx-auto mb-1 ${stat.color}`} />
              <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* ── Categories ── */}
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
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => onNavigate('createRequest', cat.key)}
              className={`
                relative flex flex-col items-center gap-3 p-5
                rounded-2xl border ${cat.border} ${cat.bg}
                hover:shadow-md hover:scale-[1.03] active:scale-[0.97]
                transition-all duration-200 group overflow-hidden
              `}
            >
              {/* decorative corner circle */}
              <div className={`absolute -top-5 -right-5 w-16 h-16 ${cat.iconBg} rounded-full opacity-60`} />

              {/* icon */}
              <div className={`relative z-10 w-14 h-14 ${cat.iconBg} rounded-2xl flex items-center justify-center
                group-hover:scale-110 transition-transform duration-200`}
              >
                <span className="text-3xl">{cat.icon}</span>
              </div>

              {/* label */}
              <span className="relative z-10 text-xs font-bold text-slate-700 text-center leading-tight">
                {cat.key}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Banner Slider ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-800">Offers & Services</h2>
          <span className="text-xs text-slate-400">Scroll to explore →</span>
        </div>
        <BannerSlider onNavigate={onNavigate} />
      </div>

      {/* ── Popular Services ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-800">Popular Services</h2>
          <button
            onClick={() => onNavigate('createRequest')}
            className="flex items-center gap-1 text-xs text-blue-600 font-semibold hover:underline"
          >
            See all <FiArrowRight className="text-xs" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {POPULAR_SERVICES.map(s => (
            <button
              key={s.title}
              onClick={() => onNavigate('createRequest', s.category)}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 text-left
                hover:shadow-md hover:border-blue-200 hover:scale-[1.02]
                active:scale-[0.98] transition-all duration-200 group"
            >
              <div className="text-3xl mb-3">{s.icon}</div>
              <h3 className="text-xs font-bold text-slate-800 mb-2 leading-snug">{s.title}</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-blue-600">{s.price}</span>
                <span className="flex items-center gap-1 text-[11px] text-slate-400">
                  <FiClock className="text-xs" />
                  {s.time}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── How it works ──
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-base font-bold text-slate-800 mb-5">How InstantFix Works</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { step: '1', icon: FiZap,         title: 'Book a Service', desc: 'Choose category and describe your issue'      },
            { step: '2', icon: FiCheckCircle, title: 'Get Matched',    desc: 'We find the nearest verified electrician'     },
            { step: '3', icon: FiThumbsUp,    title: 'Problem Solved', desc: 'Electrician arrives and fixes your issue'     },
          ].map(item => {
            const Icon = item.icon
            return (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Icon className="text-blue-600 text-xl" />
                </div>
                <p className="text-xs font-bold text-slate-800 mb-1">{item.title}</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            )
          })}
        </div>
      </div> */}

      {/* ── CTA Banner ── */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-center relative overflow-hidden">
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-500 rounded-full opacity-40" />
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-700 rounded-full opacity-30" />
        <div className="absolute top-4 right-20 w-14 h-14 bg-blue-400 rounded-full opacity-20" />
        <div className="relative z-10">
          <h2 className="text-lg font-bold text-white mb-2">Need help right now?</h2>
          <p className="text-sm text-blue-100 mb-5">
            Our electricians are available 24/7 for emergency services
          </p>
          <button
            onClick={() => onNavigate('createRequest', 'Emergency')}
            className="px-6 py-2.5 bg-white text-blue-700 text-sm font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-md"
          >
            🚨 Book Emergency Service
          </button>
        </div>
      </div>

    </div>
  )
}

