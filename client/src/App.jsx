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
import MyBookings from "./pages/User/MyBookings";
import RequestDetails from "./pages/User/RequestDetails";
import UserProfile from "./pages/User/UserProfile";
import ProtectedRoute from "./components/ProtectedRoute";

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
          <Route path="/user/bookings"   element={<MyBookings />} />
          <Route path="/user/bookings/:requestId" element={<RequestDetails />} />
          <Route path="/user/profile"    element={<UserProfile />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}