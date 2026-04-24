import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  pollId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Poll",
    required: true,
  },

  optionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  castedAt: { type: Date, default: Date.now },

  ip: { type: String },
  userAgent: { type: String },

  verified: { type: Boolean, default: false },
});

// Unique constraint → ONE USER = ONE VOTE
voteSchema.index({ userId: 1, pollId: 1 }, { unique: true });

// Other indexes
voteSchema.index({ pollId: 1 });
voteSchema.index({ castedAt: 1 });

export default mongoose.model("Vote", voteSchema);