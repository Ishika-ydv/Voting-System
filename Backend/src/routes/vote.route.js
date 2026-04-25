import express from "express";
import { voteOnPoll } from "../controllers/vote.controller.js";
import { verifyJWT, requireVerifiedUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * 🗳️ Submit a vote
 * Protected route:
 * - user must be logged in
 * - optionally must be verified
 */
router.post(
  "/vote",
  verifyJWT,
  requireVerifiedUser,
  voteOnPoll
);



export default router;