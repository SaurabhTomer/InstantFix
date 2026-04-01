import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { HiOutlineArrowLeft, HiOutlinePencil, HiOutlineLogout } from 'react-icons/hi'
import { clearAuth, setUser } from '../../store/slices/authSlice'
import useFetchProfile from '../../hooks/useFetchProfile'

const Profile = () => {

  useFetchProfile()

  const { user, accessToken } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  })

  const [avatar, setAvatar] = useState(null)
  const [preview, setPreview] = useState(user?.avatar || '')

  // handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // image change
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setAvatar(file)

    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // update profile
  const handleUpdate = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const data = new FormData()
      data.append('name', formData.name)
      data.append('phone', formData.phone)

      if (avatar) {
        data.append('avatar', avatar)
      }

      const res = await axios.put(
        'http://localhost:5000/api/auth/update-profile',
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          withCredentials: true
        }
      )

      dispatch(setUser({ user: res.data.user, accessToken }))
      setSuccess('Profile updated successfully 🚀')
      setEditing(false)

    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // logout
  const handleLogout = async () => {
    try {
      await axios.post(
        'http://localhost:5000/api/auth/logout',
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true
        }
      )
    } catch (err) {
      console.log(err)
    } finally {
      dispatch(clearAuth())
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/customer/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-xl transition"
          >
            <HiOutlineArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-base font-bold text-gray-800">My Profile</h1>
        </div>

        <button
          onClick={() => setEditing(!editing)}
          className="flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:bg-blue-50 px-3 py-1.5 rounded-xl transition"
        >
          <HiOutlinePencil size={15} />
          {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      <div className="max-w-xl mx-auto px-6 py-8 space-y-4">

        {/* Avatar Section */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center text-center">

          <div className="flex flex-col items-center mb-3">
            <img
              src={preview || 'https://via.placeholder.com/100'}
              className="w-20 h-20 rounded-full object-cover border mb-2"
            />

            {editing && (
              <label className="text-xs text-blue-600 cursor-pointer hover:underline">
                Change Photo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>

          <h2 className="text-lg font-bold text-gray-800">{user?.name}</h2>
          <p className="text-sm text-gray-400 mt-0.5">{user?.email}</p>

          <span className="mt-2 bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
            {user?.role || 'Customer'}
          </span>
        </div>

        {/* Error / Success */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <p className="text-green-600 text-sm">{success}</p>
          </div>
        )}

        {/* Profile Details */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">

          <h3 className="text-sm font-semibold text-gray-700">
            Personal Information
          </h3>

          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Full Name
            </label>

            {editing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-sm text-gray-800 font-medium">{user?.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Email
            </label>
            <p className="text-sm text-gray-800 font-medium">{user?.email}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Email cannot be changed
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Phone
            </label>

            {editing ? (
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-sm text-gray-800 font-medium">
                {user?.phone || 'Not added'}
              </p>
            )}
          </div>

          {/* Save Button */}
          {editing && (
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl text-sm transition disabled:opacity-60"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-3 rounded-2xl text-sm transition border border-red-100"
        >
          <HiOutlineLogout size={18} />
          Logout
        </button>

      </div>
    </div>
  )
}

export default Profile