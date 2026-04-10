import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import LandingPage    from "./pages/LandingPage";
import LoginPage      from "./pages/LoginPage";
import RegisterPage   from "./pages/RegisterPage";
import ForgotPassword from "./pages/ForgotPassword";
import PendingApprovalPage from "./pages/PendingApprovalPage";
import UserDashboard from "./pages/User/UserDashboard";
import BookRequest from "./pages/User/BookRequest";
import UserBookings from "./pages/User/MyBookings";
import RequestDetails from "./pages/User/RequestDetails";
import UserProfile from "./pages/User/UserProfile";
import ElectricianDashboard from "./pages/Electrician/ElectricianDashboard";
import ElectricianProfile from "./pages/Electrician/ElectricianProfile";
import NearbyJobs from "./pages/Electrician/NearbyJobs";
import JobDetails from "./pages/Electrician/JobDetails";
import ElectricianBookings from "./pages/Electrician/MyBookings";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ManageUsers from "./pages/Admin/ManageUsers";
import ManageElectricians from "./pages/Admin/ManageElectricians";
import ManageRequests from "./pages/Admin/ManageRequests";

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <LandingPage />
            </ProtectedRoute>
          } />
          <Route path="/login"           element={<LoginPage />}      />
          <Route path="/register"        element={<RegisterPage />}   />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/pending-approval" element={<PendingApprovalPage />} />
          <Route path="/user/dashboard"  element={<UserDashboard />}  />
          <Route path="/user/book-request" element={<BookRequest />} />
          <Route path="/user/bookings"   element={<UserBookings />} />
          <Route path="/user/bookings/:requestId" element={<RequestDetails />} />
          <Route path="/user/profile"    element={<UserProfile />} />
          <Route path="/electrician/dashboard" element={<ElectricianDashboard />} />
          <Route path="/electrician/profile" element={<ElectricianProfile />} />
          <Route path="/electrician/nearby-jobs" element={<NearbyJobs />} />
          <Route path="/electrician/bookings" element={<ElectricianBookings />} />
          <Route path="/electrician/job-details/:requestId" element={<JobDetails />} />
          
          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}