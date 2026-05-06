import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // ✅ cookies enabled
  headers: {
    "Content-Type": "application/json",
  },
});

// ❌ NO token injection (REMOVE COMPLETELY)

// ✅ Response interceptor (SAFE VERSION)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/users/login") &&
      !originalRequest.url.includes("/users/refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        await api.post("/users/refresh-token"); // cookie-based refresh
        return api(originalRequest);
      } catch (err) {
        // ❌ DO NOT reload or loop
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;