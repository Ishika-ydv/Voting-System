import { createContext, useContext, useState, useEffect } from "react";
import { getMe, logout as logoutApi } from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await getMe();

      const userData = res?.data?.data;

      setUser(userData);
      setRole(userData.role);
    } catch (err) {
      // ❌ IMPORTANT: NO LOOP
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      // ignore
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
        logout,
        isAuthenticated: !!user,
        isAdmin: role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);