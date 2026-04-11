import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPassword from "./pages/ForgotPassword";
import PendingApprovalPage from "./pages/PendingApprovalPage";
import UserLayout from "./pages/User/UserLayout";
import ElectricianDashboard from "./pages/Electrician/ElectricianDashboard";
import ElectricianProfile from "./pages/Electrician/ElectricianProfile";
import NearbyJobs from "./pages/Electrician/NearbyJobs";
import JobDetails from "./pages/Electrician/JobDetails";
import ElectricianBookings from "./pages/Electrician/MyBookings";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./pages/Admin/AdminLayout";

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login"            element={<LoginPage />} />
          <Route path="/register"         element={<RegisterPage />} />
          <Route path="/forgot-password"  element={<ForgotPassword />} />
          <Route path="/pending-approval" element={<PendingApprovalPage />} />

          {/* Landing */}
          <Route path="/" element={
            <ProtectedRoute allowedRoles={['customer', 'admin', 'electrician']}>
              <LandingPage />
            </ProtectedRoute>
          } />

          {/* User Routes — UserLayout handle karega sab */}
          <Route path="/user/*" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <UserLayout />
            </ProtectedRoute>
          } />

          {/* Electrician Routes */}
          <Route path="/electrician/dashboard" element={
            <ProtectedRoute allowedRoles={['electrician']}>
              <ElectricianDashboard />
            </ProtectedRoute>
          } />
          <Route path="/electrician/profile" element={
            <ProtectedRoute allowedRoles={['electrician']}>
              <ElectricianProfile />
            </ProtectedRoute>
          } />
          <Route path="/electrician/nearby-jobs" element={
            <ProtectedRoute allowedRoles={['electrician']}>
              <NearbyJobs />
            </ProtectedRoute>
          } />
          <Route path="/electrician/bookings" element={
            <ProtectedRoute allowedRoles={['electrician']}>
              <ElectricianBookings />
            </ProtectedRoute>
          } />
          <Route path="/electrician/job-details/:requestId" element={
            <ProtectedRoute allowedRoles={['electrician']}>
              <JobDetails />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}