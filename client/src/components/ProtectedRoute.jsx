import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, accessToken } = useSelector((state) => state.auth)

  // logged in nahi hai
  if (!accessToken) {
    return <Navigate to="/login" replace />
  }

  // role check
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

export default ProtectedRoute