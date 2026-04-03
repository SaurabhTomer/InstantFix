import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import electricianReducer from './slices/electricianSlice'
import customerReducer from './slices/customerSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    electrician: electricianReducer,
    customer: customerReducer,
  },
})

export default store