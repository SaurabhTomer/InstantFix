import { Routes, Route } from 'react-router-dom'
import useRefreshToken from './hooks/useRefreshToken'
import ProtectedRoute from './components/ProtectedRoute'
import ElectricianDashboard from './pages/electrician/ElectricianDashboard'

const App = () => {
  const { checking } = useRefreshToken()

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/electrician/dashboard" element={
        <ProtectedRoute allowedRoles={['electrician']}>
          <ElectricianDashboard />
        </ProtectedRoute>
      } />
      
    </Routes>
  )
}

export default App