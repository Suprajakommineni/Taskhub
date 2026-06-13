import axios from "axios";

const teamApi = axios.create({
  baseURL: "http://localhost:5000/api/team",
});

teamApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default teamApi;