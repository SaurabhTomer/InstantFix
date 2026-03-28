import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    accessToken: null,
    loading: false,
    error: null
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setUser: (state, action) => {
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload
    },
    clearAuth: (state) => {
      state.user = null
      state.accessToken = null
      state.loading = false
      state.error = null
    }
  }
})

export const { setLoading, setError, setUser, setAccessToken, clearAuth } = authSlice.actions
export default authSlice.reducer