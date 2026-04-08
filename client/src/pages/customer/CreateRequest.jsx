import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import {
  setCreating, setCreateSuccess, showToast
} from '../../store/slices/customerSlice'
import useGeoLocation from '../../hooks/useGeoLocation'
import {
  FiZap, FiWind, FiSun, FiDroplet, FiTool,
  FiMonitor, FiAlertCircle, FiMapPin, FiNavigation,
  FiUpload, FiX, FiCheck,
} from 'react-icons/fi'
import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const CATEGORIES = [
  { key: 'Wiring',           icon: FiZap,         color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-200'    },
  { key: 'Fan Installation', icon: FiWind,         color: 'text-indigo-600',  bg: 'bg-indigo-50',  border: 'border-indigo-200'  },
  { key: 'AC Service',       icon: FiSun,          color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-200'   },
  { key: 'Water Heater',     icon: FiDroplet,      color: 'text-cyan-600',    bg: 'bg-cyan-50',    border: 'border-cyan-200'    },
  { key: 'Panel Repair',     icon: FiTool,         color: 'text-rose-600',    bg: 'bg-rose-50',    border: 'border-rose-200'    },
  { key: 'Smart Home',       icon: FiMonitor,      color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  { key: 'Emergency',        icon: FiAlertCircle,  color: 'text-red-600',     bg: 'bg-red-50',     border: 'border-red-200'     },
  { key: 'Other',            icon: FiTool,         color: 'text-slate-600',   bg: 'bg-slate-50',   border: 'border-slate-200'   },
]

// ── Success Popup ─────────────────────────────────────────
function SuccessPopup({ onDone }) {
  const [count, setCount] = useState(3)

  useEffect(() => {
    const t = setInterval(() => {
      setCount(c => {
        if (c <= 1) { clearInterval(t); onDone(); return 0 }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in" />
      <div className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm text-center animate-bounce-in">

        {/* success ring */}
        <div className="relative w-20 h-20 mx-auto mb-5">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
            <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center">
              <FiCheck className="text-white text-2xl" />
            </div>
          </div>
          <svg className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }} viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="36" fill="none" stroke="#10b981" strokeWidth="3"
              strokeDasharray="180 50" strokeLinecap="round" />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-slate-800 mb-2">Request Created!</h2>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          Your service request has been submitted successfully.
          An electrician will be assigned shortly.
        </p>

        <div className="flex items-center justify-center gap-2 mb-5">
          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
            <span className="text-lg font-bold text-blue-600">{count}</span>
          </div>
          <span className="text-xs text-slate-400">Redirecting to your requests...</span>
        </div>

        <button
          onClick={onDone}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          View My Requests
        </button>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────
export default function CreateRequest() {
  const dispatch      = useDispatch()
  const accessToken   = useSelector(s => s.auth.accessToken)
  const creating      = useSelector(s => s.customer.creating)
  const createSuccess = useSelector(s => s.customer.createSuccess)

  const navigate              = useNavigate()
  const { state: routeState } = useLocation()

  const { location, detecting, gpsError, detect } = useGeoLocation()

  const [category,     setCategory]     = useState(routeState?.category || '')
  const [description,  setDescription]  = useState('')
  const [photos,       setPhotos]       = useState([])
  const [previews,     setPreviews]     = useState([])
  const [locationMode, setLocationMode] = useState('gps')

  // address fields
  const [street,       setStreet]       = useState('')
  const [city,         setCity]         = useState('')
  const [addressState, setAddressState] = useState('')
  const [pincode,      setPincode]      = useState('')

  // manual coords
  const [manualLat, setManualLat] = useState('')
  const [manualLng, setManualLng] = useState('')

  const fileRef = useRef()

  // auto-fill city from GPS
  useEffect(() => {
    if (location.city) {
      const parts = location.city.split(', ')
      setCity(parts[0] || '')
      setAddressState(parts[1] || '')
    }
  }, [location.city])

  const handlePhotos = (e) => {
    const files = Array.from(e.target.files)
    if (photos.length + files.length > 5) {
      dispatch(showToast({ msg: 'Maximum 5 photos allowed', type: 'error' }))
      return
    }
    const newFiles    = [...photos, ...files]
    const newPreviews = newFiles.map(f => URL.createObjectURL(f))
    setPhotos(newFiles)
    setPreviews(newPreviews)
  }

  const removePhoto = (i) => {
    setPhotos(photos.filter((_, idx) => idx !== i))
    setPreviews(previews.filter((_, idx) => idx !== i))
  }

  const getFinalCoords = () => {
    if (locationMode === 'gps') {
      return { lat: parseFloat(location.lat), lng: parseFloat(location.lng) }
    }
    return { lat: parseFloat(manualLat), lng: parseFloat(manualLng) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!category) {
      dispatch(showToast({ msg: 'Please select a category', type: 'error' }))
      return
    }

    const { lat, lng } = getFinalCoords()

    if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
      dispatch(showToast({ msg: 'Valid location is required', type: 'error' }))
      return
    }

    dispatch(setCreating(true))

    try {
      const formData = new FormData()
      formData.append('category',    category)
      formData.append('description', description)
      formData.append('address',     JSON.stringify({ street, city, state: addressState, pincode }))
      formData.append('location',    JSON.stringify({
        type: 'Point',
        coordinates: [lng, lat],
      }))
      photos.forEach(f => formData.append('photos', f))

      const res = await axios.post(
        'http://localhost:5000/api/requests',
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      )

      dispatch(setCreateSuccess({ success: true, request: res.data.request }))

    } catch (err) {
      dispatch(setCreating(false))
      dispatch(showToast({
        msg: err.response?.data?.message || 'Failed to create request',
        type: 'error',
      }))
    }
  }

  const handlePopupDone = () => {
    dispatch(setCreateSuccess({ success: false, request: null }))
    navigate('/customer/requests', { replace: true })
  }

  const inputCls = `
    w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl
    text-sm text-slate-700 placeholder-slate-300
    focus:outline-none focus:border-blue-400 focus:bg-white transition-colors
  `

  return (
    <>
      {createSuccess && <SuccessPopup onDone={handlePopupDone} />}

      <div className="max-w-2xl space-y-6 animate-fade-in">

        {/* header */}
        <div>
          <h1 className="text-xl font-bold text-slate-800">New Service Request</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Fill in the details and we'll find the right electrician for you
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ── Step 1: Category ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h2 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-lg flex items-center justify-center">1</span>
              Select Category
            </h2>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map(cat => {
                const Icon       = cat.icon
                const isSelected = category === cat.key
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setCategory(cat.key)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all
                      ${isSelected
                        ? `${cat.bg} ${cat.border} shadow-sm`
                        : 'bg-slate-50 border-transparent hover:border-slate-200'
                      }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center
                      ${isSelected ? cat.bg : 'bg-white'}`}>
                      <Icon className={`text-base ${isSelected ? cat.color : 'text-slate-400'}`} />
                    </div>
                    <span className={`text-[11px] font-semibold text-center leading-tight
                      ${isSelected ? 'text-slate-800' : 'text-slate-500'}`}>
                      {cat.key}
                    </span>
                    {isSelected && (
                      <div className={`w-4 h-4 ${cat.bg} rounded-full flex items-center justify-center`}>
                        <FiCheck className={`text-[10px] ${cat.color}`} />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── Step 2: Description ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h2 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-lg flex items-center justify-center">2</span>
              Describe the Problem
            </h2>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              rows={4}
              placeholder="e.g. My living room fan stopped working suddenly. It makes a humming sound but the blades don't spin..."
              className={`${inputCls} resize-none`}
            />
            <p className="text-[11px] text-slate-400 mt-1.5">
              More detail = faster service. Minimum 20 characters.
            </p>
          </div>

          {/* ── Step 3: Photos ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h2 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-lg flex items-center justify-center">3</span>
              Upload Photos
              <span className="text-xs text-slate-400 font-normal ml-1">(optional, max 5)</span>
            </h2>

            {previews.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-3">
                {previews.map((src, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={src} alt=""
                      className="w-20 h-20 object-cover rounded-xl border border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiX className="text-[10px]" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {photos.length < 5 && (
              <button
                type="button"
                onClick={() => fileRef.current.click()}
                className="w-full flex flex-col items-center gap-2 py-6 border-2 border-dashed border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all group"
              >
                <div className="w-10 h-10 bg-slate-100 group-hover:bg-blue-100 rounded-xl flex items-center justify-center transition-colors">
                  <FiUpload className="text-slate-400 group-hover:text-blue-500 text-lg transition-colors" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-slate-600">Click to upload photos</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    JPG, PNG up to 5MB · {5 - photos.length} remaining
                  </p>
                </div>
              </button>
            )}

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handlePhotos}
            />
          </div>

          {/* ── Step 4: Location ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h2 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-lg flex items-center justify-center">4</span>
              Your Location
            </h2>

            {/* mode toggle */}
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setLocationMode('gps')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all
                  ${locationMode === 'gps'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300'
                  }`}
              >
                <FiNavigation className="text-sm" />
                Use GPS
              </button>
              <button
                type="button"
                onClick={() => setLocationMode('manual')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all
                  ${locationMode === 'manual'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300'
                  }`}
              >
                <FiMapPin className="text-sm" />
                Enter Manually
              </button>
            </div>

            {/* GPS mode */}
            {locationMode === 'gps' && (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={detect}
                  disabled={detecting}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-sm font-semibold rounded-xl transition-colors disabled:opacity-60"
                >
                  {detecting
                    ? <span className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                    : <FiNavigation className="text-base" />
                  }
                  {detecting ? 'Detecting...' : location.lat ? 'Re-detect Location' : 'Detect My Location'}
                </button>

                {location.lat && (
                  <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                    <FiMapPin className="text-emerald-500 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-emerald-700">
                        {location.city || 'Location detected'}
                      </p>
                      <p className="text-[11px] text-emerald-600 font-mono mt-0.5">
                        {location.lat}° N, {location.lng}° E
                      </p>
                    </div>
                    <FiCheck className="text-emerald-500 ml-auto shrink-0" />
                  </div>
                )}

                {gpsError && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                    <FiAlertCircle className="text-red-500 shrink-0" />
                    <p className="text-xs text-red-600">{gpsError}</p>
                  </div>
                )}
              </div>
            )}

            {/* Manual mode */}
            {locationMode === 'manual' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Latitude
                    </label>
                    <input
                      type="number" step="any"
                      value={manualLat}
                      onChange={e => setManualLat(e.target.value)}
                      placeholder="e.g. 28.6139"
                      className={`${inputCls} font-mono`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Longitude
                    </label>
                    <input
                      type="number" step="any"
                      value={manualLng}
                      onChange={e => setManualLng(e.target.value)}
                      placeholder="e.g. 77.2090"
                      className={`${inputCls} font-mono`}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* address fields */}
            <div className="mt-4 space-y-3">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Address Details
              </p>
              <input
                value={street}
                onChange={e => setStreet(e.target.value)}
                placeholder="Street / House No."
                className={inputCls}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="City"
                  className={inputCls}
                />
                <input
                  value={addressState}
                  onChange={e => setAddressState(e.target.value)}
                  placeholder="State"
                  className={inputCls}
                />
              </div>
              <input
                value={pincode}
                onChange={e => setPincode(e.target.value)}
                placeholder="Pincode"
                className={inputCls}
              />
            </div>
          </div>

          {/* submit */}
          <button
            type="submit"
            disabled={creating}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-2xl transition-colors disabled:opacity-60 shadow-lg shadow-blue-200"
          >
            {creating
              ? <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              : <>
                  <FiZap className="text-base" />
                  Confirm & Submit Request
                </>
            }
          </button>

        </form>
      </div>
    </>
  )
}