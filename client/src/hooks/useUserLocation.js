import { useState, useEffect } from 'react'

const useUserLocation = () => {
  const [location, setLocation] = useState({
    lat: null,
    lng: null,
    city: 'Fetching...',
    loading: true
  })

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(prev => ({ ...prev, city: 'Location not supported', loading: false }))
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        try {
          // reverse geocoding — lat lng se city name lo
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          )
          const data = await res.json()
        //   console.log(data);
          
          const city = data.address?.city || data.address?.town || data.address?.village || 'Unknown'
          const state = data.address?.state || ''

          setLocation({
            lat: latitude,
            lng: longitude,
            city: `${city}, ${state}`,
            loading: false
          })
        } catch (err) {
          setLocation({
            lat: latitude,
            lng: longitude,
            city: 'Location found',
            loading: false
          })
        }
      },
      (error) => {
        setLocation(prev => ({ ...prev, city: 'Location denied', loading: false }))
      }
    )
  }, [])

  return location
}

export default useUserLocation