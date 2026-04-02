import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { setUser } from '../store/slices/authSlice'

const useRefreshToken = () => {
  const [checking, setChecking] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    const restore = async () => {
      try {
        const res = await axios.post(
          'http://localhost:5000/api/auth/refresh',
          {},
          { withCredentials: true }
        )
        const newAccessToken = res.data.accessToken

        const userRes = await axios.get(
          'http://localhost:5000/api/auth/me',
          {
            headers: { Authorization: `Bearer ${newAccessToken}` },
            withCredentials: true,
          }
        )
        dispatch(setUser({ user: userRes.data.user, accessToken: newAccessToken }))
      } catch {
        console.log('Session expired')
      } finally {
        setChecking(false)
      }
    }
    restore()
  }, [])

  return { checking }
}

export default useRefreshToken