import axios from 'axios'
import store from '../store/store'
import { setAccessToken, clearAuth } from '../store/slices/authSlice'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true
})

// request interceptor — har request pe token attach karo
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = store.getState().auth.accessToken
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// response interceptor — 401 aaye toh silently refresh karo
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // agar 401 aaya aur retry nahi hua abhi tak
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // refresh token se naya access token lo
        const res = await axios.post(
          'http://localhost:5000/api/auth/refresh',
          {},
          { withCredentials: true }
        )

        const newAccessToken = res.data.accessToken

        // redux mein update karo
        store.dispatch(setAccessToken(newAccessToken))

        // original request dobara bhejo naye token ke saath
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return axiosInstance(originalRequest)

      } catch (refreshError) {
        // refresh bhi fail hua — logout karo
        store.dispatch(clearAuth())
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance