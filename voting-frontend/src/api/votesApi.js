import api from "./axiosInstance";

export const VotesAPI = {
  vote: (pollId, optionId) =>
    api.post("/votes/vote", {
      pollId,
      optionId,
    }),
  getStatus: (pollId) =>
    api.get(`/votes/status/${pollId}`),
};