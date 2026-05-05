import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // ⏳ Prevent flicker while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg">
        Loading...
      </div>
    );
  }

  // 🔐 Not logged in → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // ✅ Authorized
  return children;
}