import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "../api/authApi";
import { disconnectSocket } from "../api/socket";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const login = () => setIsAuthenticated(true);
  const logout = () => {
    disconnectSocket();
    localStorage.removeItem("accessToken");
    setIsAuthenticated(false);
  };
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getCurrentUser();
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);