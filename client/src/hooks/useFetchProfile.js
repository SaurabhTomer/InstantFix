import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setUser } from '../store/slices/authSlice'

const useFetchProfile = () => {
  const dispatch = useDispatch()
  const { accessToken } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!accessToken) return

    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true
        })
        dispatch(setUser({ user: res.data.user, accessToken }))
      } catch (err) {
        console.log(err)
      }
    }

    fetchProfile()
  }, [accessToken])
}

export default useFetchProfile