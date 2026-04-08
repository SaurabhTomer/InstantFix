import { FiStar } from 'react-icons/fi'

const TESTIMONIALS = [
  {
    name:     'Amit Sharma',
    location: 'Delhi',
    text:     'Electrician came within 20 minutes. Fixed my AC wiring issue perfectly. The app is super easy to use and pricing was completely transparent. Highly recommend!',
    rating:   5,
    initials: 'AS',
    color:    'bg-blue-600',
    service:  'AC Service',
  },
  {
    name:     'Priya Mehta',
    location: 'Mumbai',
    text:     'Very professional service. The electrician was polite, wore shoe covers, and did a clean job. Zero mess left behind. Will definitely book again.',
    rating:   5,
    initials: 'PM',
    color:    'bg-emerald-600',
    service:  'Fan Installation',
  },
  {
    name:     'Rohit Gupta',
    location: 'Bangalore',
    text:     'Quick response, transparent pricing. No hidden charges whatsoever. Best electrical service app I have used. Got my panel repaired in under an hour.',
    rating:   5,
    initials: 'RG',
    color:    'bg-amber-600',
    service:  'Panel Repair',
  },
  {
    name:     'Sneha Iyer',
    location: 'Chennai',
    text:     'Had an emergency short circuit late at night. InstantFix sent someone within 25 minutes. Absolutely lifesaving service. Cannot thank them enough!',
    rating:   5,
    initials: 'SI',
    color:    'bg-rose-600',
    service:  'Emergency',
  },
  {
    name:     'Karan Malhotra',
    location: 'Hyderabad',
    text:     'Booked for smart home setup. The electrician was very knowledgeable and explained everything clearly. Competitive pricing and great quality work.',
    rating:   4,
    initials: 'KM',
    color:    'bg-indigo-600',
    service:  'Smart Home',
  },
  {
    name:     'Pooja Verma',
    location: 'Pune',
    text:     'Got my geyser installed in 45 minutes flat. Super professional, on time, and the app kept me updated throughout. 10 out of 10 experience.',
    rating:   5,
    initials: 'PV',
    color:    'bg-cyan-600',
    service:  'Water Heater',
  },
]

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <FiStar
          key={i}
          className={`text-xs ${
            i < rating
              ? 'text-amber-400 fill-amber-400'
              : 'text-slate-200'
          }`}
        />
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">

        {/* header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-100 text-amber-600 text-xs font-semibold px-4 py-2 rounded-full mb-4">
            ★ Customer Reviews
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
            Trusted by{' '}
            <span className="text-blue-600">10,000+ households</span>
          </h2>
          <p className="text-sm text-slate-400 mt-3 max-w-md mx-auto leading-relaxed">
            Real reviews from real customers. See why IndiaF trusts
            InstantFix for all their electrical needs.
          </p>
        </div>

        {/* grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map(t => (
            <div
              key={t.name}
              className="bg-white rounded-2xl border border-slate-100 p-6
                hover:shadow-lg hover:shadow-slate-100 hover:-translate-y-1
                transition-all duration-200"
            >
              {/* top row */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {/* avatar */}
                  <div className={`w-10 h-10 ${t.color} rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{t.name}</p>
                    <p className="text-[11px] text-slate-400">{t.location}</p>
                  </div>
                </div>
                <StarRating rating={t.rating} />
              </div>

              {/* review text */}
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                "{t.text}"
              </p>

              {/* service tag */}
              <div className="inline-block bg-blue-50 text-blue-600 text-[11px] font-semibold px-3 py-1 rounded-lg">
                {t.service}
              </div>
            </div>
          ))}
        </div>

        {/* bottom trust line */}
        <div className="mt-12 text-center">
          <p className="text-xs text-slate-400">
            All reviews are from verified customers who booked through InstantFix.
          </p>
          <div className="flex items-center justify-center gap-6 mt-6">
            {[
              { value: '4.9/5',   label: 'Average Rating'    },
              { value: '10,000+', label: 'Reviews'           },
              { value: '98%',     label: 'Would Recommend'   },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-xl font-bold text-slate-800">{value}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}