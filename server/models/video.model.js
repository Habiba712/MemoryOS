const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        title: {
            type: String,
            required: false
        },
        videoUrl:{
            type: String,
            required: true,
        },
        thumbnailUrl:{
            type: String,
            required: true,
        },
       duration: {
           type: Number,
           required: true,
       },
       platform: {
           type: String,
           required: true,
       },
       transcript:{
           type:String,
       },
       size: {
      type: Number, // bytes
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

     status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
      index: true,
    },
    },
    {
        timestamps: true,
    }
)

const Video = mongoose.model("Video", fileSchema);

module.exports = Video;