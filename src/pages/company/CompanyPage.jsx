import React from "react";
import { useCompany } from "../../hooks/useCompany";
import { CompanyTable } from "./components/CompanyTable";
import { CompanyForm } from "./components/CompanyForm";
import "./CompanyPage.css";

export const CompanyPage = () => {
  const { companies, loading, error, loadCompanyById, handleCreateCompany, handleUpdateCompany, handleDeleteCompany } = useCompany();

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingCompany, setEditingCompany] = React.useState(null);

  const handleAddNew = () => {
    setEditingCompany(null);
    setIsFormOpen(true);
  };

  const handleEdit = async (company) => {
    const companyData  = await loadCompanyById(company.id);
    setEditingCompany(companyData);
    setIsFormOpen(true);
  };

  const handleDelete = async (companyId) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      await handleDeleteCompany(companyId);
    }
  };

  const handleFormSubmit = async (companyData) => {
    if (editingCompany) {
      const updatedData = {
        id: editingCompany.id,
        ...companyData,
      }
      await handleUpdateCompany(editingCompany.id, updatedData);
    } else {
      await handleCreateCompany(companyData);
    }
    setIsFormOpen(false);
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
      {isFormOpen ? (
        <CompanyForm
          initialData={editingCompany}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
      ) : (
        <CompanyTable
          companies={companies}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};
