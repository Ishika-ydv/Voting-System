import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  pollId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Poll",
  },

  metadata: { type: Object },

  timestamp: { type: Date, default: Date.now },
});

// Indexes
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ pollId: 1, action: 1 });

export default mongoose.model("AuditLog", auditLogSchema);