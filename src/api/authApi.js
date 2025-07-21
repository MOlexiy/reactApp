import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const loginRequest = async (username, password) => {
  const response = await api.post("/account/login", { username, password });
  return response.data;
};

export const registerRequest = async (registrationData) => {
  const response = await api.post("/account/register", registrationData);
  return response.data;
}

export const getUserProfile = async (token) => {
  const response = await api.get("/account/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};