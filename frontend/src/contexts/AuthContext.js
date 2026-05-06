"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
} from "@/redux/services/authApi"; // adjust path

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // RTK hooks
  const [loginMutation] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();
  const { data, isLoading, refetch } = useGetMeQuery();

  // Sync user from API
  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data]);

  // LOGIN
  const login = async (email, password) => {
    try {
      const res = await loginMutation({ email, password }).unwrap();

      // optionally store token
      if (res.token) {
        localStorage.setItem("token", res.token);
      }

      await refetch(); // fetch /me
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err?.data?.message || "Login failed",
      };
    }
  };

  // REGISTER
  const register = async (name, email, password) => {
    try {
      await registerMutation({ name, email, password }).unwrap();
      return await login(email, password); // auto login
    } catch (err) {
      return {
        success: false,
        error: err?.data?.message || "Register failed",
      };
    }
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: isLoading,
        login,
        register,
        logout,
        refetchUser: refetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
