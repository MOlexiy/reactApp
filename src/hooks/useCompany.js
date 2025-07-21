import React from "react";
import {
  createCompany,
  deleteCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
} from "../api/companyApi.js";

export const useCompany = () => {
  const [companies, setCompanies] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const fetchCompanies = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCompanies();
      setCompanies(data);
    } catch (err) {
      setError(err);
      console.error("Failed to fetch companies", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCompanyById = React.useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const company = await getCompanyById(id);
      return company;
    } catch (err) {
      setError(err);
      console.error(`Failed to fetch company with id ${id}`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateCompany = React.useCallback(
    async (companyData) => {
      setLoading(true);
      setError(null);
      try {
        await createCompany(companyData);
        await fetchCompanies();
      } catch (err) {
        setError(err);
        console.error("Failed to create company", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchCompanies],
  );

  const handleUpdateCompany = React.useCallback(
    async (id, companyData) => {
      setLoading(true);
      setError(null);
      try {
        await updateCompany(id, companyData);
        await fetchCompanies();
      } catch (err) {
        setError(err);
        console.error(`Failed to update company ${id}`, err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchCompanies],
  );

  const handleDeleteCompany = React.useCallback(
    async (id) => {
      setLoading(true);
      setError(null);
      try {
        await deleteCompany(id);
        await fetchCompanies();
      } catch (err) {
        setError(err);
        console.error(`Failed to delete company ${id}`, err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchCompanies],
  );

  React.useEffect(() => {
    void fetchCompanies();
  }, [fetchCompanies]);

  return { companies, loading, error, refetch: fetchCompanies, loadCompanyById, handleCreateCompany, handleUpdateCompany, handleDeleteCompany};
};
