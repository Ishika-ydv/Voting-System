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

  getResults: (id) => api.get(`${BASE}/${id}/results`),

  // ✅ MUST BE HERE
  vote: (data) => api.post("/votes/vote", data),
};