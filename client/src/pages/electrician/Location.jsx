import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import axios from 'axios'
import { setLocationSaving, showToast } from '../../store/slices/electricianSlice'
import useGeoLocation from '../../hooks/useGeoLocation'
import { FiMapPin, FiNavigation, FiSave, FiAlertCircle, FiCheck } from 'react-icons/fi'

const RADIUS_OPTIONS = [5, 10, 25, 50, 100]

export default function Location() {
  const dispatch    = useDispatch()
  const accessToken = useSelector(s => s.auth.accessToken)
  const locationSaving = useSelector(s => s.electrician.locationSaving)

  const { location, detecting, gpsError, detect } = useGeoLocation()

  const [lat,    setLat]    = useState('')
  const [lng,    setLng]    = useState('')
  const [radius, setRadius] = useState(10)
  const [saved,  setSaved]  = useState(false)

  // jab GPS se location aaye toh input fields update karo
  useEffect(() => {
    if (location.lat) setLat(location.lat)
    if (location.lng) setLng(location.lng)
  }, [location.lat, location.lng])

  const handleSave = async (e) => {
    e.preventDefault()
    if (!lat || !lng) return
    dispatch(setLocationSaving(true))
    setSaved(false)
    try {
      await axios.put(
        'http://localhost:5000/api/electrician/location',
        { lat: parseFloat(lat), lng: parseFloat(lng), radiusKm: radius },
        { headers: { Authorization: `Bearer ${accessToken}` }, withCredentials: true }
      )
      dispatch(showToast({ msg: 'Location updated successfully!', type: 'success' }))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      dispatch(showToast({
        msg: err.response?.data?.message || 'Failed to update location',
        type: 'error',
      }))
    } finally {
      dispatch(setLocationSaving(false))
    }
  }

  return (
    <div className="space-y-5 animate-fade-in max-w-lg">

      {/* header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">Update Location</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Your location helps us match you with nearby jobs
        </p>
      </div>

      {/* gps detect card */}
      <div className="bg-blue-600 rounded-2xl p-5 text-white relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-36 h-36 bg-blue-500 rounded-full opacity-40" />
        <div className="absolute -bottom-6 -left-4 w-24 h-24 bg-blue-700 rounded-full opacity-30" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <FiNavigation className="text-white text-lg" />
            </div>
            <div>
              <p className="font-bold text-sm">Auto-detect Location</p>
              <p className="text-blue-200 text-xs mt-0.5">Uses your device GPS for precision</p>
            </div>
          </div>

          {/* detected city */}
          {location.city && (
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 mb-4 flex items-center gap-3">
              <FiMapPin className="text-amber-300 shrink-0" />
              <div>
                <p className="text-sm font-semibold">{location.city}</p>
                <p className="text-blue-200 text-[11px] font-mono mt-0.5">
                  {location.lat}° N, {location.lng}° E
                </p>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={detect}
            disabled={detecting}
            className="w-full flex items-center justify-center gap-2 py-3 bg-white text-blue-700 text-sm font-bold rounded-xl hover:bg-blue-50 transition-colors disabled:opacity-70"
          >
            {detecting ? (
              <>
                <span className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                Detecting your location...
              </>
            ) : (
              <>
                <FiNavigation className="text-base" />
                {location.city ? 'Re-detect Location' : 'Detect My Location'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* gps error */}
      {gpsError && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl px-4 py-3.5">
          <FiAlertCircle className="text-red-500 shrink-0 mt-0.5" />
          <p className="text-xs text-red-600 leading-relaxed">{gpsError}</p>
        </div>
      )}

      {/* manual form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-5">
        <h3 className="text-sm font-bold text-slate-700 pb-3 border-b border-slate-100">
          Coordinates
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Latitude
            </label>
            <input
              type="number" step="any"
              value={lat} onChange={e => setLat(e.target.value)}
              required placeholder="e.g. 28.6139"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl
                text-sm font-mono text-slate-700 placeholder-slate-300
                focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Longitude
            </label>
            <input
              type="number" step="any"
              value={lng} onChange={e => setLng(e.target.value)}
              required placeholder="e.g. 77.2090"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl
                text-sm font-mono text-slate-700 placeholder-slate-300
                focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* radius picker */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Job Radius —{' '}
            <span className="text-blue-600 normal-case text-xs font-bold">{radius} km</span>
          </label>
          <div className="grid grid-cols-5 gap-2">
            {RADIUS_OPTIONS.map(r => (
              <button
                key={r} type="button"
                onClick={() => setRadius(r)}
                className={`py-2.5 rounded-xl text-xs font-semibold border transition-all
                  ${radius === r
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-700'
                  }`}
              >
                {r}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Jobs within{' '}
            <span className="font-semibold text-slate-600">{radius} km</span>{' '}
            of your location will be shown to you
          </p>
        </div>

        {/* save button */}
        <button
          type="submit"
          disabled={locationSaving || !lat || !lng}
          className={`w-full flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all disabled:opacity-60
            ${saved
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200'
            }`}
        >
          {locationSaving ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <FiCheck className="text-base" />
              Location Saved!
            </>
          ) : (
            <>
              <FiSave className="text-base" />
              Save Location
            </>
          )}
        </button>
      </form>
    </div>
  )
}