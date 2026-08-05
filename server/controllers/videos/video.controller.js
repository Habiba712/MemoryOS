const mongoose = require("mongoose");
const Video = require("../../models/video.model");
const youtubeService = require("../../services/youtube.service");
const videoService = require("../../services/video.service");
const geminiService = require("../../services/gemini.service");


const videoController = {};

videoController.saveVideo = async (req, res) =>{
    try{

        const {user, title, videoUrl, thumbnailUrl, duration, platform} = req.body;

        if(!user){
            return res.status(400).json({"Message": "User is required"});


        }
        if(!videoUrl){
            return res.status(400).json({"Message": "videoUrl is required"});
        }
        let screenshotBuffer = null;

try {
    screenshotBuffer = await videoService.captureVideoFrame(videoUrl);
    console.log("Video frame captured:", screenshotBuffer.length);
} catch (err) {
    console.error("Could not capture video frame:", err.message);
}

let aiData= {

    title: title || "",
    aiDescription: "",
    summary: "",
    tags: [],
    category: "Other"
}

if( screenshotBuffer) {
    try{
        aiData = await geminiService.describeImage(
            screenshotBuffer,
            "image/png"
        );
    }catch(err){
        console.log("No image description available. Continuing video processing.");
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

console.log("Transcript length:", transcript.length);

       const newVideo = await Video.create({
            user: user,
            title: title || "",
            videoUrl,
            thumbnailUrl: thumbnailUrl || "",
            duration: duration || 0,
            platform: platform || "unknown",
            transcript,
            aiDescription: "",
            summary: "",
            tags: [],
            category: "Other",
            embedding: []
        });

        res.status(201).json({
            message: "Video saved successfully",
            video: newVideo
        });


    }catch(err){
       res.status(500).json({"Messafe": "Error saving video", "Error": err.message});
    }
}


module.exports = videoController;