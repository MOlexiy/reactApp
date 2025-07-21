import { api } from "./authApi";

export const getCompanies = async () => {
  const response = await api.get("/company");
  return response.data;
};

export const getCompanyById = async (id) => {
  const response = await api.get(`/company/${id}`);
  return response.data;
};

export const createCompany = async (companyData) => {
  const response = await api.post("/company", companyData);
  return response.data;
};

export const updateCompany = async (id, companyData) => {
  const response = await api.put(`/company/${id}`, companyData);
  return response.data;
};

export const deleteCompany = async (id) => {
  const response = await api.delete(`/company/${id}`);
  return response.data;
};
