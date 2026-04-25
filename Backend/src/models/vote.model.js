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

  // castedAt: {
  //   type: Date,
  //   default: Date.now,
  //   index: true,
  // },

  ip: {
    type: String,
    default: null,
  },

  userAgent: {
    type: String,
    default: null,
  },

  verified: {
    type: Boolean,
    default: false,
  },

  source: {
    type: String,
    enum: ["web", "mobile", "api"],
    default: "web",
  }
},{timestamps: true});

// 🔐 One user = one vote per poll
voteSchema.index({ userId: 1, pollId: 1 }, { unique: true });

// ⚡ Performance indexes
voteSchema.index({ pollId: 1 });
voteSchema.index({ pollId: 1, optionId: 1 });

voteSchema.index({ createdAt: -1 });

export default mongoose.model("Vote", voteSchema);