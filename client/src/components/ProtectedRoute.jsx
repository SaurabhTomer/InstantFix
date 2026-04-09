import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user, isLoggedIn, token } = useSelector((state) => state.auth);

  console.log("=== ProtectedRoute Debug ===");
  console.log("User:", user);
  console.log("IsLoggedIn:", isLoggedIn);
  console.log("Token:", token ? "Present" : "Missing");
  console.log("==========================");

  // If user is authenticated, redirect to dashboard
  if (isLoggedIn && user) {
    console.log("Redirecting to dashboard - user is authenticated");
    return <Navigate to="/user/dashboard" replace />;
  }

  // If not authenticated, show landing page
  console.log("Showing landing page - user not authenticated");
  return children;
}
