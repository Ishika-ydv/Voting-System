import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import ProfileDropdown from "./ProfileDropdown";
import AdminDropdown from "../../pages/admin/AdminDropdown";

export default function Navbar() {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  // ✅ Detect landing page
  const isLandingPage = location.pathname === "/";

  // ✅ Dynamic nav items
  const navItems = [
    { name: "Home", path: "/polls" },
    { name: "Profile", path: "/profile" },
    {
      name: isAdmin ? "Dashboard" : "Results", // 🔥 label change
      path: isAdmin ? "/admin/results" : "/results", // 🔥 route change
    },
  ];

  return (
    <nav className="bg-white border-b py-3 px-6">
      <div className="flex items-center justify-between max-w-7xl mx-auto">

        {/* 🔷 Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-semibold text-gray-900"
        >
          <span className="text-2xl">✣</span>
          VoteSecure
        </Link>

        {/* 🔹 Center Navigation (HIDDEN on landing page) */}
        {!isLandingPage && (
          <div className="hidden md:flex items-center gap-4">

            {navItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? "bg-[#080838] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}

            {/* ✅ Admin Dropdown */}
            {isAdmin && <AdminDropdown />}
          </div>
        )}

        {/* 🔹 Right Side */}
        <div className="flex items-center gap-3">

          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-full text-sm font-medium border text-gray-700 hover:bg-gray-100 transition"
              >
                Sign in
              </Link>

              <Link
                to="/register"
                className="px-5 py-2 rounded-full text-sm font-semibold bg-[#080838] text-white hover:opacity-90 transition"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              {/* 👤 Profile Dropdown */}
              <ProfileDropdown />
            </>
          )}

        </div>
      </div>
    </nav>
  );
}