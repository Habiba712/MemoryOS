const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // -------------------------
    // Basic content information
    // -------------------------

    originalName: {
      type: String,
      trim: true,
      required: false,
    },

    title: {
      type: String,
      default: "",
    },

    fileType: {
      type: String,
      enum: ["image", "pdf", "document", "video", "reel", "other"],
      required: true,
    },

    sourceType: {
      type: String,
      enum: ["file", "url"],
      default: "file",
      required: true,
    },

    // Where the content is stored / original URL
    url: {
      type: String,
      required: false,
    },

    mimeType: {
      type: String,
      required: false,
    },

    size: {
      type: Number,
      required: false,
    },

    favorite: {
      type: Boolean,
      default: false,
    },

    // -------------------------
    // Cloudinary metadata
    // Optional because URL-imported content
    // may not have Cloudinary data
    // -------------------------

    publicId: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
    },

    thumbnailUrl: {
      type: String,
      default: "",
    },

    // -------------------------
    // Video-specific metadata
    // -------------------------

    platform: {
      type: String,
      required: false,
      // Examples: YouTube, Instagram
    },

    duration: {
      type: Number,
      required: false,
    },

    transcript: {
      type: String,
      default: "",
    },

    // -------------------------
    // AI / semantic search
    // -------------------------

    aiDescription: {
      type: String,
      default: "",
    },

    extractedText: {
      type: String,
      default: "",
    },

    summary: {
      type: String,
      default: "",
    },

    embedding: {
      type: [Number],
      default: [],
    },

    tags: {
      type: [String],
      default: [],
    },

    category: {
      type: String,
      default: "Other",
    },

    // -------------------------
    // Processing state
    // -------------------------

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

    // -------------------------
    // File-type-specific metadata
    // -------------------------

    pageCount: {
      type: Number,
      required: false,
    },

    dimensions: {
      width: Number,
      height: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Regular text search
fileSchema.index({
  extractedText: "text",
  summary: "text",
  tags: "text",
  transcript: "text",
});

module.exports = mongoose.model("File", fileSchema);