import api from "./axiosInstance";

// 📊 GET POLL RESULTS (requires login)
export const getPollResults = (pollId) =>
  api.get(`/polls/${pollId}/results`);