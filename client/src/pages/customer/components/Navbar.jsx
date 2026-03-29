import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { HiOutlineLocationMarker, HiOutlineChevronDown, HiOutlineSearch } from 'react-icons/hi'
import { MdElectricBolt } from 'react-icons/md'
import Logo from '../../../components/Logo'
import useUserLocation from '../../../hooks/useUserLocation'

const Navbar = () => {

   const location = useUserLocation();

  const [workDropdown, setWorkDropdown] = useState(false)
  const { user } = useSelector((state) => state.auth)

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">

        {/* Left — Logo */}
        <Logo size="sm" />

        {/* Center — Location + Search */}
        <div className="flex items-center gap-3 flex-1 max-w-2xl">

          {/* Location */}
            <div className="flex items-center gap-1 text-gray-600 cursor-pointer hover:text-blue-600 transition shrink-0">
            <HiOutlineLocationMarker size={18} className="text-blue-600" />
            {location.loading ? (
              <span className="text-sm text-gray-400">Fetching...</span>
            ) : (
              <span className="text-sm font-medium">{location.city}</span>
            )}
            <HiOutlineChevronDown size={14} />
          </div>

          <div className="w-px h-5 bg-gray-200" />

          {/* Search */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 flex-1 hover:border-blue-400 transition">
            <HiOutlineSearch size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search for services..."
              className="bg-transparent text-sm text-gray-700 outline-none w-full placeholder-gray-400"
            />
          </div>
        </div>

        {/* Right — Work Dropdown + Profile */}
        <div className="flex items-center gap-3">

          {/* Work Dropdown */}
          <div className="relative">
            <button
              onClick={() => setWorkDropdown(!workDropdown)}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 transition px-3 py-2 rounded-xl hover:bg-gray-50"
            >
              My Work
              <HiOutlineChevronDown size={14} className={`transition-transform ${workDropdown ? 'rotate-180' : ''}`} />
            </button>

            {workDropdown && (
              <div className="absolute right-0 top-11 bg-white border border-gray-100 rounded-2xl shadow-lg w-48 py-2 z-50">
                {[
                  { label: 'My Requests', path: '/customer/requests' },
                  { label: 'Active Job', path: '/customer/active' },
                  { label: 'History', path: '/customer/history' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setWorkDropdown(false)}
                    className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Profile */}
          <Link to="/customer/profile">
            <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold cursor-pointer hover:bg-blue-700 transition">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar