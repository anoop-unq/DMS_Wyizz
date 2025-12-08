import axios from "axios";

export const BASE_URL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    // "Access-Control-Allow-Origin": "*",
  },
});

api.interceptors.request.use(
  (config) => {
    // Read the token from localStorage dynamically
    const token = localStorage.getItem("token");

    // If a token exists, add it to the Authorization header
    console.log(token,"From Api")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("🚀 Requesting:", config.baseURL + config.url);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;