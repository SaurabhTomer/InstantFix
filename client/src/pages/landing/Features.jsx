import {
  FiShield, FiClock, FiStar, FiDollarSign,
  FiMapPin, FiSmartphone
} from 'react-icons/fi'

const FEATURES = [
  {
    icon:  FiShield,
    title: 'Verified Professionals',
    desc:  'Every electrician is background-checked, licensed, and approved by our team before joining the platform.',
    color: 'text-blue-600',
    bg:    'bg-blue-50',
    border:'border-blue-100',
  },
  {
    icon:  FiClock,
    title: '30 Minute Response',
    desc:  'Get a confirmed electrician assigned to your request within 30 minutes — any time of the day.',
    color: 'text-indigo-600',
    bg:    'bg-indigo-50',
    border:'border-indigo-100',
  },
  {
    icon:  FiStar,
    title: 'Rated & Reviewed',
    desc:  'Read real reviews from verified customers before your electrician arrives. Quality guaranteed.',
    color: 'text-amber-600',
    bg:    'bg-amber-50',
    border:'border-amber-100',
  },
  {
    icon:  FiDollarSign,
    title: 'Transparent Pricing',
    desc:  'No hidden charges. See the hourly rate upfront and pay online or cash after the job is done.',
    color: 'text-emerald-600',
    bg:    'bg-emerald-50',
    border:'border-emerald-100',
  },
  {
    icon:  FiMapPin,
    title: 'GPS Tracked',
    desc:  'Track your electrician in real time from acceptance to arrival. Always know where they are.',
    color: 'text-rose-600',
    bg:    'bg-rose-50',
    border:'border-rose-100',
  },
  {
    icon:  FiSmartphone,
    title: 'Easy to Use',
    desc:  'Book a service in under 2 minutes. Describe your problem, upload a photo, and you are done.',
    color: 'text-cyan-600',
    bg:    'bg-cyan-50',
    border:'border-cyan-100',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">

        {/* header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold px-4 py-2 rounded-full mb-4">
            Why InstantFix
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
            Everything you need,{' '}
            <span className="text-blue-600">nothing you don't</span>
          </h2>
          <p className="text-sm text-slate-400 mt-3 max-w-md mx-auto leading-relaxed">
            We built InstantFix to make home electrical service simple,
            safe, and stress-free for every Indian household.
          </p>
        </div>

        {/* grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc, color, bg, border }) => (
            <div
              key={title}
              className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-lg hover:shadow-slate-100 hover:-translate-y-1 transition-all duration-200 group"
            >
              {/* icon */}
              <div className={`w-12 h-12 ${bg} ${border} border rounded-2xl flex items-center justify-center mb-4`}>
                <Icon className={`${color} text-xl`} />
              </div>

              {/* text */}
              <h3 className="text-sm font-bold text-slate-800 mb-2">{title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* bottom stats bar */}
        <div className="mt-14 bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '10,000+', label: 'Happy Customers' },
              { value: '500+',    label: 'Verified Electricians' },
              { value: '4.9 ★',  label: 'Average Rating' },
              { value: '30 Min', label: 'Avg Response Time' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-blue-200 mt-1 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}