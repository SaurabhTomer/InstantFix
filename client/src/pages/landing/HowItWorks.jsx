import { useNavigate } from 'react-router-dom'
import {
  FiUserPlus, FiFileText, FiZap,
  FiCheckCircle, FiArrowRight, FiArrowDown
} from 'react-icons/fi'

const STEPS = [
  {
    step:  '01',
    icon:  FiUserPlus,
    title: 'Create an Account',
    desc:  'Sign up in under a minute. No lengthy forms — just your name, email, and phone number.',
    color: 'text-blue-600',
    bg:    'bg-blue-50',
    border:'border-blue-100',
    num:   'bg-blue-600',
  },
  {
    step:  '02',
    icon:  FiFileText,
    title: 'Describe Your Problem',
    desc:  'Select a service category, describe the issue, upload photos if needed, and share your location.',
    color: 'text-indigo-600',
    bg:    'bg-indigo-50',
    border:'border-indigo-100',
    num:   'bg-indigo-600',
  },
  {
    step:  '03',
    icon:  FiZap,
    title: 'Get Matched Instantly',
    desc:  'We find the nearest verified electrician and assign them to your request within minutes.',
    color: 'text-amber-600',
    bg:    'bg-amber-50',
    border:'border-amber-100',
    num:   'bg-amber-500',
  },
  {
    step:  '04',
    icon:  FiCheckCircle,
    title: 'Job Done & Pay',
    desc:  'Your electrician arrives, completes the job, and you pay online or cash — only after you are satisfied.',
    color: 'text-emerald-600',
    bg:    'bg-emerald-50',
    border:'border-emerald-100',
    num:   'bg-emerald-500',
  },
]

export default function HowItWorks() {
  const navigate = useNavigate()

  return (
    <section id="how-it-works" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">

        {/* header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold px-4 py-2 rounded-full mb-4">
            How It Works
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
            Book a service in{' '}
            <span className="text-blue-600">4 simple steps</span>
          </h2>
          <p className="text-sm text-slate-400 mt-3 max-w-md mx-auto leading-relaxed">
            We made the process as simple as possible so you spend less
            time booking and more time getting things fixed.
          </p>
        </div>

        {/* desktop steps — horizontal */}
        <div className="hidden md:grid grid-cols-4 gap-6 relative">

          {/* connector line */}
          <div className="absolute top-10 left-[12.5%] right-[12.5%] h-px bg-slate-100 z-0" />

          {STEPS.map(({ step, icon: Icon, title, desc, color, bg, border, num }) => (
            <div key={step} className="relative z-10 flex flex-col items-center text-center group">

              {/* icon circle */}
              <div className={`w-20 h-20 ${bg} ${border} border-2 rounded-3xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-200 relative`}>
                <Icon className={`${color} text-2xl`} />
                {/* step number badge */}
                <div className={`absolute -top-2.5 -right-2.5 w-6 h-6 ${num} rounded-lg flex items-center justify-center`}>
                  <span className="text-[10px] font-bold text-white">{step}</span>
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-800 mb-2">{title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* mobile steps — vertical */}
        <div className="md:hidden space-y-4">
          {STEPS.map(({ step, icon: Icon, title, desc, color, bg, border, num }, i) => (
            <div key={step}>
              <div className="flex gap-4 bg-slate-50 rounded-2xl p-5 border border-slate-100">
                {/* icon */}
                <div className={`w-12 h-12 ${bg} ${border} border rounded-2xl flex items-center justify-center shrink-0 relative`}>
                  <Icon className={`${color} text-lg`} />
                  <div className={`absolute -top-2 -right-2 w-5 h-5 ${num} rounded-md flex items-center justify-center`}>
                    <span className="text-[9px] font-bold text-white">{step}</span>
                  </div>
                </div>

                {/* text */}
                <div>
                  <h3 className="text-sm font-bold text-slate-800 mb-1">{title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
                </div>
              </div>

              {/* arrow between steps */}
              {i < STEPS.length - 1 && (
                <div className="flex justify-center my-1">
                  <FiArrowDown className="text-slate-300 text-base" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* bottom CTA */}
        <div className="mt-14 bg-gradient-to-br from-slate-50 to-blue-50 border border-blue-100 rounded-3xl p-8 text-center">
          <h3 className="text-xl font-bold text-slate-800 mb-2">
            Ready to get started?
          </h3>
          <p className="text-sm text-slate-400 mb-6 max-w-sm mx-auto">
            Join thousands of happy homeowners who trust InstantFix
            for all their electrical needs.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-8 py-3.5 rounded-xl transition-colors shadow-lg shadow-blue-200"
          >
            Get Started Free
            <FiArrowRight className="text-base" />
          </button>
        </div>

      </div>
    </section>
  )
}