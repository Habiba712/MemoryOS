


const mongoose = require("mongoose");
const cloudinary = require("../../config/cloudinary");
const File = require("../../models/file.model")
const streamifier = require("streamifier");
const geminiService = require("../../services/gemini.service");
const embeddingService = require("../../services/embedding.service");
const ocrService = require("../../services/ocr.service");
const pdfService = require("../../services/pdf.service");

const fileController = {};

fileController.getFile = async (req, res) => {
    const file = await File.findById(req.params.id);
    res.status(200).json(file);
}

fileController.createFile = async (req, res) => {
    try {
        // console.log(req.file, req.body)
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
        let thumbnailUrl = cloudinary.url(uploadResult.public_id, {
            transformation: [
                {
                    width: 600,
                    height: 600,
                    crop: "fill",
                    quality: "auto",
                    fetch_format: "auto",
                },
            ],
            secure: true,
        });



        let fileType = "document";

        const mime = req.file.mimetype;



        if (mime.startsWith("image/")) fileType = "image";
        else if (mime === "application/pdf") fileType = "pdf";
        else if (mime.startsWith("video/")) fileType = "video";
        else if (mime.startsWith("audio/")) fileType = "audio";
        else if (mime.includes("word")) fileType = "docx";
        else if (mime.startsWith("text/")) fileType = "text";
        else if (mime.startsWith("text/") || req.file.originalname.endsWith(".srt")
        ) {
            fileType = "text";
        }

        let extractedText = "";

        let aiData = {
            title: req.file.originalname,
            description: "",
            summary: "",
            tags: [],
            category: "Other"
        };
        // console.log("fileType", fileType)
        if (fileType === "image") {
            extractedText = await ocrService.extractText(req.file.buffer);
            aiData = await geminiService.describeImage(
                req.file.buffer,
                req.file.mimetype
            );
        }

        else if (fileType === "pdf") {
            extractedText = await pdfService.extractText(req.file.buffer);
            aiData = await geminiService.describeText(extractedText);
            thumbnailUrl = cloudinary.url(uploadResult.public_id + ".png", {
                width: 300,
                crop: "fill",
                page: 1,
            });
        }
        else if (fileType === "text") {
            extractedText = req.file.buffer.toString("utf8");

            aiData = await geminiService.describeText(extractedText);
        }
        else if (fileType === "docx") {

            extractedText = await docxService.extractText(req.file.buffer);

            aiData = await geminiService.describeText(extractedText);
        }
        // console.log("aiData", aiData)
        const textForEmbedding = `
        Titre: ${aiData.title}
        Description: ${aiData.description}
        Tags: ${aiData.tags.join(", ")}
        Category: ${aiData.category}
        Summary: ${aiData.summary}
        OCR: ${extractedText}
        `
        // console.log(textForEmbedding)
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
            summary: aiData.summary,
            thumbnailUrl,
            embedding,
            extractedText
        });

        // console.log(embedding)
        res.status(201).json({ newFile, aiData, embedding });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ "message": "server error", "error": err.message })
    }
}
fileController.saveUrl = async (req, res) => {
    try {
        // console.log(req.file, req.body)
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
        let thumbnailUrl = uploadResult.secure_url;



        let fileType = "document";

        const mime = req.file.mimetype;



        if (mime.startsWith("image/")) fileType = "image";
        else if (mime === "application/pdf") fileType = "pdf";
        else if (mime.startsWith("video/")) fileType = "video";
        else if (mime.startsWith("audio/")) fileType = "audio";
        else if (mime.includes("word")) fileType = "docx";
        else if (mime.startsWith("text/")) fileType = "text";
        else if (mime.startsWith("text/") || req.file.originalname.endsWith(".srt")
        ) {
            fileType = "text";
        }

        let extractedText = "";

        let aiData = {
            title: req.file.originalname,
            description: "",
            summary: "",
            tags: [],
            category: "Other"
        };
        // console.log("fileType", fileType)
        if (fileType === "image") {
            extractedText = await ocrService.extractText(req.file.buffer);
            aiData = await geminiService.describeImage(
                req.file.buffer,
                req.file.mimetype
            );
        }

        else if (fileType === "pdf") {
            extractedText = await pdfService.extractText(req.file.buffer);
            aiData = await geminiService.describeText(extractedText);
            thumbnailUrl = cloudinary.url(uploadResult.public_id + ".png", {
                width: 300,
                crop: "fill",
                page: 1,
            });
        }
        else if (fileType === "text") {
            extractedText = req.file.buffer.toString("utf8");

            aiData = await geminiService.describeText(extractedText);
        }
        else if (fileType === "docx") {

            extractedText = await docxService.extractText(req.file.buffer);

            aiData = await geminiService.describeText(extractedText);
        }
        // console.log("aiData", aiData)
        const textForEmbedding = `
        Titre: ${aiData.title}
        Description: ${aiData.description}
        Tags: ${aiData.tags.join(", ")}
        Category: ${aiData.category}
        Summary: ${aiData.summary}
        OCR: ${extractedText}
        `
        // console.log(textForEmbedding)
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
            summary: aiData.summary,
            thumbnailUrl,
            embedding,
            extractedText
        });

        // console.log(embedding)
        res.status(201).json({ newFile, aiData, embedding });

    } catch (err) {
        console.error(err);
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

fileController.getFilesByUser = async (req, res) => {
    const { userId } = req.params;
    const files = await File.find({ user: userId }).populate("user");
    res.status(200).json(files);
}

module.exports = fileController;