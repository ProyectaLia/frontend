"use client";
import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import apiClient from "@/src/services/apiClient";

interface AuthContextType {
  user: any;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (userData: any, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("proyectalia_token") : null;
    const storedUser = typeof window !== "undefined" ? localStorage.getItem("proyectalia_user") : null;
    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      } catch (e) {
        localStorage.removeItem("proyectalia_token");
        localStorage.removeItem("proyectalia_user");
      }
    }
    setLoading(false);
  }, []);

  const login = (userData: any, authToken: string) => {
    localStorage.setItem("proyectalia_token", authToken);
    localStorage.setItem("proyectalia_user", JSON.stringify(userData));
    setUser(userData);
    setToken(authToken);
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
  };

  const logout = () => {
    localStorage.removeItem("proyectalia_token");
    localStorage.removeItem("proyectalia_user");
    setUser(null);
    setToken(null);
    delete apiClient.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}; 