import { useNavigate } from 'react-router-dom'
import {
  FiZap, FiWind, FiSun, FiDroplet,
  FiTool, FiMonitor, FiAlertCircle, FiArrowRight
} from 'react-icons/fi'

const CATEGORIES = [
  {
    key:   'Wiring',
    icon:  FiZap,
    desc:  'New wiring, rewiring, short circuits & more',
    color: 'text-blue-600',
    bg:    'bg-blue-50',
    border:'border-blue-100',
    dot:   'bg-blue-600',
  },
  {
    key:   'Fan Installation',
    icon:  FiWind,
    desc:  'Ceiling fans, exhaust fans, repairs & balancing',
    color: 'text-indigo-600',
    bg:    'bg-indigo-50',
    border:'border-indigo-100',
    dot:   'bg-indigo-600',
  },
  {
    key:   'AC Service',
    icon:  FiSun,
    desc:  'Installation, gas refill, cleaning & repairs',
    color: 'text-amber-600',
    bg:    'bg-amber-50',
    border:'border-amber-100',
    dot:   'bg-amber-500',
  },
  {
    key:   'Water Heater',
    icon:  FiDroplet,
    desc:  'Geyser install, repair & thermostat fix',
    color: 'text-cyan-600',
    bg:    'bg-cyan-50',
    border:'border-cyan-100',
    dot:   'bg-cyan-500',
  },
  {
    key:   'Panel Repair',
    icon:  FiTool,
    desc:  'MCB, fuse box, switchboard & panel upgrades',
    color: 'text-rose-600',
    bg:    'bg-rose-50',
    border:'border-rose-100',
    dot:   'bg-rose-500',
  },
  {
    key:   'Smart Home',
    icon:  FiMonitor,
    desc:  'Smart switches, automation & device setup',
    color: 'text-emerald-600',
    bg:    'bg-emerald-50',
    border:'border-emerald-100',
    dot:   'bg-emerald-500',
  },
  {
    key:   'Emergency',
    icon:  FiAlertCircle,
    desc:  'Sparks, shocks, tripping & power failures',
    color: 'text-red-600',
    bg:    'bg-red-50',
    border:'border-red-100',
    dot:   'bg-red-500',
  },
  {
    key:   'Other',
    icon:  FiTool,
    desc:  'Any other electrical job not listed above',
    color: 'text-slate-600',
    bg:    'bg-slate-50',
    border:'border-slate-200',
    dot:   'bg-slate-400',
  },
]

export default function Categories() {
  const navigate = useNavigate()

  const handleBook = (categoryKey) => {
    // not logged in → go to register with category in state
    navigate('/register', { state: { category: categoryKey } })
  }

  return (
    <section id="categories" className="py-20 px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">

        {/* header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold px-4 py-2 rounded-full mb-4">
            Our Services
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
            What do you need{' '}
            <span className="text-blue-600">fixed today?</span>
          </h2>
          <p className="text-sm text-slate-400 mt-3 max-w-md mx-auto leading-relaxed">
            From quick fixes to full installations — our verified electricians
            handle every kind of electrical job at home.
          </p>
        </div>

        {/* grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIES.map(({ key, icon: Icon, desc, color, bg, border, dot }) => (
            <div
              key={key}
              onClick={() => handleBook(key)}
              className="bg-white rounded-2xl border border-slate-100 p-5 cursor-pointer hover:shadow-lg hover:shadow-slate-100 hover:-translate-y-1 transition-all duration-200 group"
            >
              {/* icon */}
              <div className={`w-12 h-12 ${bg} ${border} border rounded-2xl flex items-center justify-center mb-4`}>
                <Icon className={`${color} text-xl`} />
              </div>

              {/* title */}
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${dot} shrink-0`} />
                <h3 className="text-sm font-bold text-slate-800">{key}</h3>
              </div>

              {/* desc */}
              <p className="text-xs text-slate-400 leading-relaxed mb-4">{desc}</p>

              {/* book cta */}
              <div className={`flex items-center gap-1.5 text-xs font-semibold ${color} group-hover:gap-2.5 transition-all`}>
                Book Now
                <FiArrowRight className="text-xs" />
              </div>
            </div>
          ))}
        </div>

        {/* bottom cta */}
        <div className="text-center mt-12">
          <p className="text-sm text-slate-400 mb-4">
            Not sure what you need?
          </p>
          <button
            onClick={() => navigate('/register')}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-8 py-3.5 rounded-xl transition-colors shadow-lg shadow-blue-200"
          >
            Describe Your Problem
            <FiArrowRight className="text-base" />
          </button>
        </div>

      </div>
    </section>
  )
}