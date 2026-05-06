import express from "express";
import { voteOnPoll, checkVoteStatus } from "../controllers/vote.controller.js";
import { verifyJWT, requireVerifiedUser } from "../middlewares/auth.middleware.js";
import {onlyUser} from "../middlewares/onlyUser.middleware.js"

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
  onlyUser,
  voteOnPoll
);

router.get(
  "/status/:pollId",
  verifyJWT,
  checkVoteStatus
);


export default router;