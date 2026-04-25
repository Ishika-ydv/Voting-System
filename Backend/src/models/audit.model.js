import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: [
        "USER_REGISTERED",
        "USER_LOGIN",
        "OTP_SENT",
        "OTP_VERIFIED",
        "POLL_CREATED",
        "POLL_UPDATED",
        "POLL_DELETED",
        "VOTE_CAST",
      ],
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    pollId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Poll",
    },

    metadata: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

// Indexes
auditLogSchema.index({ userId: 1, createdAt: -1 });
auditLogSchema.index({ pollId: 1, action: 1 });

export default mongoose.model("AuditLog", auditLogSchema);