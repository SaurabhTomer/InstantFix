import { Routes, Route, Navigate } from 'react-router-dom'
import useRefreshToken from './hooks/useRefreshToken'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ElectricianDashboard from './pages/electrician/ElectricianDashboard'
import CustomerDashboard from './pages/customer/CustomerDashboard'

const App = () => {
  const { checking } = useRefreshToken()

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-[3px] border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      {/* public */}
      <Route path="/login"           element={<Login />} />
      <Route path="/register"        element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* customer */}
      <Route path="/customer/dashboard" element={
        <ProtectedRoute allowedRoles={['customer']}>
          <CustomerDashboard />
        </ProtectedRoute>
      } />

      {/* electrician */}
      <Route path="/electrician/dashboard" element={
        <ProtectedRoute allowedRoles={['electrician']}>
          <ElectricianDashboard />
        </ProtectedRoute>
      } />

      {/* default */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App