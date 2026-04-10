import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isLoggedIn, token } = useSelector((state) => state.auth);

  // Not authenticated
  if (!isLoggedIn || !user) {
    return <Navigate to="/login" replace />;
  }

  // Role not allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their own dashboard
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'electrician') return <Navigate to="/electrician/dashboard" replace />;
    return <Navigate to="/user/dashboard" replace />;
  }

  return children;
}