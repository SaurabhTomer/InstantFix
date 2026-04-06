import { Link, useNavigate } from 'react-router-dom'
import { FiZap, FiMenu, FiX } from 'react-icons/fi'
import { useState } from 'react'

export default function Navbar() {
  const navigate  = useNavigate()
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm shadow-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm shadow-blue-200">
            <FiZap className="text-white text-base" />
          </div>
          <span className="text-lg font-bold text-slate-800 tracking-tight">
            Instant<span className="text-blue-600">Fix</span>
          </span>
        </Link>

        {/* desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'Categories', 'How it Works', 'Testimonials'].map(item => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, '-')}`}
              className="text-sm text-slate-500 hover:text-blue-600 font-medium transition-colors"
            >
              {item}
            </a>
          ))}
        </div>

        {/* desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors px-4 py-2"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl transition-colors shadow-sm shadow-blue-200"
          >
            Get Started
          </Link>
        </div>

        {/* mobile hamburger */}
        <button
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
          onClick={() => setOpen(p => !p)}
        >
          {open ? <FiX className="text-base" /> : <FiMenu className="text-base" />}
        </button>
      </div>

      {/* mobile menu */}
      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white px-6 py-4 space-y-3 animate-fade-in">
          {['Features', 'Categories', 'How it Works', 'Testimonials'].map(item => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, '-')}`}
              onClick={() => setOpen(false)}
              className="block text-sm text-slate-600 hover:text-blue-600 font-medium py-1.5 transition-colors"
            >
              {item}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-3 border-t border-slate-100">
            <Link
              to="/login"
              className="w-full text-center text-sm font-semibold text-slate-700 border border-slate-200 rounded-xl py-2.5 hover:bg-slate-50 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="w-full text-center text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl py-2.5 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}