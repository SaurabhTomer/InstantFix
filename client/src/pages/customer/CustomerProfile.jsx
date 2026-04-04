import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setUser } from '../../store/slices/authSlice'
import { setProfileSaving, showToast } from '../../store/slices/customerSlice'
import { PageLoader } from '../../components/shared/Spinner'
import {
  FiUser, FiPhone, FiMail, FiEdit2,
  FiSave, FiCamera, FiX,
} from 'react-icons/fi'
import { useRef } from 'react'

const inputCls = `
  w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl
  text-sm text-slate-700 placeholder-slate-300
  focus:outline-none focus:border-blue-400 focus:bg-white transition-colors
`
const readCls = `
  w-full px-4 py-2.5 bg-slate-100 border border-slate-100 rounded-xl
  text-sm text-slate-400 cursor-not-allowed
`

export default function CustomerProfile() {
  const dispatch    = useDispatch()
  const accessToken = useSelector(s => s.auth.accessToken)
  const user        = useSelector(s => s.auth.user)
  const profileSaving = useSelector(s => s.customer.profileSaving)

  const [name,        setName]        = useState('')
  const [phone,       setPhone]       = useState('')
  const [avatarFile,  setAvatarFile]  = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [loading,     setLoading]     = useState(false)

  const fileRef = useRef()

  useEffect(() => {
    if (user) {
      setName(user.name   || '')
      setPhone(user.phone || '')
    }
  }, [user])

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const removeAvatar = () => {
    setAvatarFile(null)
    setAvatarPreview(null)
    fileRef.current.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(setProfileSaving(true))
    try {
      const formData = new FormData()
      formData.append('name',  name)
      formData.append('phone', phone)
      if (avatarFile) formData.append('avatar', avatarFile)

      const res = await axios.put(
        'http://localhost:5000/api/auth/update-profile',
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      )

      // update redux auth state with new user data
      dispatch(setUser({
        user:        res.data.user,
        accessToken: accessToken,
      }))

      setAvatarFile(null)
      setAvatarPreview(null)

      dispatch(showToast({ msg: 'Profile updated successfully!', type: 'success' }))
    } catch (err) {
      dispatch(showToast({
        msg: err.response?.data?.message || 'Failed to update profile',
        type: 'error',
      }))
    } finally {
      dispatch(setProfileSaving(false))
    }
  }

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'CU'

  const currentAvatar = avatarPreview || user?.avatar

  return (
    <div className="space-y-5 animate-fade-in max-w-lg">

      {/* header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">My Profile</h1>
        <p className="text-xs text-slate-400 mt-0.5">Manage your account information</p>
      </div>

      {/* avatar card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

        {/* blue strip */}
        <div className="h-20 bg-linear-to-r from-blue-600 to-blue-500" />

        <div className="px-5 pb-5">
          <div className="flex items-end gap-4 -mt-8 mb-4">
            {/* avatar */}
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-2xl border-4 border-white shadow-md overflow-hidden">
                {currentAvatar ? (
                  <img
                    src={currentAvatar} alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-600 flex items-center justify-center">
                    <span className="text-white text-lg font-bold">{initials}</span>
                  </div>
                )}
              </div>

              {/* camera button */}
              <button
                type="button"
                onClick={() => fileRef.current.click()}
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center shadow-sm transition-colors"
              >
                <FiCamera className="text-[10px]" />
              </button>
            </div>

            {/* name + role */}
            <div className="mb-1">
              <p className="text-base font-bold text-slate-800">{user?.name}</p>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-lg">
                Customer
              </span>
            </div>

            {/* remove preview button */}
            {avatarPreview && (
              <button
                type="button"
                onClick={removeAvatar}
                className="ml-auto flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 transition-colors"
              >
                <FiX className="text-xs" />
                Remove
              </button>
            )}
          </div>

          <p className="text-xs text-slate-400">
            {user?.email}
          </p>
        </div>
      </div>

      {/* hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarChange}
      />

      {/* edit form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">

        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <FiEdit2 className="text-blue-500 text-sm" />
          <h3 className="text-sm font-bold text-slate-700">Edit Information</h3>
        </div>

        {/* name */}
        <div>
          <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            <FiUser className="text-slate-300 text-xs" />
            Full Name
          </label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className={inputCls}
            placeholder="Your full name"
            required
          />
        </div>

        {/* phone */}
        <div>
          <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            <FiPhone className="text-slate-300 text-xs" />
            Phone Number
          </label>
          <input
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className={inputCls}
            placeholder="+91 XXXXX XXXXX"
          />
        </div>

        {/* email — readonly */}
        <div>
          <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            <FiMail className="text-slate-300 text-xs" />
            Email Address
          </label>
          <input
            value={user?.email || ''}
            className={readCls}
            readOnly
          />
          <p className="text-[11px] text-slate-400 mt-1">Email cannot be changed</p>
        </div>

        {/* new avatar preview */}
        {avatarPreview && (
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
            <img
              src={avatarPreview} alt=""
              className="w-10 h-10 rounded-xl object-cover border border-blue-200"
            />
            <div>
              <p className="text-xs font-semibold text-blue-700">New photo selected</p>
              <p className="text-[11px] text-blue-500 mt-0.5">
                {avatarFile?.name}
              </p>
            </div>
            <button
              type="button"
              onClick={removeAvatar}
              className="ml-auto text-blue-400 hover:text-blue-600 transition-colors"
            >
              <FiX className="text-sm" />
            </button>
          </div>
        )}

        {/* save button */}
        <button
          type="submit"
          disabled={profileSaving}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60 shadow-sm shadow-blue-200"
        >
          {profileSaving ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <FiSave className="text-base" />
              Save Changes
            </>
          )}
        </button>
      </form>

      {/* account info card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Account Info
        </h3>
        <div className="space-y-2.5">
          {[
            { label: 'Account Type', value: 'Customer' },
            { label: 'Member Since', value: user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
                : '—'
            },
            { label: 'User ID', value: user?._id?.slice(-8).toUpperCase() || '—', mono: true },
          ].map(row => (
            <div key={row.label} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
              <span className="text-xs text-slate-400">{row.label}</span>
              <span className={`text-xs font-semibold text-slate-700 ${row.mono ? 'font-mono' : ''}`}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}