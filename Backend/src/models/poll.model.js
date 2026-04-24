import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
    },
    name: {
        type: String,
        required: true 
    },
    count: {
        type: Number, 
        default: 0 
    },
});

const pollSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true 
    },
    description:{
        type: String 
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
    },

    options: [optionSchema],

    startsAt: {
        type: Date,
        required: true 
    },
    endsAt: {
        type: Date, 
        required: true 
    },

    isActive: {
        type: Boolean, 
        default: false, 
        index: true 
    },
    resultDeclared: {
        type: Boolean, 
        default: false 
    },

    totalVotes: { 
        type: Number, 
        default: 0 
    },

    createdAt: { 
        type: Date, 
        default: Date.now 
    },
});

// Indexes
pollSchema.index({ isActive: 1, endsAt: 1 });
pollSchema.index({ organization: 1, isActive: 1 });

export default mongoose.model("Poll", pollSchema);