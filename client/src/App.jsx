import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
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
import socket from "./socket";

function SocketManager() {
  const { user, isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isLoggedIn && user?._id) {
      socket.connect();
      socket.emit("register", user._id);

      return () => {
        socket.disconnect();
      };
    }
  }, [isLoggedIn, user?._id]);

  return null;
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <SocketManager />
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