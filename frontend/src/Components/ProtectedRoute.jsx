import { useAuth } from "../Context/AuthContext";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isEmailVerified, loading } = useAuth();

  useEffect(() => {
    // Trigger toast only when loading finishes and auth fails
    if (!loading && !isAuthenticated) {
      toast.error("Please login or register an account to access this page", {
        id: "auth-required",
        duration: 4000,
      });
    }

    if (!loading && isAuthenticated && !isEmailVerified) {
      toast.error("Please verify your email to access this feature", {
        id: "verify-required",
        duration: 4000,
      });
    }
  }, [loading, isAuthenticated]);

  // 1. While checking auth, show nothing or a spinner
  if (loading) return null;

  // 2. If not authenticated or not verified, return null (or a placeholder)
  // This stays on the current URL but doesn't show the protected content
  if (!isAuthenticated) {
    return (
      <div className="p-10 text-center border-2 border-dashed border-gray-200 rounded-xl">
        <p className="text-gray-500">This content is restricted.</p>
        <p className="text-sm text-orange-500 font-medium">
          Please Login to view.
        </p>
      </div>
    );
  }

  // 3. Otherwise, show the protected content
  return children;
}
