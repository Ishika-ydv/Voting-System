import api from "./axiosInstance";

const BASE = "/polls";

export const PollsAPI = {
  getActive: () => api.get(`${BASE}/active`),

  getAll: () => api.get(`${BASE}/all`),

  create: (data) => api.post(BASE, data),

  getById: (id) => api.get(`${BASE}/${id}`),

  delete: (id) => api.delete(`${BASE}/${id}`),

  endPoll: (id) => api.patch(`${BASE}/${id}/end`),
};