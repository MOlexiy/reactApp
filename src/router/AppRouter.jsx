import React from "react";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import { HomePage } from "../pages/home/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import { RegisterPage } from "../pages/auth/RegistrationPage";
import { ProfilePage } from "../pages/cabinet/ProfilePage";
import { CompanyPage } from "../pages/company/CompanyPage";
import { ProtectedRoute } from "./ProtectedRoute.jsx";
import { PageLayout } from "../components/layout/PageLayout.jsx";
import { useCompany } from "../hooks/useCompany.js";
import { CompanyForm } from "../pages/company/components/CompanyForm.jsx";
import { ProfileFormWrapper } from "../pages/cabinet/components/ProfileFormWrapper.jsx";

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
          <Route path="/profile/edit" element={<ProfileFormWrapper />} />
          <Route path="/company" element={<CompanyPage />} />
          <Route
            path="/company/add"
            element={<CompanyFromWrapper type="add" />}
          />
          <Route
            path="/company/edit/:id"
            element={<CompanyFromWrapper type="edit" />}
          />
        </Route>
      </Route>
    </Routes>
  );
};

const CompanyFromWrapper = ({ type }) => {
  const { loadCompanyById, handleCreateCompany, handleUpdateCompany } =
    useCompany();
  const { id } = useParams();
  const [initialData, setInitialData] = React.useState(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (type === "edit" && id) {
      loadCompanyById(id).then((data) => setInitialData(data));
    }
    // else {
    //   setInitialData({});
    // }
  }, [type, id, loadCompanyById]);

  const handleFormSubmit = async (companyData) => {
    if (type === "edit") {
      await handleUpdateCompany(id, companyData);
    } else {
      await handleCreateCompany(companyData);
    }
    navigate("/company");
  };

  const handleCancel = () => {
    navigate("/company");
  };
  return (
    <CompanyForm
      initialData={type === "edit" ? initialData : null}
      onSubmit={handleFormSubmit}
      onCancel={handleCancel}
    />
  );
};
