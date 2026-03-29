import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const categories = [
  { icon: '💡', title: 'Wiring & Rewiring', desc: 'Full home wiring' },
  { icon: '🔌', title: 'Switchboard', desc: 'Repair & installation' },
  { icon: '❄️', title: 'AC Services', desc: 'Install & repair' },
  { icon: '🌀', title: 'Fan Installation', desc: 'Ceiling & exhaust' },
  { icon: '🔦', title: 'Lighting', desc: 'Setup & repair' },
  { icon: '⚡', title: 'Short Circuit', desc: 'Emergency fix' },
  { icon: '🏠', title: 'Home Inspection', desc: 'Full checkup' },
  { icon: '🪫', title: 'Power Backup', desc: 'Inverter & UPS' }
]

const Categories = () => {


const navigate = useNavigate()

  const [selected, setSelected] = useState(null)

  return (
    <section className="px-6 py-10 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Our Services</h2>
          <p className="text-gray-500 text-sm mt-0.5">Select a category to get started</p>
        </div>
        <button className="text-sm text-blue-600 font-medium hover:underline">
          View All
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {categories.map((cat, i) => (
          <div
            key={i}
            onClick={() => setSelected(i)}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
              selected === i
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-100 bg-white hover:border-blue-200 hover:bg-blue-50'
            }`}
          >
            <span className="text-3xl">{cat.icon}</span>
            <p className={`text-xs font-medium text-center ${
              selected === i ? 'text-blue-600' : 'text-gray-700'
            }`}>
              {cat.title}
            </p>
            <p className="text-xs text-gray-400 text-center hidden lg:block">
              {cat.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Selected Category CTA */}
      {selected !== null && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-700">
              {categories[selected].icon} {categories[selected].title}
            </p>
            <p className="text-xs text-blue-500 mt-0.5">
              Ready to book this service?
            </p>
          </div>
          <button onClick={() => navigate('/customer/booking')} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-xl transition">
            Book Now
          </button>
        </div>
      )}
      

    </section>
  )
}

export default Categories