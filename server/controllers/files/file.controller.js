


const mongoose = require("mongoose");
const cloudinary = require("../../config/cloudinary");
const File = require("../../models/file.model")
const streamifier = require("streamifier");
const geminiService = require("../../services/gemini.service");
const embeddingService = require("../../services/embedding.service");
const ocrService = require("../../services/ocr.service");


const fileController = {};

fileController.createFile = async (req, res) => {
    try {
        console.log(req.file, req.body)
        if (!req.file) {
            return res.status(400).json({ "message": "No file provided" })
        }

        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { resource_type: "auto" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );

            streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

        let fileType = "document";

        if (req.file.mimetype.startsWith("image/")) fileType = "image";
        else if (req.file.mimetype === "application/pdf") fileType = "pdf";

        let extractedText = "";
        if(fileType === "image" ) {
            extractedText = await ocrService.extractText(req.file.buffer);
        }
        let aiData = null;

        if (fileType === "image") {
            aiData = await geminiService.describeImage(
                req.file.buffer,
                req.file.mimetype
            );

            // console.log(aiData);
        }

        const textForEmbedding = `
        Titre: ${aiData.title}
        Description: ${aiData.description}
        Tags: ${aiData.tags.join(", ")}
        Category: ${aiData.category}
        OCR: ${extractedText}
        `
        console.log(textForEmbedding)
        const embedding = await embeddingService.generateEmbedding(textForEmbedding);
        const newFile = await File.create({
            user: req.body.user,
            originalName: req.file.originalname,
            publicId: uploadResult.public_id,
            url: uploadResult.secure_url,
            title: aiData.title,
            category: aiData.category,
            tags: aiData.tags,
            fileType: fileType,
            mimeType: req.file.mimetype,
            size: req.file.size,
            aiDescription: aiData.description,
            embedding,
            extractedText
        });

        console.log(embedding)
        res.status(201).json({ newFile, aiData, embedding });

    } catch (err) {
        return res.status(500).json({ "message": "server error", "error": err.message })
    }
}

fileController.getFiles = async (req, res) => {
    // Every file and every query is converted into a semantic embedding. MongoDB Atlas Vector Search retrieves the closest vectors using cosine similarity.
    const { q } = req.query;
    const queryEmbedding = await embeddingService.generateEmbedding(q);
    if (!q) {

        return res.status(400).json({
            message: "Search query is required"
        })
    }

    const files = await File.aggregate(
        [
           {
                $vectorSearch: {
                    index: "default",
                    path: "embedding",
                    queryVector: queryEmbedding,
                    numCandidates: 100,
                    limit: 10
                }
            }
    ]
    )

    res.status(200).json(files);
}

module.exports = fileController;