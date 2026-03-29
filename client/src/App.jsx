import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import Home from './pages/Home'
   import Dashboard from './pages/customer/Dashboard'
   import Booking from './pages/customer/Booking'
import RequestHistory from './pages/customer/RequestHistory'
import Profile from './pages/customer/Profile'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/electrician/dashboard" element={<div>Electrician Dashboard</div>} />
        <Route path="/admin/dashboard" element={<div>Admin Dashboard</div>} />
        <Route path="/pending" element={<div>Account Pending Approval</div>} />
        <Route path="/" element={<Home />} />
        <Route path="/customer/profile" element={<Profile />} />
        <Route path="/customer/requests" element={<RequestHistory />} />
        <Route path="/customer/dashboard" element={<Dashboard />} />
        <Route path="/customer/booking" element={<Booking />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App