import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

function config(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

export const loginRequest = async (username, password) => {
  const response = await api.post("/account/login", { username, password });
  return response.data;
};

export const registerRequest = async (registrationData) => {
  const response = await api.post("/account/register", registrationData);
  return response.data;
}

export const getUserProfile = async (token) => {
  const response = await api.get("/account/profile", config(token));
  return response.data;
};

export const getUsers = async (token) => {
  const response = await api.get("/account/users", config(token));
  return response.data;
}

export const getUserById = async (id, token) => {
  const response = await api.get(`/account/user/${id}`, config(token));
  return response.data;
}

export const updateUser = async (id, userData, token) => {
  const response = await api.put(`/account/user/${id}`, userData, config(token));
  return response.data;
};

export const deleteUser = async (id, token) => {
  const response = await api.delete(`/account/user/${id}`, config(token));
  return response.data;
};