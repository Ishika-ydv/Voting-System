import api from "./axiosInstance";

const BASE = "/polls";

export const PollsAPI = {
  getActive: () => api.get(`${BASE}/active`),

  getAll: () => api.get(`${BASE}/all`),

  create: (data) =>
    api.post(`${BASE}/create`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  getById: (id) => api.get(`${BASE}/${id}`),

  delete: (id) => api.delete(`${BASE}/${id}`),

  endPoll: (id) => api.patch(`${BASE}/${id}/end`),

  // 🔹 Single poll result
  getResults: (id) => api.get(`${BASE}/${id}/results`),

  getUserResults: () => api.get("/polls/results/user"),

  // ✅ NEW — All poll results (for dashboard)
  getAllResults: () => api.get(`${BASE}/results/all`),

  // ✅ Voting
  vote: (data) => api.post("/votes/vote", data),
};