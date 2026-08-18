
const mongoose = require("mongoose");

const { importInstagram } = require("../../services/insta-import.service");

const socialMediaController = {};

socialMediaController.unzip = async (req, res) => {
      try {
            const {limit, userId} = req.body;
            if (!req.file || !userId) {
                return res.status(400).json({
                    message: "Instagram ZIP file or USer Id is required",
                });
            }
    
            console.log("ZIP received:");
            console.log(req.file.path);
    
            const results = await importInstagram(req.file.path, userId, limit);
    
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

module.exports = socialMediaController;