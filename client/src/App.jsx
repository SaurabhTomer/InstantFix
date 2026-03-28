import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/customer/dashboard" element={<div>Customer Dashboard</div>} />
        <Route path="/electrician/dashboard" element={<div>Electrician Dashboard</div>} />
        <Route path="/admin/dashboard" element={<div>Admin Dashboard</div>} />
        <Route path="/pending" element={<div>Account Pending Approval</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App