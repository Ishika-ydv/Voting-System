import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  // ⏳ Wait until auth state is resolved
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg">
        Loading...
      </div>
    );
  }

  // 🔐 Not logged in → go to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 Logged in but not admin → block access
  if (!isAdmin) {
    return <Navigate to="/polls" replace />;
  }

  // ✅ Admin allowed
  return children;
}