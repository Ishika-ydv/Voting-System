import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Poll from "../models/poll.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Vote from "../models/vote.model.js";


const createPoll = asyncHandler(async (req, res) => {
  const { title, description, startsAt, endsAt } = req.body;

  let options = req.body.options;

  // 🛑 If options come as string (form-data), parse it
  if (typeof options === "string") {
    options = JSON.parse(options);
  }

  // ✅ Validation
  if (!title || !options || !startsAt || !endsAt) {
    throw new ApiError(400, "All required fields must be provided");
  }

  if (!Array.isArray(options) || options.length < 2) {
    throw new ApiError(400, "At least 2 options are required");
  }

  // 📸 Handle uploaded images
  const optionImages = req.files?.optionImages || [];

  // ❌ Check if images are missing
  // if (optionImages.length !== options.length) {
  //   throw new ApiError(
  //     400,
  //     "Each option must have an image"
  //   );
  // }

  const uploadedImages = [];

  for (let file of optionImages) {
    const uploaded = await uploadOnCloudinary(file.path);

    if (!uploaded) {
      throw new ApiError(400, "Image upload failed");
    }

    uploadedImages.push(uploaded.secure_url);
  }

  // 🧠 Map options with images
  const formattedOptions = options.map((opt, index) => ({
    name: opt.name,
    description: opt.description || "",
    photo: uploadedImages[index] || "", // match by index
  }));

  // 🗳️ Create poll
  const poll = await Poll.create({
    title,
    description,
    options: formattedOptions,
    startsAt: new Date(startsAt),
    endsAt: new Date(endsAt),
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


const getPollById = asyncHandler(async (req, res) => {
  const { pollId } = req.params;

  const poll = await Poll.findById(pollId);

  if (!poll) {
    throw new ApiError(404, "Poll not found");
  }

  return res.status(200).json(
    new ApiResponse(200, poll, "Poll fetched successfully")
  );
});





const getAllPollResults = async (req, res) => {
  try {
    const now = new Date();

    // ✅ Step 1: Fetch ONLY ended polls
    const polls = await Poll.find({
      endsAt: { $lt: now },
    });

    // 👉 No ended polls
    if (!polls.length) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    // ✅ Step 2: Format response
    const formatted = polls.map((poll) => {
      const totalVotes = poll.options.reduce(
        (sum, opt) => sum + (opt.count || 0),
        0
      );

      // 🏆 Winner logic
      const maxVotes = Math.max(...poll.options.map(o => o.count || 0));
      const winners = poll.options.filter(o => o.count === maxVotes);

      const winner =
        totalVotes === 0
          ? null
          : winners.length > 1
          ? winners.map(w => w.name) // tie
          : winners[0].name;

      return {
        _id: poll._id,
        title: poll.title,
        totalVotes,
        winner,
        options: poll.options.map((opt) => ({
          _id: opt._id,
          text: opt.name,
          votes: opt.count || 0,
        })),
      };
    });

    // ✅ Step 3: Send response
    res.status(200).json({
      success: true,
      data: formatted,
    });

  } catch (err) {
    console.error("Admin Results Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch poll results",
    });
  }
};



const getUserPollResults = async (req, res) => {
  try {
    const userId = req.user._id;

    // ✅ Step 1: Find votes by this user
    const votes = await Vote.find({ userId });

    // 👉 If no votes
    if (!votes.length) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    // ✅ Step 2: Extract pollIds (unique)
    const pollIds = [
      ...new Set(votes.map((v) => v.pollId.toString())),
    ];

    // ✅ Step 3: Fetch those polls
    const polls = await Poll.find({
      _id: { $in: pollIds },
    });

    // ✅ Step 4: Format results
    const formatted = polls.map((poll) => {
      const totalVotes = poll.options.reduce(
        (sum, opt) => sum + (opt.count || 0),
        0
      );

      return {
        _id: poll._id,
        title: poll.title,
        totalVotes,
        options: poll.options.map((opt) => ({
          _id: opt._id,
          text: opt.name,
          votes: opt.count || 0,
        })),
      };
    });

    // ✅ Step 5: Send response
    res.status(200).json({
      success: true,
      data: formatted,
    });

  } catch (err) {
    console.error("User Results Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch user results",
    });
  }
};




export {
    createPoll,
    getActivePolls,
    getAllPolls,
    getPollResults,
    updatePoll,
    deletePoll,
    getPollById,
    getAllPollResults,
    getUserPollResults

}