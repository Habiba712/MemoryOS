const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    url: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    domain: {
      type: String,
      default: "",
    },

    thumbnailUrl: {
      type: String,
      default: "",
    },

    // Text extracted from the webpage
    extractedText: {
      type: String,
      default: "",
    },

    // AI-generated information
    aiDescription: {
      type: String,
      default: "",
    },

    summary: {
      type: String,
      default: "",
    },

    tags: {
      type: [String],
      default: [],
    },

    category: {
      type: String,
      default: "Other",
    },

    embedding: {
      type: [Number],
      default: [],
    },

    favorite: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
      index: true,
    },

    processingError: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

urlSchema.index({
  extractedText: "text",
  summary: "text",
  tags: "text",
  title: "text",
});

module.exports = mongoose.model("Url", urlSchema);