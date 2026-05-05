import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // ⏳ Prevent flicker while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg">
        Loading...
      </div>
    );
  }

  // 🔐 If already logged in → redirect away from auth pages
  if (isAuthenticated) {
    return <Navigate to="/polls" replace />;
  }

  // ✅ Not logged in → allow access
  return children;
}