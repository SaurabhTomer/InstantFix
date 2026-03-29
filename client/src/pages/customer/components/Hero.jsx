import { useState } from 'react'
import { useSelector } from 'react-redux'
import { HiOutlineLocationMarker } from 'react-icons/hi'
import { MdElectricBolt } from 'react-icons/md'

const Hero = () => {
  const { user } = useSelector((state) => state.auth)

  return (
    <section className="bg-blue-600 px-6 py-12">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">

        {/* Left */}
        <div className="flex-1">

          {/* Location */}
          <div className="flex items-center gap-2 bg-blue-500 w-fit px-3 py-1.5 rounded-xl mb-4">
            <HiOutlineLocationMarker size={16} className="text-yellow-400" />
            <span className="text-blue-100 text-sm">Agra, Uttar Pradesh</span>
          </div>

          <h1 className="text-4xl font-bold text-white leading-tight">
            Hi {user?.name?.split(' ')[0] || 'there'}, <br />
            <span className="text-yellow-400">What do you need</span> <br />
            help with today?
          </h1>

          <p className="text-blue-200 mt-3 text-sm leading-relaxed">
            Certified electricians at your doorstep. <br />
            Available 24/7 for all electrical needs.
          </p>

          <button className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold px-6 py-3 rounded-xl text-sm transition-all duration-200">
            Get Started →
          </button>
        </div>

        {/* Right — Branding */}
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="bg-yellow-400 rounded-3xl p-8">
            <MdElectricBolt size={100} color="#1d4ed8" />
          </div>
          <p className="text-blue-200 text-xs mt-2 tracking-widest uppercase">
            InstantFix
          </p>
          <p className="text-blue-300 text-xs">
            Fast. Reliable. On Demand.
          </p>
        </div>

      </div>
    </section>
  )
}

export default Hero