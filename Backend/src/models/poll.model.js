import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    default: "",
  },

  photo: {
    type: String,
    default: "",
  },

  count: {
    type: Number,
    default: 0,
  },
});

const pollSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    organization: {
      type: String,
      required: true,
      index: true,
      trim: true
    },

    options: {
      type: [optionSchema],
      validate: {
        validator: (arr) => arr.length >= 2,
        message: "At least 2 options required"
      }
    },

    startsAt: {
      type: Date,
      required: true
    },

    endsAt: {
      type: Date,
      required: true
    },

    // isActive: {
    //   type: Boolean,
    //   default: false,
    //   index: true
    // },

    resultDeclared: {
      type: Boolean,
      default: false
    },

    totalVotes: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// Validate dates
pollSchema.pre("save", function (next) {
  if (this.endsAt <= this.startsAt) {
    return next(new Error("End date must be after start date"));
  }
  //next();
});

// Indexes
pollSchema.index({ isActive: 1, endsAt: 1 });
pollSchema.index({ organization: 1, isActive: 1 });

export default mongoose.model("Poll", pollSchema);