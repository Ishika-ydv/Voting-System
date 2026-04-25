import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Poll from "../models/poll.model.js";

export const createPoll = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    options,
    startsAt,
    endsAt,
  } = req.body;

  // 1. Validation
  if (!title || !options || !startsAt || !endsAt) {
    throw new ApiError(400, "All required fields must be provided");
  }

  if (!Array.isArray(options) || options.length < 2) {
    throw new ApiError(400, "At least 2 options are required");
  }

  // 2. Format options
  const formattedOptions = options.map((opt) => ({
    name: opt,
  }));

  // 3. Create Poll
  const poll = await Poll.create({
    title,
    description,
    options: formattedOptions,
    startsAt: new Date(startsAt), // admin value
    endsAt: new Date(endsAt),     // admin value
    createdBy: req.user._id,
    organization: req.user.organization,
  });

  return res.status(201).json(
    new ApiResponse(201, poll, "Poll created successfully")
  );
});


export const getActivePolls = async (req, res) => {
  const now = new Date();

  const polls = await Poll.find({
    startsAt: { $lte: now },
    endsAt: { $gt: now }
  });

  return res.status(200).json({
    success: true,
    data: polls
  });
};

export const getAllPolls = async (req, res) => {
  const now = new Date();

  const polls = await Poll.find();

  const data = polls.map((poll) => {
    let status = "ACTIVE";

    if (poll.startsAt > now) {
      status = "UPCOMING";
    } else if (poll.endsAt < now) {
      status = "ENDED";
    }

    return {
      ...poll._doc,
      status
    };
  });

  return res.status(200).json({
    success: true,
    data
  });
};