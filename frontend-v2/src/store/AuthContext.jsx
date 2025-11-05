// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { initiateSocketConnection } from "../helpers/socketHelper";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user?.token) {
      initiateSocketConnection();
    }
  }, [user]);

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    initiateSocketConnection();
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    initiateSocketConnection();
  };

  const isLoggedIn = !!user?.token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token: user?.token || null,
        role: user?.role || null,
        login,
        logout,
        isLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
