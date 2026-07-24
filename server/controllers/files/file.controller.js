


const mongoose = require("mongoose");
const cloudinary = require("../../config/cloudinary");
const File = require("../../models/file.model")
const streamifier = require("streamifier");


const fileController = {};

fileController.createFile = async (req, res) => {
    try{
        console.log(req.file, req.body)
        if(!req.file){
            return res.status(400).json({"message": "No file provided"})
        }

        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { resource_type: "auto"},
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );

            streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

        let fileType = "document";
        if(req.file.mimetype.startsWith("image/")) fileType = "image";
        else if (req.file.mimetype === "application/pdf") fileType = "pdf";

        const newFile = await File.create({
            user: req.body.user,
            originalName: req.file.originalname,
            publicId: uploadResult.public_id,
            url: uploadResult.secure_url,
            fileType: fileType,
            mimeType: req.file.mimetype,
            size: req.file.size
        });

        res.status(201).json(newFile);

    }catch(err){
        return res.status(500).json({"message": "server error", "error":err.message})
    }
}

module.exports = fileController;