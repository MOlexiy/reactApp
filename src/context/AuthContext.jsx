import React, { createContext, useEffect, useState } from "react";
import { loginRequest, getUserProfile, api, registerRequest } from "../api/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        localStorage.setItem("token", token);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        try {
          const userData = await getUserProfile(token);
          setUser(userData);
        } catch (error) {
          setUser(null);
          setToken(null);
          localStorage.removeItem("token");
        }
      }
    };
    void fetchUser();
  }, [token]);

  const login = async (username, password) => {
    const data = await loginRequest(username, password);
    localStorage.setItem("token", data.token);
    setToken(data.token);
  };

  const register = async (registrationData) => {
    await registerRequest(registrationData);
  }

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    // delete api.default.headers.common["Authorization"];
  };

  const isAuthenticated = !!token;

  const value = {
    user,
    token,
    login,
    logout,
    register,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
