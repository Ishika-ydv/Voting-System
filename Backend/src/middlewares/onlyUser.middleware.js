import { ApiError } from "../utils/ApiError.js";

export const onlyUser = (req, res, next) => {
  if (req.user.role !== "user") {
    throw new ApiError(403, "Only users can vote");
  }
  next();
};