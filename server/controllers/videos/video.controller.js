const mongoose = require("mongoose");
const Video = require("../../models/video.model");
const youtubeService = require("../../services/youtube.service");
const videoService = require("../../services/video.service");
const geminiService = require("../../services/gemini.service");
const embeddingService = require("../../services/embedding.service");


const videoController = {};

videoController.saveVideo = async (req, res) => {
    try {
        const { user, videoUrl} = req.body;

        if (!user) {
            return res.status(400).json({ "Message": "User is required" });
        }
        if (!videoUrl) {
            return res.status(400).json({ "Message": "videoUrl is required" });
        }

        const videoMetaData = await videoService.getVideoMetadata(videoUrl);
        const { platform, duration, thumbnailUrl, title } = videoMetaData;

        let videoBuffer = null;

        try {
            videoBuffer = await videoService.downloadVideoClip(videoUrl);
            console.log("Video clip downloaded:", videoBuffer.length);
        } catch (err) {
            console.error("Could not download video clip:", err.message);
        }

        let aiData = {
            title: title || "",
            description: "",
            summary: "",
            tags: [],
            category: "Other"
        };

        if (videoBuffer) {
            try {
                aiData = await geminiService.describeVideo(
                    videoBuffer,
                    "video/mp4"
                );
            } catch (err) {
                console.log("No video description available:", err.message);
            }
        }
 
        let transcript = "";

        if (platform === "youtube") {
            try {
                transcript = await youtubeService.getTranscript(videoUrl);
            } catch (err) {
                console.log("No transcript available. Continuing video processing.");
            }
        }
        const textForEmbedding = `
                Title: ${aiData.title || title || ""}
                Description: ${aiData.description || ""}
                Summary: ${aiData.summary || ""}
                Tags: ${(aiData.tags || []).join(", ")}
                Category: ${aiData.category || ""}
                Transcript: ${transcript || ""}
                `;

        const embedding = await embeddingService.generateEmbedding(
            textForEmbedding
        );

        console.log("Video embedding length:", embedding.length);

        console.log("Transcript length:", transcript.length);

        const newVideo = await Video.create({
            user: user,
            title: aiData.title || "",
            videoUrl,
            thumbnailUrl: thumbnailUrl || "",
            duration: duration || 0,
            platform: platform || "unknown",
            transcript: transcript || "",
            aiDescription: aiData.description || "",
            summary: aiData.summary || "",
            tags: aiData.tags || [],
            category: aiData.category || "Other",
            embedding,
        });

        res.status(201).json({
            message: "Video saved successfully",
            video: newVideo
        });


    } catch (err) {
        console.log("No video description available:", err.message); // add the err.message part
        res.status(500).json({ message: "Error saving video", error: err.message });
    }
}


module.exports = videoController;