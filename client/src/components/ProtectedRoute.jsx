import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user, isLoggedIn, token } = useSelector((state) => state.auth);

  console.log("=== ProtectedRoute Debug ===");
  console.log("User:", user);
  console.log("IsLoggedIn:", isLoggedIn);
  console.log("Token:", token ? "Present" : "Missing");
  console.log("User Role:", user?.role);
  console.log("==========================");

  // If user is authenticated, redirect based on role
  if (isLoggedIn && user) {
    if (user.role === 'electrician') {
      console.log("Redirecting to electrician dashboard - user is electrician");
      return <Navigate to="/electrician/dashboard" replace />;
    } else {
      console.log("Redirecting to user dashboard - user is customer");
      return <Navigate to="/user/dashboard" replace />;
    }
  }

  // If not authenticated, show landing page
  console.log("Showing landing page - user not authenticated");
  return children;
}
