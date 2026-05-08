"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

import {
  useRegisterMutation,
  useLoginMutation,
  useGetMeQuery,
} from "@/api/authApi";

// =========================
// CONTEXT
// =========================

const AuthContext = createContext(null);

// =========================
// PROVIDER
// =========================

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(null);

  const [loading, setLoading] = useState(true);

  // =========================
  // RTK QUERY MUTATIONS
  // =========================

  const [registerMutation] = useRegisterMutation();

  const [loginMutation] = useLoginMutation();

  // =========================
  // LOAD AUTH FROM STORAGE
  // =========================

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const storedToken = localStorage.getItem("token");

      const storedUser = localStorage.getItem("user");

      if (storedToken) {
        setToken(storedToken);
      }

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load auth data:", error);

      localStorage.removeItem("token");

      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================
  // GET CURRENT USER
  // =========================

  const {
    data: me,
    isLoading: meLoading,
    isError,
  } = useGetMeQuery(undefined, {
    skip: !token,
  });

  // =========================
  // SYNC USER
  // =========================

  useEffect(() => {
    if (me?.data) {
      setUser(me.data);

      localStorage.setItem("user", JSON.stringify(me.data));
    }

    // Invalid token
    if (isError) {
      logout();
    }
  }, [me, isError]);

  // =========================
  // REGISTER
  // =========================

  const register = async (username, email, password) => {
    try {
      const response = await registerMutation({
        username,
        email,
        password,
      }).unwrap();

      console.log("REGISTER RESPONSE:", response);

      const userData = response?.user;

      const authToken = response?.token;

      if (!userData || !authToken) {
        throw new Error("Invalid server response");
      }

      // Save auth
      localStorage.setItem("token", authToken);

      localStorage.setItem("user", JSON.stringify(userData));

      // Update state
      setToken(authToken);

      setUser(userData);

      return {
        success: true,
      };
    } catch (err) {
      console.error(err);

      return {
        success: false,
        error: err?.data?.message || err?.message || "Registration failed",
      };
    }
  };

  // =========================
  // LOGIN
  // =========================

  const login = async (email, password) => {
    try {
      const response = await loginMutation({
        email,
        password,
      }).unwrap();

      console.log("LOGIN RESPONSE:", response);

      const userData = response?.user;

      const authToken = response?.token;

      if (!userData || !authToken) {
        throw new Error("Invalid server response");
      }

      // Save auth
      localStorage.setItem("token", authToken);

      localStorage.setItem("user", JSON.stringify(userData));

      // Update state
      setToken(authToken);

      setUser(userData);

      return {
        success: true,
      };
    } catch (err) {
      console.error(err);

      return {
        success: false,
        error: err?.data?.message || err?.message || "Login failed",
      };
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const logout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    setUser(null);

    setToken(null);
  };

  // =========================
  // CONTEXT VALUE
  // =========================

  const value = {
    user,

    token,

    loading: loading || meLoading,

    register,

    login,

    logout,

    isAuthenticated: !!token,
  };

  // =========================
  // PROVIDER
  // =========================

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// =========================
// HOOK
// =========================

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
