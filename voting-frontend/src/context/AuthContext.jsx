import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { getMe, logout as logoutApi } from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  // 🔐 Fetch user only for protected pages
  const fetchUser = async () => {
    try {
      const res = await getMe();
      const userData = res?.data?.data;

      setUser(userData);
      setRole(userData?.role);
    } catch (err) {
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  // 🚀 FIX: do NOT call /me on public pages
  useEffect(() => {
    const publicRoutes = [
       "/",
      "/login",
      "/register",
      "/verify-otp",
    ];

    const isPublicRoute = publicRoutes.includes(location.pathname);

    if (!isPublicRoute) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [location.pathname]);

  // 🔐 LOGIN helper
  const login = (userData) => {
    setUser(userData);
    setRole(userData?.role);
  };

  // 🚪 LOGOUT
  const logout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      // ignore backend errors
    } finally {
      setUser(null);
      setRole(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,

        setUser,
        setRole,

        login,
        logout,

        isAuthenticated: !!user,
        isAdmin: role === "admin" || role === "superadmin",
        isVoter: role === "user"
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);