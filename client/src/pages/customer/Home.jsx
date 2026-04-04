import { useSelector } from 'react-redux'
import { useRef } from 'react'
import {
  FiZap, FiSun, FiWind, FiDroplet, FiTool,
  FiMonitor, FiAlertCircle, FiArrowRight,
  FiChevronLeft, FiChevronRight,
  FiShield, FiClock, FiStar, FiThumbsUp,
  FiCheckCircle, FiPhone,
} from 'react-icons/fi'

const CATEGORIES = [
  { key: 'Wiring',           icon: FiZap,         color: 'bg-blue-50 text-blue-600',     border: 'border-blue-100' },
  { key: 'Fan Installation', icon: FiWind,         color: 'bg-indigo-50 text-indigo-600', border: 'border-indigo-100' },
  { key: 'AC Service',       icon: FiSun,          color: 'bg-amber-50 text-amber-600',   border: 'border-amber-100' },
  { key: 'Water Heater',     icon: FiDroplet,      color: 'bg-cyan-50 text-cyan-600',     border: 'border-cyan-100' },
  { key: 'Panel Repair',     icon: FiTool,         color: 'bg-rose-50 text-rose-600',     border: 'border-rose-100' },
  { key: 'Smart Home',       icon: FiMonitor,      color: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100' },
  { key: 'Emergency',        icon: FiAlertCircle,  color: 'bg-red-50 text-red-600',       border: 'border-red-100' },
  { key: 'Other',            icon: FiTool,         color: 'bg-slate-50 text-slate-600',   border: 'border-slate-100' },
]

const BANNERS = [
  {
    id: 1,
    tag: 'Most Booked',
    title: 'AC Service at your doorstep!',
    desc: 'Gas refill, deep clean & more',
    bg: 'bg-cyan-500',
    btnBg: 'bg-white text-cyan-700',
    img: '❄️',
    category: 'AC Service',
  },
  {
    id: 2,
    tag: 'Popular this season',
    title: 'Wiring & panel experts',
    desc: 'Fix short circuits instantly',
    bg: 'bg-amber-400',
    btnBg: 'bg-white text-amber-700',
    img: '⚡',
    category: 'Wiring',
  },
  {
    id: 3,
    tag: 'Safety first',
    title: 'No time for a short circuit?',
    desc: 'Get wiring fixed instantly',
    bg: 'bg-blue-600',
    btnBg: 'bg-white text-blue-700',
    img: '🔌',
    category: 'Wiring',
  },
  {
    id: 4,
    tag: 'Fast service',
    title: 'Fan installation same day',
    desc: 'Book now, done today',
    bg: 'bg-emerald-500',
    btnBg: 'bg-white text-emerald-700',
    img: '🌀',
    category: 'Fan Installation',
  },
  {
    id: 5,
    tag: 'Emergency',
    title: 'Power trip? We fix it fast',
    desc: 'MCB & panel experts',
    bg: 'bg-red-500',
    btnBg: 'bg-white text-red-700',
    img: '🔧',
    category: 'Panel Repair',
  },
]

const POPULAR_SERVICES = [
  { title: 'Switch & Socket Repair',  price: '₹199',  time: '30 min',  icon: '🔌', category: 'Wiring' },
  { title: 'Ceiling Fan Installation', price: '₹299', time: '45 min',  icon: '🌀', category: 'Fan Installation' },
  { title: 'AC Gas Refilling',         price: '₹599', time: '60 min',  icon: '❄️', category: 'AC Service' },
  { title: 'MCB Replacement',          price: '₹349', time: '30 min',  icon: '⚡', category: 'Panel Repair' },
  { title: 'Geyser Installation',      price: '₹399', time: '45 min',  icon: '🚿', category: 'Water Heater' },
  { title: 'Emergency Wiring',         price: '₹499', time: '60 min',  icon: '🔧', category: 'Emergency' },
]

const TESTIMONIALS = [
  {
    name: 'Amit Sharma',
    location: 'Delhi',
    text: 'Electrician came within 20 minutes. Fixed my AC wiring issue perfectly. Highly recommend!',
    rating: 5,
    initials: 'AS',
    color: 'bg-blue-600',
  },
  {
    name: 'Priya Mehta',
    location: 'Mumbai',
    text: 'Very professional service. The electrician was polite and did a clean job. Will book again.',
    rating: 5,
    initials: 'PM',
    color: 'bg-emerald-600',
  },
  {
    name: 'Rohit Gupta',
    location: 'Bangalore',
    text: 'Quick response, transparent pricing. No hidden charges. Best electrical service app!',
    rating: 4,
    initials: 'RG',
    color: 'bg-amber-600',
  },
]

// ── Banner Slider ──────────────────────────────────────────
function BannerSlider({ onNavigate }) {
  const scrollRef = useRef()

  const scroll = (dir) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir === 'left' ? -340 : 340, behavior: 'smooth' })
  }

  return (
    <div className="relative px-4">
      {/* left arrow */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10
          w-8 h-8 bg-white rounded-full shadow-md border border-slate-200
          flex items-center justify-center hover:bg-blue-50 hover:border-blue-200
          transition-all"
      >
        <FiChevronLeft className="text-slate-600 text-sm" />
      </button>

      {/* right arrow */}
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10
          w-8 h-8 bg-white rounded-full shadow-md border border-slate-200
          flex items-center justify-center hover:bg-blue-50 hover:border-blue-200
          transition-all"
      >
        <FiChevronRight className="text-slate-600 text-sm" />
      </button>

      {/* scrollable strip */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {BANNERS.map(b => (
          <div
            key={b.id}
            onClick={() => onNavigate('createRequest', b.category)}
            className={`${b.bg} rounded-2xl p-5 flex items-center justify-between
              cursor-pointer hover:opacity-95 active:scale-95 transition-all
              shrink-0 w-[300px] sm:w-[360px] relative overflow-hidden`}
          >
            {/* decorative circles */}
            <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/10 rounded-full" />
            <div className="absolute -bottom-8 -right-2 w-20 h-20 bg-white/10 rounded-full" />
            <div className="absolute top-2 right-16 w-10 h-10 bg-white/10 rounded-full" />

            <div className="relative z-10 flex-1 min-w-0 pr-4">
              <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-lg mb-2 bg-white/20 text-white">
                {b.tag}
              </span>
              <h3 className="text-sm font-bold leading-snug mb-1 text-white">
                {b.title}
              </h3>
              <p className="text-xs mb-3 text-white/80">
                {b.desc}
              </p>
              <button className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${b.btnBg}`}>
                Book Now
              </button>
            </div>

            <div className="text-5xl shrink-0 relative z-10 select-none">
              {b.img}
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
          { icon: FiClock,       value: '< 30 min', label: 'Avg arrival',        color: 'text-blue-600',    bg: 'bg-blue-50' },
          { icon: FiShield,      value: '100%',     label: 'Verified experts',   color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { icon: FiStar,        value: '4.8 ★',    label: 'Average rating',     color: 'text-amber-600',   bg: 'bg-amber-50' },
          { icon: FiThumbsUp,    value: '10k+',     label: 'Happy customers',    color: 'text-indigo-600',  bg: 'bg-indigo-50' },
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
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 text-left hover:shadow-md hover:border-blue-200 transition-all group"
            >
              <div className="text-3xl mb-3">{s.icon}</div>
              <h3 className="text-xs font-bold text-slate-800 mb-2 leading-snug">
                {s.title}
              </h3>
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

      {/* ── How it works ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-base font-bold text-slate-800 mb-5">How InstantFix Works</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { step: '1', icon: FiZap,         title: 'Book a Service',     desc: 'Choose category and describe your issue' },
            { step: '2', icon: FiCheckCircle, title: 'Get Matched',        desc: 'We find the nearest verified electrician' },
            { step: '3', icon: FiThumbsUp,    title: 'Problem Solved',     desc: 'Electrician arrives and fixes your issue' },
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
      </div>

      {/* ── Why choose us ──
      <div>
        <h2 className="text-base font-bold text-slate-800 mb-4">Why Choose InstantFix?</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: FiShield,      title: 'Background Verified',  desc: 'All electricians are police verified & trained', color: 'text-blue-600',    bg: 'bg-blue-50' },
            { icon: FiClock,       title: 'Fast Response',        desc: 'Average 30 min arrival time guaranteed',         color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { icon: FiStar,        title: 'Top Rated',            desc: 'Only 4+ rated electricians on our platform',    color: 'text-amber-600',   bg: 'bg-amber-50' },
            { icon: FiPhone,       title: '24/7 Support',         desc: 'Round the clock customer support available',     color: 'text-indigo-600',  bg: 'bg-indigo-50' },
          ].map(item => {
            const Icon = item.icon
            return (
              <div key={item.title} className={`${item.bg} rounded-2xl p-4`}>
                <div className={`w-9 h-9 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm`}>
                  <Icon className={`text-base ${item.color}`} />
                </div>
                <p className="text-xs font-bold text-slate-800 mb-1">{item.title}</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            )
          })}
        </div>
      </div> */}

      {/* ── Testimonials ──
      <div>
        <h2 className="text-base font-bold text-slate-800 mb-4">What Customers Say</h2>
        <div className="space-y-3">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 ${t.color} rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                  {t.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{t.name}</p>
                      <p className="text-[11px] text-slate-400">{t.location}</p>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FiStar
                          key={i}
                          className={`text-xs ${i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">"{t.text}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div> */}

      {/* ── CTA Banner ── */}
      <div className="bg-blue-600 rounded-2xl p-6 text-center relative overflow-hidden">
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-500 rounded-full opacity-40" />
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-700 rounded-full opacity-30" />
        <div className="relative z-10">
          <h2 className="text-lg font-bold text-white mb-2">
            Need help right now?
          </h2>
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