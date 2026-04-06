import { useNavigate } from 'react-router-dom'
import {
  FiZap, FiStar, FiShield, FiClock, FiArrowRight, FiMapPin
} from 'react-icons/fi'

export default function Hero() {
  const navigate = useNavigate()

  return (
    <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* left — text */}
          <div className="space-y-6">

            {/* badge */}
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold px-4 py-2 rounded-full">
              <FiZap className="text-sm" />
              #1 Electrician Service in India
            </div>

            {/* heading */}
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 leading-tight tracking-tight">
              Expert Electricians{' '}
              <span className="text-blue-600">At Your Door</span>{' '}
              in Minutes
            </h1>

            {/* subtext */}
            <p className="text-base text-slate-500 leading-relaxed max-w-md">
              Book verified, background-checked electricians for any job —
              from fan installation to full panel repair. Fast, safe, and affordable.
            </p>

            {/* trust pills */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: FiStar,   text: '4.9 Avg Rating' },
                { icon: FiShield, text: 'Verified Pros' },
                { icon: FiClock,  text: '30 Min Response' },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 text-xs font-semibold px-3 py-2 rounded-xl shadow-sm"
                >
                  <Icon className="text-blue-500 text-sm shrink-0" />
                  {text}
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => navigate('/register')}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-6 py-3.5 rounded-xl transition-colors shadow-lg shadow-blue-200"
              >
                Book a Service
                <FiArrowRight className="text-base" />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold px-6 py-3.5 rounded-xl border border-slate-200 transition-colors"
              >
                Sign In
              </button>
            </div>

            {/* social proof */}
            <p className="text-xs text-slate-400">
              Trusted by <span className="font-semibold text-slate-600">10,000+</span> homeowners across India
            </p>
          </div>

          {/* right — visual card */}
          <div className="hidden md:flex justify-center">
            <div className="relative w-full max-w-sm">

              {/* main card */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/60 p-6 space-y-4">

                {/* header */}
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-slate-700">Service Request</p>
                  <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-lg">
                    ● Active
                  </span>
                </div>

                {/* category */}
                <div className="flex items-center gap-3 bg-blue-50 rounded-2xl px-4 py-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <FiZap className="text-white text-base" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Fan Installation</p>
                    <p className="text-xs text-slate-500 mt-0.5">Ceiling fan · 1 unit</p>
                  </div>
                </div>

                {/* electrician */}
                <div className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0">
                    RK
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800">Rahul Kumar</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      {[1,2,3,4,5].map(s => (
                        <FiStar key={s} className="text-amber-400 text-xs fill-amber-400" />
                      ))}
                      <span className="text-xs text-slate-400 ml-1">5.0</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                    On Way
                  </span>
                </div>

                {/* location */}
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <FiMapPin className="text-blue-400 shrink-0" />
                  Sector 62, Noida, Uttar Pradesh
                </div>

                {/* progress bar */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1.5">
                    <span>Progress</span>
                    <span>On the way</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full w-2/3 transition-all" />
                  </div>
                </div>
              </div>

              {/* floating badge — top right */}
              <div className="absolute -top-4 -right-4 bg-white border border-slate-100 shadow-lg rounded-2xl px-3 py-2 flex items-center gap-2">
                <div className="w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <FiShield className="text-white text-xs" />
                </div>
                <span className="text-xs font-semibold text-slate-700">Verified Pro</span>
              </div>

              {/* floating badge — bottom left */}
              <div className="absolute -bottom-4 -left-4 bg-white border border-slate-100 shadow-lg rounded-2xl px-3 py-2 flex items-center gap-2">
                <FiClock className="text-blue-500 text-sm shrink-0" />
                <span className="text-xs font-semibold text-slate-700">Arrives in 28 min</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}