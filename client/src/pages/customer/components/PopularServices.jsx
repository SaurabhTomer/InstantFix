const services = [
  {
    icon: '💡',
    title: 'Full Home Wiring',
    category: 'Wiring',
    price: '₹499',
    time: '2-3 hrs',
    rating: 4.8,
    reviews: 234
  },
  {
    icon: '🔌',
    title: 'Switchboard Repair',
    category: 'Switchboard',
    price: '₹199',
    time: '1 hr',
    rating: 4.9,
    reviews: 189
  },
  {
    icon: '❄️',
    title: 'AC Installation',
    category: 'AC Services',
    price: '₹699',
    time: '2-4 hrs',
    rating: 4.7,
    reviews: 312
  },
  {
    icon: '🌀',
    title: 'Fan Installation',
    category: 'Fan',
    price: '₹149',
    time: '30 min',
    rating: 4.9,
    reviews: 421
  },
  {
    icon: '⚡',
    title: 'Short Circuit Fix',
    category: 'Emergency',
    price: '₹299',
    time: '1-2 hrs',
    rating: 4.8,
    reviews: 156
  },
  {
    icon: '🔦',
    title: 'Lighting Setup',
    category: 'Lighting',
    price: '₹249',
    time: '1-2 hrs',
    rating: 4.6,
    reviews: 98
  }
]

const PopularServices = () => {
  return (
    <section className="bg-gray-50 px-6 py-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Popular Services</h2>
            <p className="text-gray-500 text-sm mt-0.5">Most booked by customers near you</p>
          </div>
          <button className="text-sm text-blue-600 font-medium hover:underline">
            View All
          </button>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {services.map((service, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-blue-200 hover:shadow-sm transition-all duration-200 cursor-pointer"
            >
              {/* Top */}
              <div className="flex items-start justify-between mb-4">
                <div className="bg-blue-50 p-3 rounded-xl text-2xl">
                  {service.icon}
                </div>
                <span className="bg-yellow-100 text-yellow-700 text-xs font-medium px-2.5 py-1 rounded-full">
                  {service.category}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-sm font-semibold text-gray-800">{service.title}</h3>

              {/* Rating */}
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="text-yellow-400 text-xs">★</span>
                <span className="text-xs font-medium text-gray-700">{service.rating}</span>
                <span className="text-xs text-gray-400">({service.reviews} reviews)</span>
              </div>

              {/* Bottom */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                <div>
                  <p className="text-xs text-gray-400">Starting from</p>
                  <p className="text-base font-bold text-blue-600">{service.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Duration</p>
                  <p className="text-xs font-medium text-gray-600">{service.time}</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-xl transition">
                  Book
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PopularServices