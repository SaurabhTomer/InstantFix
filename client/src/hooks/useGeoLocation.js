import { useState } from 'react'

const useGeoLocation = () => {
  const [location, setLocation] = useState({ lat: '', lng: '', city: '' })
  const [detecting, setDetecting] = useState(false)
  const [gpsError, setGpsError]   = useState(null)

  const detect = () => {
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
        try {
          const res  = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          )
          const data = await res.json()
          const city = data.address?.city  ||
                       data.address?.town  ||
                       data.address?.village || ''
          const state = data.address?.state || ''
          setLocation({
            lat:  latitude.toFixed(6),
            lng:  longitude.toFixed(6),
            city: `${city}${state ? ', ' + state : ''}`,
          })
        } catch {
          setLocation({
            lat:  latitude.toFixed(6),
            lng:  longitude.toFixed(6),
            city: 'Location detected',
          })
        }
        setDetecting(false)
      },
      () => {
        setGpsError('Location access denied. Please enable GPS and try again.')
        setDetecting(false)
      }
    )
  }

  return { location, detecting, gpsError, detect }
}

export default useGeoLocation