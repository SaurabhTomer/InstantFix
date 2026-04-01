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
import Requests from './pages/admin/Requests'
import Electricians from './pages/admin/Electricians'
import Dashbaord from './pages/admin/Dashbaord'
import ElectricianDashboard from './pages/electrician/ElectricianDashboard'


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


      <Route path="/electrician/dashboard" element={
        <ProtectedRoute allowedRoles={['electrician']}>
          <ElectricianDashboard />
        </ProtectedRoute>
      } />

      // Admin routes
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Dashbaord />
        </ProtectedRoute>
      } />
      <Route path="/admin/electricians" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Electricians />
        </ProtectedRoute>
      } />
      <Route path="/admin/requests" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Requests />
        </ProtectedRoute>
      } />


    </Routes>
  )
}

export default App