import api from "./axiosInstance";

// 🗳️ CAST VOTE (verified + logged-in user)
export const castVote = (pollId, optionId) =>
  api.post("/votes/vote", { pollId, optionId });