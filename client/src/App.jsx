import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPassword from "./pages/ForgotPassword";
import PendingApprovalPage from "./pages/PendingApprovalPage";
import UserLayout from "./pages/User/UserLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./pages/Admin/AdminLayout";
import ElectricianLayout from "./pages/Electrician/ElectricianLayout";

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
              <Route path="/electrician/*" element={
      <ProtectedRoute allowedRoles={['electrician']}>
        <ElectricianLayout />
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