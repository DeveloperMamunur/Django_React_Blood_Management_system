import { useEffect, useState } from "react";
import { authService } from "../services/authService";
import { AuthContext } from "./AuthContextValue";
import { flushSync } from "react-dom";

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initUser = async () => {
        setIsAuthLoading(true);
        const token = localStorage.getItem('access_token');
        if (token) {
            const user = await authService.getCurrentUser();
            setCurrentUser(user); 
        }
        setIsAuthLoading(false);
    };

    initUser();
  }, []);

  const login = async (credentials) => {
  try {
    const response = await authService.login(credentials);
    localStorage.setItem("access_token", response.token);
    localStorage.setItem("refresh_token", response.refresh);
    const user = await authService.getCurrentUser();
    setCurrentUser(user);
    flushSync(() => {
      setCurrentUser(user);
    });
    
    return { success: true, user };
  } catch (err) {
    setError(err.message || "Login failed");
    throw err;
  }
};

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      localStorage.setItem("access_token", response.token);
      localStorage.setItem("refresh_token", response.refresh);
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
      flushSync(() => {
        setCurrentUser(user);
      });
      
      return { success: true, user };
      // return response;
    } catch (err) {
      setError(err.message || "Registration failed");
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setCurrentUser(null);
  };

  const refreshCurrentUser = async () => {
    try {
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
      return user;
    } catch (err) {
      console.error('Failed to refresh user', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        register,
        login,
        logout,
        currentUser,
        setCurrentUser,
        refreshCurrentUser,
        isAuthLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
