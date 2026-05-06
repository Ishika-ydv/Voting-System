import { ApiError } from "../utils/ApiError.js";

export const onlyUser = (req, res, next) => {
  const role = req.user.role
  console.log(role)
  if (!["user", "voter"].includes(req.user.role)) {
    throw new ApiError(403, "Only users can vote not admin");
  }
  next();
};