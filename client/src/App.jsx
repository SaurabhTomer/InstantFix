import { Routes, Route } from 'react-router-dom'
import useRefreshToken from './hooks/useRefreshToken'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/customer/Dashboard'
import Booking from './pages/customer/Booking'
import RequestHistory from './pages/customer/RequestHistory'
import Profile from './pages/customer/Profile'
import Unauthorized from './pages/Unauthorized'
import ProtectedRoute from './components/ProtectedRoute'

const App = () => {
  const { checking } = useRefreshToken()

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route path="/customer/dashboard" element={
        <ProtectedRoute allowedRoles={['customer']}>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/customer/booking" element={
        <ProtectedRoute allowedRoles={['customer']}>
          <Booking />
        </ProtectedRoute>
      } />
      <Route path="/customer/requests" element={
        <ProtectedRoute allowedRoles={['customer']}>
          <RequestHistory />
        </ProtectedRoute>
      } />
      <Route path="/customer/profile" element={
        <ProtectedRoute allowedRoles={['customer']}>
          <Profile />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default App