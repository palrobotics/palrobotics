import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isEmailVerified, loading } = useAuth();

  // Wait for Firebase auth to resolve
  if (loading) return null;

  // Not logged in → Login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but email NOT verified → Verify Email
  if (!isEmailVerified && isAuthenticated) {
    return <Navigate to="/verifyEmail" replace />;
  }

  // Logged in + verified → Allow access
  return children;
}
