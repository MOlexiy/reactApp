import React from 'react';
import { Route, Routes } from "react-router-dom";
import { HomePage } from "../pages/home/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import { RegisterPage } from "../pages/auth/RegistrationPage";
import { ProfilePage } from "../pages/cabinet/ProfilePage";
import { CompanyPage } from "../pages/company/CompanyPage";
import { ProtectedRoute } from "./ProtectedRoute.jsx";
import { PageLayout } from "../components/layout/PageLayout.jsx";

export const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      {/* Protected Routes with header */}
      <Route element={<PageLayout />}>
        {/* Main Application Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/company" element={<CompanyPage />} />
        </Route>
      </Route>
    </Routes>
  );
};
