import axios from "axios";

const teamApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

teamApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default teamApi;