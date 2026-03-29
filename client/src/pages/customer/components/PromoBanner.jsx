import { useState, useEffect } from 'react'
import { MdElectricBolt } from 'react-icons/md'
import { HiOutlineArrowRight, HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi'

const banners = [
  {
    tag: '24/7 Available',
    title: 'AC not cooling?',
    highlight: 'Get it fixed today.',
    desc: 'Certified technicians at your doorstep within 30 minutes.',
    emoji: '❄️',
    service: 'AC',
    bg: 'bg-blue-600',
    tagBg: 'bg-yellow-400',
    tagText: 'text-blue-900',
    highlight_color: 'text-yellow-400',
    desc_color: 'text-blue-200',
    unit_text: 'text-blue-400'
  },
  {
    tag: 'Emergency Service',
    title: 'Short circuit?',
    highlight: 'We fix it fast.',
    desc: 'Expert electricians handle all emergency electrical issues.',
    emoji: '⚡',
    service: 'Wiring',
    bg: 'bg-gray-900',
    tagBg: 'bg-red-500',
    tagText: 'text-white',
    highlight_color: 'text-red-400',
    desc_color: 'text-gray-400',
    unit_text: 'text-red-400'
  },
  {
    tag: 'Best Price',
    title: 'Fan installation',
    highlight: 'Starting at ₹149.',
    desc: 'Quick and affordable fan installation by verified experts.',
    emoji: '🌀',
    service: 'Fan',
    bg: 'bg-teal-600',
    tagBg: 'bg-white',
    tagText: 'text-teal-600',
    highlight_color: 'text-yellow-300',
    desc_color: 'text-teal-100',
    unit_text: 'text-teal-300'
  },
  {
    tag: 'Most Popular',
    title: 'Home wiring issues?',
    highlight: 'Call an expert now.',
    desc: 'Full home wiring inspection and repair by certified professionals.',
    emoji: '🏠',
    service: 'Wiring',
    bg: 'bg-purple-700',
    tagBg: 'bg-yellow-400',
    tagText: 'text-purple-900',
    highlight_color: 'text-yellow-300',
    desc_color: 'text-purple-200',
    unit_text: 'text-purple-300'
  }
]

const PromoBanner = () => {
  const [current, setCurrent] = useState(0)

  // auto slide every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const prev = () => setCurrent((prev) => (prev - 1 + banners.length) % banners.length)
  const next = () => setCurrent((prev) => (prev + 1) % banners.length)

  const banner = banners[current]

  return (
    <section className="px-6 py-6 max-w-7xl mx-auto">
      <div className={`${banner.bg} rounded-3xl px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative transition-all duration-500`}>

        {/* Left Content */}
        <div className="flex-1 z-10">
          <span className={`${banner.tagBg} ${banner.tagText} text-xs font-semibold px-3 py-1 rounded-full`}>
            {banner.tag}
          </span>
          <h2 className="text-2xl font-bold text-white mt-3 leading-tight">
            {banner.title} <br />
            <span className={banner.highlight_color}>{banner.highlight}</span>
          </h2>
          <p className={`${banner.desc_color} text-sm mt-2`}>
            {banner.desc}
          </p>
          <button className="mt-5 flex items-center gap-2 bg-white hover:bg-gray-100 text-blue-600 font-semibold text-sm px-5 py-2.5 rounded-xl transition">
            Book Now
            <HiOutlineArrowRight size={16} />
          </button>
        </div>

        {/* Right — Illustration */}
        <div className="relative flex items-center justify-center z-10">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-yellow-300 rounded-full border-4 border-yellow-400 flex items-center justify-center">
              <span className="text-xl">👷</span>
            </div>
            <div className="w-16 h-20 bg-blue-400 rounded-t-2xl mt-1 flex items-center justify-center relative">
              <MdElectricBolt size={24} color="#facc15" />
              <div className="absolute -right-6 top-4 w-10 h-2 bg-gray-300 rounded-full rotate-45" />
            </div>
            <div className="flex gap-2">
              <div className="w-6 h-10 bg-gray-700 rounded-b-xl" />
              <div className="w-6 h-10 bg-gray-700 rounded-b-xl" />
            </div>
          </div>

          {/* Service Unit */}
          <div className="ml-6 bg-white rounded-2xl p-4 border-2 border-blue-300 flex flex-col items-center gap-1">
            <div className="w-20 h-8 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
              <span className="text-xs text-gray-500 font-medium">{banner.emoji} {banner.service}</span>
            </div>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-5 h-1 bg-blue-200 rounded-full" />
              ))}
            </div>
            <p className={`text-xs font-medium ${banner.unit_text}`}>Fixing...</p>
          </div>

          {/* Decorative */}
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-white rounded-full opacity-10" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-yellow-400 rounded-full opacity-20" />
        </div>

        {/* Prev / Next Buttons */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-1.5 rounded-lg transition z-20"
        >
          <HiOutlineChevronLeft size={14} />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-1.5 rounded-lg transition z-20"
        >
          <HiOutlineChevronRight size={14} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-white' : 'w-1.5 bg-white opacity-40'
                }`}
            />
          ))}
        </div>

      </div>
    </section>
  )
}

export default PromoBanner