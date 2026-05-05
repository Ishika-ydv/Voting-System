import api from "./axiosInstance";

// 🔐 AUTH
export const register = (data) => api.post("/users/register", data);

export const login = (data) => api.post("/users/login", data);

export const logout = () => api.post("/users/logout");


// ❌ DO NOT expose manual refresh in frontend flow
// (only backend interceptor should handle it)
export const refreshToken = () =>
  api.post("/users/refresh-token");


// 👤 USER
export const getMe = () => api.get("/users/me");

export const updateProfile = (data) =>
  api.patch("/users/update-profile", data);

export const changePassword = (data) =>
  api.post("/users/change-password", data);


// 📧 OTP
export const sendOtp = (email) =>
  api.post("/users/send-otp", { email });

export const verifyOtp = (data) =>
api.post("/users/verify-otp", data);
































// import api from "./axiosInstance";

// // 🔐 AUTH

// export const register = (data) =>
//   api.post("/users/register", data);

// export const login = (data) =>
//   api.post("/users/login", data);

// export const logout = () =>
//   api.post("/users/logout"); // needs token


// // 🔄 TOKEN (handled automatically, but keep for manual use if needed)
// export const refreshToken = () =>
//   api.post("/users/refresh-token");


// // 👤 USER

// export const getMe = () =>
//   api.get("/users/me"); // ✅ matches your route

// export const updateProfile = (data) =>
//   api.patch("/users/update-profile", data);

// export const changePassword = (data) =>
//   api.post("/users/change-password", data);


// // 📧 OTP

// export const sendOtp = (email) =>
//   api.post("/users/send-otp", { email });

// export const verifyOtp = (data) =>
//   api.post("/users/verify-otp", data);