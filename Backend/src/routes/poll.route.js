import { Router } from "express";
import { createPoll, getActivePolls, getAllPolls, getPollResults, updatePoll,deletePoll, getPollById, getAllPollResults,getUserPollResults} from "../controllers/poll.controller.js";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Admin only
router.post(
  "/create",
  verifyJWT,
  verifyRole("admin", "superadmin"),
  upload.fields([
    { name: "optionImages", maxCount: 10 }
  ]),
  createPoll
);

router.get("/active", getActivePolls);//active polls
router.get("/all", getAllPolls);//All poll with status
router.get("/:pollId/results", verifyJWT, getPollResults);

router.get("/results/user", verifyJWT, getUserPollResults);

router.get("/results/all", verifyJWT, verifyRole("admin"), getAllPollResults);
router.get("/:pollId", getPollById);

router.patch(
  "/:pollId",
  verifyJWT,
  verifyRole("admin"),
  updatePoll
);

router.delete(
  "/:pollId",
  verifyJWT,
  verifyRole("admin"),
  deletePoll
);




export default router;