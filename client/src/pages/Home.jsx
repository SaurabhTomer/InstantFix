import { Link } from 'react-router-dom'
import { MdElectricBolt } from 'react-icons/md'
import { HiOutlineLocationMarker, HiOutlineClock, HiOutlineShieldCheck } from 'react-icons/hi'
import { BsStarFill } from 'react-icons/bs'
import Logo from '../components/Logo'

const Home = () => {
  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
        <Logo size="sm" />
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm text-gray-600 hover:text-blue-600 transition">
            Login
          </Link>
          <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-xl transition">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-8 py-20 max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1">
          <span className="bg-yellow-100 text-yellow-700 text-xs font-medium px-3 py-1 rounded-full">
            On-Demand Electricians
          </span>
          <h1 className="text-5xl font-bold text-gray-900 mt-4 leading-tight">
            Get an Electrician <br />
            <span className="text-blue-600">At Your Doorstep</span>
          </h1>
          <p className="text-gray-500 mt-4 text-lg leading-relaxed">
            Connect with certified electricians near you. Fast, reliable, and available 24/7 for all your electrical needs.
          </p>
          <div className="flex gap-3 mt-8">
            <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition">
              Book Now
            </Link>
            <Link to="/register?role=electrician" className="border border-gray-200 hover:border-blue-600 text-gray-700 hover:text-blue-600 px-6 py-3 rounded-xl font-medium transition">
              Join as Electrician
            </Link>
          </div>
          <div className="flex gap-8 mt-10">
            <div>
              <p className="text-2xl font-bold text-gray-900">500+</p>
              <p className="text-gray-500 text-sm">Electricians</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">10k+</p>
              <p className="text-gray-500 text-sm">Jobs Done</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">4.9</p>
              <p className="text-gray-500 text-sm">Avg Rating</p>
            </div>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-blue-600 rounded-3xl p-12 flex items-center justify-center">
            <MdElectricBolt size={160} color="#facc15" />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-gray-50 px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How it Works</h2>
            <p className="text-gray-500 mt-2">Get help in 3 simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Book a Request', desc: 'Describe your electrical issue and submit a service request from anywhere.' },
              { step: '02', title: 'Get Matched', desc: 'We connect you with a nearby certified electrician available right now.' },
              { step: '03', title: 'Problem Solved', desc: 'Electrician arrives, fixes the issue. Pay only after the job is done.' }
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-2xl p-6 border border-gray-100">
                <span className="text-4xl font-bold text-blue-100">{item.step}</span>
                <h3 className="text-lg font-semibold text-gray-800 mt-2">{item.title}</h3>
                <p className="text-gray-500 text-sm mt-2 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="px-8 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Our Services</h2>
          <p className="text-gray-500 mt-2">We handle all kinds of electrical work</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '💡', title: 'Wiring & Rewiring' },
            { icon: '🔌', title: 'Switchboard Repair' },
            { icon: '❄️', title: 'AC Installation' },
            { icon: '🪫', title: 'Power Backup' },
            { icon: '🔦', title: 'Lighting Setup' },
            { icon: '🌀', title: 'Fan Installation' },
            { icon: '⚡', title: 'Short Circuit Fix' },
            { icon: '🏠', title: 'Home Inspection' }
          ].map((service, i) => (
            <div key={i} className="flex flex-col items-center gap-3 p-6 border border-gray-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50 transition cursor-pointer">
              <span className="text-3xl">{service.icon}</span>
              <p className="text-sm font-medium text-gray-700 text-center">{service.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why InstantFix?</h2>
            <p className="text-gray-500 mt-2">Everything you need, nothing you don't</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <HiOutlineLocationMarker size={28} className="text-blue-600" />,
                title: 'Nearby Electricians',
                desc: 'Find certified electricians closest to your location in real time.'
              },
              {
                icon: <HiOutlineClock size={28} className="text-blue-600" />,
                title: '24/7 Availability',
                desc: 'Emergency or planned — we are available round the clock, every day.'
              },
              {
                icon: <HiOutlineShieldCheck size={28} className="text-blue-600" />,
                title: 'Verified Professionals',
                desc: 'Every electrician is background checked and admin approved before joining.'
              }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-start gap-3 p-6 border border-gray-100 bg-white rounded-2xl hover:border-blue-200 transition">
                <div className="bg-blue-50 p-3 rounded-xl">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Electricians Section */}
      <section className="px-8 py-20 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1">
            <div className="bg-yellow-400 rounded-3xl p-12 flex items-center justify-center">
              <MdElectricBolt size={120} color="#1d4ed8" />
            </div>
          </div>
          <div className="flex-1">
            <span className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
              For Electricians
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-4 leading-tight">
              Grow Your Business <br />
              <span className="text-blue-600">With InstantFix</span>
            </h2>
            <p className="text-gray-500 mt-3 leading-relaxed">
              Join our platform and get access to hundreds of customers looking for skilled electricians every day.
            </p>
            <div className="mt-6 space-y-3">
              {[
                'Set your own hourly rate',
                'Work on your own schedule',
                'Get paid directly after job completion',
                'Build your reputation with reviews'
              ].map((point, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700 text-sm">{point}</p>
                </div>
              ))}
            </div>
            <Link to="/register?role=electrician" className="inline-block mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition">
              Join as Electrician
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">What People Say</h2>
            <p className="text-gray-500 mt-2">Trusted by thousands of customers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Rahul Sharma',
                location: 'Delhi',
                review: 'Got an electrician within 20 minutes! Fixed my short circuit issue quickly. Very professional service.',
                rating: 5
              },
              {
                name: 'Priya Mehta',
                location: 'Mumbai',
                review: 'Amazing experience. The electrician was verified, on time, and very affordable. Will use again!',
                rating: 5
              },
              {
                name: 'Amit Singh',
                location: 'Bangalore',
                review: 'InstantFix saved my day. AC installation done perfectly. Great platform for finding reliable help.',
                rating: 4
              }
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: item.rating }).map((_, j) => (
                    <BsStarFill key={j} size={14} className="text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">"{item.review}"</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {item.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-8 py-16 bg-blue-600 mx-8 rounded-3xl my-20 max-w-6xl lg:mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Ready to get started?</h2>
          <p className="text-blue-200 mt-2">Join thousands of happy customers today.</p>
          <div className="flex justify-center gap-4 mt-8">
            <Link to="/register" className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold px-6 py-3 rounded-xl transition">
              Book a Service
            </Link>
            <Link to="/register?role=electrician" className="bg-white hover:bg-gray-100 text-blue-600 font-semibold px-6 py-3 rounded-xl transition">
              Join as Electrician
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-8 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <p className="text-gray-400 text-sm">© 2024 InstantFix. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/login" className="text-sm text-gray-500 hover:text-blue-600 transition">Login</Link>
            <Link to="/register" className="text-sm text-gray-500 hover:text-blue-600 transition">Register</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}

export default Home