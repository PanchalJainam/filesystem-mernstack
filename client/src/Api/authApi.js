// authApi.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ← must be set correctly
  withCredentials: true, // optional if using cookies
});

console.log("URL", import.meta.env.VITE_API_URL);

// Add token to headers automatically if exists
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Handle unauthorized responses globally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// Auth APIs
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const verifyOtp = (data) => API.post("/auth/verify-otp", data);
export const getUserDetails = () => API.get("/user/me");

export default API;
