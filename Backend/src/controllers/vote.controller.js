import mongoose from "mongoose";
import Poll from "../models/poll.model.js";
import Vote from "../models/vote.model.js";
import { isPollActive } from "../utils/poll.utils.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const voteOnPoll = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const { pollId, optionId } = req.body;
  const userId = req.user._id;

  // 1. Find poll
  const poll = await Poll.findById(pollId).session(session);

  if (!poll) {
    throw new ApiError(404, "Poll not found");
  }

  // 2. Check active (time-based)
  if (!isPollActive(poll)) {
    throw new ApiError(400, "Poll is not active");
  }

  // 3. Check duplicate vote
  const alreadyVoted = await Vote.findOne({
    userId,
    pollId,
  }).session(session);

  if (alreadyVoted) {
    throw new ApiError(400, "You have already voted");
  }

  // 4. Validate option
  const option = poll.options.id(optionId);

  if (!option) {
    throw new ApiError(404, "Invalid option");
  }

  // 5. Update counts
  option.count += 1;
  poll.totalVotes += 1;

  // 6. Save vote
  await Vote.create(
    [
      {
        userId,
        pollId,
        optionId,
      },
    ],
    { session }
  );

  // 7. Save poll
  await poll.save({ session });

  // 8. Commit transaction
  await session.commitTransaction();
  session.endSession();

  return res.status(200).json(
    new ApiResponse(200, null, "Vote submitted successfully")
  );
});