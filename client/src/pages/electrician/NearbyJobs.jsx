import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import {
  setNearbyLoading, setNearbyJobs, setNearbyError,
} from '../../store/slices/electricianSlice'
import JobCard from '../../components/electrician/JobCard'
import { PageLoader, EmptyState } from '../../components/shared/Spinner'
import { FiNavigation, FiAlertCircle, FiRefreshCw } from 'react-icons/fi'

const RADIUS_OPTIONS = [5, 10, 25, 50]

export default function NearbyJobs() {
  const dispatch    = useDispatch()
  const accessToken = useSelector(s => s.auth.accessToken)
  const { nearbyJobs, nearbyLoading } = useSelector(s => s.electrician)

  const [radius, setRadius]       = useState(10)
  const [location, setLocation]   = useState(null)
  const [gpsError, setGpsError]   = useState(null)
  const [detecting, setDetecting] = useState(false)
  const [fetched, setFetched]     = useState(false)

  const detectAndFetch = () => {
    setDetecting(true)
    setGpsError(null)

    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.')
      setDetecting(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        setLocation({ lat: latitude, lng: longitude })
        setDetecting(false)
        await fetchNearby(latitude, longitude, radius)
      },
      () => {
        setGpsError('Location access denied. Please enable GPS and try again.')
        setDetecting(false)
      }
    )
  }

  const fetchNearby = async (lat, lng, r) => {
    dispatch(setNearbyLoading())
    try {
      const res = await axios.get(
        `http://localhost:5000/api/electrician/nearby?lat=${lat}&lng=${lng}&radiusKm=${r}`,
        { headers: { Authorization: `Bearer ${accessToken}` }, withCredentials: true }
      )
      dispatch(setNearbyJobs(res.data.jobs || res.data))
      setFetched(true)
    } catch (err) {
      dispatch(setNearbyError())
      setGpsError(err.response?.data?.message || 'Failed to fetch nearby jobs.')
    }
  }

  const handleRadiusChange = async (r) => {
    setRadius(r)
    if (location) await fetchNearby(location.lat, location.lng, r)
  }

  return (
    <div className="space-y-5 animate-fade-in">

      {/* header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Nearby Jobs</h1>
          <p className="text-xs text-slate-400 mt-0.5">Jobs available around your location</p>
        </div>
        <button
          onClick={detectAndFetch}
          disabled={detecting}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-60 shadow-sm shadow-blue-200"
        >
          {detecting
            ? <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : <FiNavigation className="text-sm" />
          }
          {detecting ? 'Detecting...' : location ? 'Refresh' : 'Detect Location'}
        </button>
      </div>

      {/* location status */}
      {location && (
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shrink-0" />
          <div>
            <p className="text-xs font-semibold text-blue-700">Location detected</p>
            <p className="text-[11px] text-blue-500 font-mono mt-0.5">
              {location.lat.toFixed(5)}° N, {location.lng.toFixed(5)}° E
            </p>
          </div>
        </div>
      )}

      {/* gps error */}
      {gpsError && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
          <FiAlertCircle className="text-red-500 shrink-0" />
          <p className="text-xs text-red-600">{gpsError}</p>
        </div>
      )}

      {/* radius selector */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Search Radius
        </p>
        <div className="grid grid-cols-4 gap-2">
          {RADIUS_OPTIONS.map(r => (
            <button
              key={r}
              onClick={() => handleRadiusChange(r)}
              className={`py-2.5 rounded-xl text-sm font-semibold border transition-all
                ${radius === r
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-700'
                }`}
            >
              {r} km
            </button>
          ))}
        </div>
      </div>

      {/* initial state - not yet detected */}
      {!location && !detecting && !gpsError && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiNavigation className="text-blue-400 text-2xl" />
          </div>
          <p className="text-sm font-semibold text-slate-600 mb-1">Detect your location</p>
          <p className="text-xs text-slate-400 mb-5">Click the button above to find jobs near you</p>
          <button
            onClick={detectAndFetch}
            className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Get My Location
          </button>
        </div>
      )}

      {/* results */}
      {(detecting || nearbyLoading) ? (
        <PageLoader />
      ) : fetched && nearbyJobs.length === 0 ? (
        <EmptyState
          icon="📍"
          title={`No jobs within ${radius} km`}
          sub="Try increasing the radius"
        />
      ) : nearbyJobs.length > 0 ? (
        <div className="space-y-3">
          <p className="text-xs text-slate-400 font-medium">
            {nearbyJobs.length} job{nearbyJobs.length !== 1 ? 's' : ''} found within {radius} km
          </p>
          {nearbyJobs.map(job => (
            <JobCard key={job._id} job={job} showActions={false} />
          ))}
        </div>
      ) : null}
    </div>
  )
}