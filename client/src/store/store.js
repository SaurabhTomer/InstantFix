import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import electricianReducer from './slices/electricianSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    electrician: electricianReducer,
  },
})

export default store