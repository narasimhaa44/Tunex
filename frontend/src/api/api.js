import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // Important for cookies (refresh tokens)
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Fixed key name to match Login.jsx
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
