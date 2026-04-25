import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js";

 const verifyJWT = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Extract token safely
  if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  } else if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 2. Token missing
  if (!token) {
    throw new ApiError(401, "Access token missing");
  }

  try {
    // 3. Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // 4. Fetch user using 'sub'
    const user = await User.findById(decoded?.sub).select("-passwordHash");

    if (!user) {
      throw new ApiError(401, "User not found (invalid token)");
    }

    // 5. Attach user
    req.user = user;

    next();

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Token expired");
    }

    throw new ApiError(401, "Invalid access token");
  }
});


//ROLE-BASED ACCESS CONTROL (RBAC)
const verifyRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, "Forbidden: insufficient permissions");
    }

    next();
  };
};

//VERIFIED USER CHECK (for voting)
const requireVerifiedUser = (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  if (!req.user.isVerified) {
    throw new ApiError(403, "User is not verified in DataBase");
  }

  next();
};

export {
    verifyJWT,
    verifyRole,
    requireVerifiedUser
}