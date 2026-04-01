import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { HiOutlineHome, HiOutlineUsers, HiOutlineClipboardList, HiOutlineLogout } from 'react-icons/hi'
import { MdElectricBolt } from 'react-icons/md'
import { clearAuth } from '../../../store/slices/authSlice'
import axios from 'axios'

const Sidebar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { accessToken } = useSelector((state) => state.auth)

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
    { to: '/admin/dashboard', icon: <HiOutlineHome size={18} />, label: 'Dashboard' },
    { to: '/admin/electricians', icon: <MdElectricBolt size={18} />, label: 'Electricians' },
    { to: '/admin/requests', icon: <HiOutlineClipboardList size={18} />, label: 'Requests' },
    { to: '/admin/users', icon: <HiOutlineUsers size={18} />, label: 'Users' },
  ]

  return (
    <div className="w-56 min-h-screen bg-blue-600 flex flex-col">

      {/* Logo */}
      <div className="px-5 py-6 border-b border-blue-500">
        <div className="flex items-center gap-2">
          <div className="bg-yellow-400 rounded-lg p-1.5">
            <MdElectricBolt size={20} color="#1d4ed8" />
          </div>
          <span className="text-white font-bold text-base">InstantFix</span>
        </div>
        <p className="text-blue-200 text-xs mt-1">Admin Panel</p>
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
                  ? 'bg-white text-blue-600'
                  : 'text-blue-100 hover:bg-blue-500'
              }`
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-blue-500">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-blue-100 hover:bg-blue-500 w-full transition"
        >
          <HiOutlineLogout size={18} />
          Logout
        </button>
      </div>
    </div>
  )
}

export default Sidebar