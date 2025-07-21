import React from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}