import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { logout } from "../../api/authApi";
import { useState } from "react";

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, setUser, setRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const navItems = [
    { name: "Home", path: "/polls" },
    { name: "Dashboard", path: "/profile" },
    { name: "Results", path: "/results" },
  ];

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      setUser(null);
      setRole(null);
      navigate("/login");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="bg-white shadow-sm py-3 px-6">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        
        {/* 🔷 Logo */}
        <Link
          to="/polls"
          className="flex items-center gap-2 text-xl font-bold text-gray-800"
        >
          <span className="text-2xl">✣</span>
          VoteSecure
        </Link>

        {/* 🔹 Center Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                location.pathname === item.path
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.name}
            </Link>
          ))}

          {/* Admin Link */}
          {isAdmin && (
            <Link
              to="/admin/polls"
              className="px-4 py-2 rounded-lg font-medium text-red-600 hover:bg-red-50"
            >
              Admin
            </Link>
          )}
        </div>

        {/* 🔹 Right Side */}
        <div className="flex items-center gap-3">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="bg-blue-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-blue-700"
              >
                Log in
              </Link>

              <Link
                to="/register"
                className="bg-blue-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-blue-700"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              {/* User Avatar */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <span className="hidden sm:block text-sm text-gray-700">
                  {user?.name}
                </span>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                disabled={loading}
                className="bg-red-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? "..." : "Logout"}
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}