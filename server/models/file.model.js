const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // --- Cloudinary storage info ---
    originalName: {
      type: String,
      required: true,
      trim: true,
    },
    publicId: {
      // Cloudinary's asset identifier — needed for delete/transform operations
      type: String,
      required: true,
      unique: true,
    },
    url: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      // Cheaper to render in search results/grids than the full file
      type: String,
        required: false
    },

    // --- File classification ---
    fileType: {
      type: String,
      enum: ["image", "pdf", "document"],
      required: true,
    },
    title: {
        type: String,
        required: false
    },
    mimeType: {
      type: String,
      required: true, // e.g. "image/png", "application/pdf"
    },
    favorite :{
        type: Boolean,
        default: false
    },
    size: {
      type: Number, // bytes
      required: true,
    },
    aiDescription: {
        type: String,
        required: false
    },

    // --- Semantic search core ---
    extractedText: {
      // OCR output (images) or parsed text (PDFs/docs)
      type: String,
      default: "",
    },
    summary: {
      // AI-generated short description/caption — very useful for images with sparse text
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
    category:{
        type: String

    },

    // --- Processing pipeline state ---
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

    // --- File-type-specific metadata ---
    pageCount: {
      type: Number, // for PDFs/documents
    },
    dimensions: {
      width: Number,
      height: Number, // for images
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

// Speeds up text-based fallback search (in addition to vector search)
fileSchema.index({ extractedText: "text", summary: "text", tags: "text" });

module.exports = mongoose.model("File", fileSchema);