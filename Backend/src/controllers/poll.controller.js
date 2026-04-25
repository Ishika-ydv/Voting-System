import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Poll from "../models/poll.model.js";

const createPoll = asyncHandler(async (req, res) => {
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
    name: opt.name,
    description: opt.description || "",
    photo: opt.photo || "",
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


const getActivePolls = async (req, res) => {
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

const getAllPolls = async (req, res) => {
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

const getPollResults = asyncHandler(async (req, res) => {
  const { pollId } = req.params;

  const poll = await Poll.findById(pollId);

  if (!poll) {
    throw new ApiError(404, "Poll not found");
  }

  // 🔥 Always calculate (safe)
  const totalVotes = poll.options.reduce(
    (sum, opt) => sum + opt.count,
    0
  );

  const results = poll.options.map((opt) => {
    const percentage =
      totalVotes === 0
        ? 0
        : ((opt.count / totalVotes) * 100).toFixed(2);

    return {
      optionId: opt._id,
      option: opt.name,
      votes: opt.count,
      percentage: Number(percentage),
    };
  });

  // 🏆 Winner logic (safe)
  const maxVotes = Math.max(...results.map(r => r.votes));
const winners = results.filter(r => r.votes === maxVotes);

let winner = null;

if (totalVotes > 0) {
  winner =
    winners.length > 1
      ? winners.map(w => w.option) // tie case
      : winners[0].option;
}

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        pollId,
        totalVotes,
        results,
        winner,
      },
      "Poll results fetched successfully"
    )
  );
});

const updatePoll = asyncHandler(async (req, res) => {
  const { pollId } = req.params;
  const { title, description, startsAt, endsAt } = req.body;

  const poll = await Poll.findById(pollId);

  if (!poll) {
    throw new ApiError(404, "Poll not found");
  }

  // Prevent editing after start
  if (poll.startsAt < new Date()) {
    throw new ApiError(400, "Cannot update active/ended poll");
  }

  const updatedPoll = await Poll.findByIdAndUpdate(
    pollId,
    {
      $set: {
        title,
        description,
        startsAt,
        endsAt,
      },
    },
    { new: true }
  );

  return res.status(200).json(
    new ApiResponse(200, updatedPoll, "Poll updated successfully")
  );
});


const deletePoll = asyncHandler(async (req, res) => {
  const { pollId } = req.params;

  const poll = await Poll.findById(pollId);

  if (!poll) {
    throw new ApiError(404, "Poll not found");
  }

  await poll.deleteOne();

  return res.status(200).json(
    new ApiResponse(200, {}, "Poll deleted successfully")
  );
});

export {
    createPoll,
    getActivePolls,
    getAllPolls,
    getPollResults,
    updatePoll,
    deletePoll

}