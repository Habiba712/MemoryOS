const mongoose = require("mongoose");
const Video = require("../../models/video.model");
const youtubeService = require("../../services/youtube.service");
const videoService = require("../../services/video.service");
const geminiService = require("../../services/gemini.service");
const embeddingService = require("../../services/embedding.service");
const File = require("../../models/file.model");
const fs = require("fs/promises");

const videoController = {};
async function callGeminiWithRetry(fn, maxRetries = 3) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn();
        } catch (err) {
            const isOverloaded = err.message?.includes("UNAVAILABLE") || err.message?.includes("503");
            if (!isOverloaded || attempt === maxRetries - 1) throw err;
            const delay = 1000 * Math.pow(2, attempt); // 1s, 2s, 4s
            console.log(`Gemini overloaded, retrying in ${delay}ms...`);
            await new Promise((r) => setTimeout(r, delay));
        }
    }
}

videoController.saveVideo = async (req, res) => {
    try {
        const { user, videoUrl, caption} = req.body;
console.log('user',user);
console.log('videoUrl',videoUrl);
        if (!user) {
            return res.status(400).json({ "Message": "User is required" });
        }
        if (!videoUrl) {
            return res.status(400).json({ "Message": "videoUrl is required" });
        }

        const videoMetaData = await videoService.getVideoMetadata(videoUrl);
        const { platform, duration, thumbnailUrl, title } = videoMetaData;

        console.log('platform', platform)

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
            console.log("entering ai block");
            try {
               aiData = await callGeminiWithRetry(() => geminiService.describeVideo(videoBuffer, "video/mp4"));
                console.log('aiData', aiData);
            } catch (err) {
                console.log("No video description available:", err.message);
            }
        }
 
        let transcript = "";

        if (platform === "youtube" || platform === "Instagram") {
            console.log("Getting transcript", caption || "");
                transcript = await youtubeService.getTranscript(videoUrl, caption || "");
            
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

        const newVideo = await File.create({
            user: user,
            title: aiData.title || "",
            videoUrl,
            thumbnailUrl: thumbnailUrl || "",
            duration: duration || 0,
            platform: platform || "unknown",
            fileType: duration > 0 ? "reel": "other",
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

videoController.getVideoFiles = async (req, res) => {   
    try {
        const {userId} = req.params;
        console.log('userId', userId);
        const videos = await Video.find({ user: userId });
        // const videos = res.videos;
        console.log('videos', videos);
       res.status(200).json({ videos });
    } catch (err) {
        console.log("Error getting videos:", err.message);
        res.status(500).json({ message: "Error getting videos", error: err.message });
    }
}
videoController.getOneVideoFile = async (req, res) => {
    try {
        const {id} = req.params;
        console.log('id', id);
        const video = await Video.findById(id);
        // const videos = res.videos;
        console.log('video', video);
        if (!video) {
    return res.status(404).json({
        message: "Video not found",
    });
}
       res.status(200).json({ video });
    } catch (err) {
        console.log("Error getting videos:", err.message);
        res.status(500).json({ message: "Error getting videos", error: err.message });
    }
}
module.exports = videoController;