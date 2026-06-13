import axios from "axios";

const authAPI = axios.create({
    baseURL: "http://localhost:5000/api",
});

authAPI.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }

    return config;
})

export default authAPI;