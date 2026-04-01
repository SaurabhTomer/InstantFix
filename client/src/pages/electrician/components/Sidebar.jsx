import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { HiOutlineHome, HiOutlineClipboardList, HiOutlineBriefcase, HiOutlineUser, HiOutlineLogout } from 'react-icons/hi'
import { MdElectricBolt } from 'react-icons/md'
import { clearAuth } from '../../../store/slices/authSlice'
import axios from 'axios'

const Sidebar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { accessToken, user } = useSelector((state) => state.auth)

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true
      })
    } catch (err) {
      console.log(err)
    } finally {
      dispatch(clearAuth())
      navigate('/login')
    }
  }

  const links = [
    { to: '/electrician/dashboard', icon: <HiOutlineHome size={18} />, label: 'Dashboard' },
    { to: '/electrician/jobs', icon: <HiOutlineBriefcase size={18} />, label: 'Available Jobs' },
    { to: '/electrician/my-jobs', icon: <HiOutlineClipboardList size={18} />, label: 'My Jobs' },
    { to: '/electrician/profile', icon: <HiOutlineUser size={18} />, label: 'Profile' },
  ]

  return (
    <div className="w-60 min-h-screen bg-gray-900 flex flex-col">

      {/* Logo */}
      <div className="px-5 py-6 border-b border-gray-800">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-yellow-400 rounded-lg p-1.5">
            <MdElectricBolt size={20} color="#1d4ed8" />
          </div>
          <span className="text-white font-bold text-base">InstantFix</span>
        </div>

        {/* Profile mini */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-white text-sm font-medium">{user?.name}</p>
            <p className="text-gray-400 text-xs">Electrician</p>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-yellow-400 text-gray-900'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white w-full transition"
        >
          <HiOutlineLogout size={18} />
          Logout
        </button>
      </div>
    </div>
  )
}

export default Sidebar