import axios from "axios";

const TaskApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

TaskApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default TaskApi;