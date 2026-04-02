import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import {
  setProfileLoading, setProfile,
  setProfileSaving, showToast,
} from '../../store/slices/electricianSlice'
import { PageLoader } from '../../components/shared/Spinner'
import {
  FiUser, FiPhone, FiMail, FiTool,
  FiSave, FiStar, FiAward, FiEdit2,
} from 'react-icons/fi'

const inputCls = `
  w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl
  text-sm text-slate-700 placeholder-slate-300
  focus:outline-none focus:border-blue-400 focus:bg-white
  transition-colors
`
const readCls = `
  w-full px-4 py-2.5 bg-slate-100 border border-slate-100 rounded-xl
  text-sm text-slate-400 cursor-not-allowed
`

function FieldLabel({ icon: Icon, label }) {
  return (
    <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
      {Icon && <Icon className="text-slate-300 text-xs" />}
      {label}
    </label>
  )
}

export default function Profile() {
  const dispatch    = useDispatch()
  const accessToken = useSelector(s => s.auth.accessToken)
  const user        = useSelector(s => s.auth.user)
  const { profile, profileLoading, profileSaving } = useSelector(s => s.electrician)

  const [form, setForm] = useState({
    name: '', phone: '', experience: '',
    skills: '', bio: '', hourlyRate: '', availability: 'all',
  })

  useEffect(() => {
    const fetchProfile = async () => {
      dispatch(setProfileLoading())
      try {
        const res = await axios.get(
          'http://localhost:5000/api/electrician/profile',
          { headers: { Authorization: `Bearer ${accessToken}` }, withCredentials: true }
        )
        const p = res.data.electrician || res.data
        dispatch(setProfile(p))
        setForm({
          name:         p.name         || user?.name  || '',
          phone:        p.phone        || user?.phone || '',
          experience:   p.experience   || '',
          skills:       Array.isArray(p.skills) ? p.skills.join(', ') : p.skills || '',
          bio:          p.bio          || '',
          hourlyRate:   p.hourlyRate   || '',
          availability: p.availability || 'all',
        })
      } catch {}
    }
    fetchProfile()
  }, [dispatch, accessToken])

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(setProfileSaving(true))
    try {
      const res = await axios.put(
        'http://localhost:5000/api/electrician/profile',
        {
          ...form,
          skills:      form.skills.split(',').map(s => s.trim()).filter(Boolean),
          experience:  Number(form.experience),
          hourlyRate:  Number(form.hourlyRate),
        },
        { headers: { Authorization: `Bearer ${accessToken}` }, withCredentials: true }
      )
      dispatch(setProfile(res.data.electrician || res.data))
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

  const initials = (user?.name || 'EL')
    .split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  if (profileLoading) return <PageLoader />

  return (
    <div className="space-y-5 animate-fade-in max-w-2xl">

      {/* header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">My Profile</h1>
        <p className="text-xs text-slate-400 mt-0.5">Manage your electrician account</p>
      </div>

      {/* profile hero card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* blue top strip */}
        <div className="h-20 bg-linear-to-r from-blue-600 to-blue-500 relative">
          <div className="absolute -bottom-8 left-5">
            <div className="w-16 h-16 rounded-2xl bg-blue-700 border-4 border-white flex items-center justify-center text-white text-xl font-bold shadow-lg">
              {initials}
            </div>
          </div>
        </div>

        <div className="pt-12 pb-5 px-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-800">{user?.name || 'Electrician'}</h2>
              <p className="text-sm text-slate-400 mt-0.5">{user?.email}</p>
              {profile?.rating > 0 && (
                <div className="flex items-center gap-1.5 mt-2">
                  {[1, 2, 3, 4, 5].map(i => (
                    <FiStar
                      key={i}
                      className={`text-xs ${i <= Math.round(profile.rating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-200'}`}
                    />
                  ))}
                  <span className="text-xs text-slate-400 ml-0.5">
                    {profile.rating.toFixed(1)} · {profile.totalReviews || 0} reviews
                  </span>
                </div>
              )}
            </div>
            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border
              ${profile?.isApproved
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
              <FiAward className="text-sm" />
              {profile?.isApproved ? 'Verified' : 'Pending Approval'}
            </span>
          </div>
        </div>
      </div>

      {/* edit form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <FiEdit2 className="text-blue-500" />
          <h3 className="text-sm font-bold text-slate-700">Edit Information</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div>
            <FieldLabel icon={FiUser} label="Full Name" />
            <input name="name" value={form.name} onChange={handleChange}
              className={inputCls} placeholder="Your full name" required />
          </div>

          <div>
            <FieldLabel icon={FiPhone} label="Phone" />
            <input name="phone" value={form.phone} onChange={handleChange}
              className={inputCls} placeholder="+91 XXXXX XXXXX" />
          </div>

          <div>
            <FieldLabel icon={FiMail} label="Email" />
            <input value={user?.email || ''} className={readCls} readOnly />
          </div>

          <div>
            <FieldLabel label="Experience (years)" />
            <input name="experience" type="number" min="0" max="50"
              value={form.experience} onChange={handleChange}
              className={inputCls} placeholder="e.g. 5" />
          </div>

          <div>
            <FieldLabel label="Hourly Rate (₹)" />
            <input name="hourlyRate" type="number" min="0"
              value={form.hourlyRate} onChange={handleChange}
              className={inputCls} placeholder="e.g. 500" />
          </div>

          <div>
            <FieldLabel label="Availability" />
            <select name="availability" value={form.availability}
              onChange={handleChange} className={inputCls}>
              <option value="all">All days</option>
              <option value="weekdays">Weekdays only</option>
              <option value="weekends">Weekends only</option>
              <option value="on_call">On call</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <FieldLabel icon={FiTool} label="Skills (comma separated)" />
            <input name="skills" value={form.skills} onChange={handleChange}
              className={inputCls}
              placeholder="Wiring, Panel installation, AC wiring, Smart home..." />
          </div>

          <div className="sm:col-span-2">
            <FieldLabel label="Bio" />
            <textarea name="bio" value={form.bio} onChange={handleChange}
              rows={3} className={`${inputCls} resize-none`}
              placeholder="Tell customers about your experience and expertise..." />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={profileSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60 shadow-sm shadow-blue-200"
          >
            {profileSaving
              ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <FiSave className="text-base" />
            }
            {profileSaving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  )
}