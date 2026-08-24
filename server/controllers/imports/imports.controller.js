
const mongoose = require("mongoose");

const { importInstagram, processingPosts } = require("../../services/insta-import.service");

const socialMediaController = {};

socialMediaController.unzip = async (req, res) => {
      try {
            const {userId} = req.body;
            console.log('userId', userId)
            console.log('req.file', req.file)
            if (!req.file || !userId) {
                return res.status(400).json({
                    message: "Instagram ZIP file or User Id is required",
                });
            }
    
            console.log("ZIP received:");
            console.log(req.file.path);
    
            const results = await importInstagram(req.file.path, userId);
    
            res.json({
                message: "Instagram ZIP received successfully",
                results,
            });
    
        } catch (error) {
            console.error("Instagram import error:", error);
    
            res.status(500).json({
                message: "Instagram import failed",
                error: error.message,
            });
        }
}

socialMediaController.processPosts = async (req, res) => {
    try {
        const { userId, limit, posts } = req.body;
        console.log('userId', userId)
        console.log('limit', limit)
        console.log('posts', posts.length)
        if (!userId) {
            return res.status(400).json({
                message: "User Id is required",
            });
        }

        const results = await processingPosts(posts, userId, limit);

        res.json({
            message: "Instagram posts processed successfully",
            results,
        });

    } catch (error) {
        console.error("Instagram processing error:", error);

        res.status(500).json({
            message: "Instagram processing failed",
            error: error.message,
        });
    }
}
module.exports = socialMediaController;