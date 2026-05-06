import api from "./axiosInstance";

export const VotesAPI = {
  vote: (data) => api.post("/votes/vote", data),

  getStatus: (pollId) =>
    api.get(`/votes/status/${pollId}`),
};