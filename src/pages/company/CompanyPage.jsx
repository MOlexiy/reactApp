import React from "react";
import { useCompany } from "../../hooks/useCompany";
import { CompanyTable } from "./components/CompanyTable";
import { CompanyForm } from "./components/CompanyForm";
import "./CompanyPage.css";
import { useNavigate } from "react-router-dom";

export const CompanyPage = () => {
  const { companies, loading, error, handleDeleteCompany } = useCompany();
  const navigate = useNavigate();

  const handleAddNew = () => {
    navigate("/company/add");
  };

  const handleEdit = async (company) => {
    navigate(`/company/edit/${company.id}`);
  };

  const handleDelete = async (companyId) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      await handleDeleteCompany(companyId);
    }
  };

  if (loading && companies.length === 0) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="company-page">
      <h1>Companies</h1>
      <button className="add-company-button" onClick={handleAddNew}>
        Add New Company
      </button>
      <CompanyTable
        companies={companies}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};
