import { Router } from "express";
import { createPoll, getActivePolls, getAllPolls } from "../controllers/poll.controller.js";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";

const router = Router();

// Admin only
router.post(
  "/create",
  verifyJWT,
  verifyRole("admin", "superadmin"),
  createPoll
);

router.get("/active", getActivePolls);//active polls
router.get("/all", getAllPolls);//All poll with status

export default router;