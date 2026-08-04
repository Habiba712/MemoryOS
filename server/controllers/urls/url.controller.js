
const mongoose = require("mongoose");
const cloudinary = require("../../config/cloudinary");
const streamifier = require("streamifier");
const fetch = require("node-fetch");
const cheerio = require("cheerio");
const axios = require("axios");

const Url = require("../../models/url.model");
const geminiService = require("../../services/gemini.service");
const embeddingService = require("../../services/embedding.service");

const urlController = {};

urlController.saveUrl = async (req, res) => {
    console.log("saveUrl", req.body);
    console.log("saveUrl", req.headers.authorization);
    try {

        const { title, url, user, screenshot } = req.body;

        if(!screenshot){
            return res.status(400).json({
                message: "Screenshot is required"
            });
        }
        else{
            const base64Data= screenshot.replace(/^data:image\/\w+;base64,/, "");

        }

        const screenshotBuffer = Buffer.from(base64Data, "base64");


        const uploadResult = await new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { resource_type: "auto" },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
        
                    streamifier.createReadStream(screenshotBuffer).pipe(stream);
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
        if (!url) {
            return res.status(400).json({
                message: "URL is required"
            });
        }

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }



        const response = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        });

        const html = response.data;

        const $ = cheerio.load(html);

        $("script").remove();
        $("style").remove();
        $("noscript").remove();

        const extractedText = $("screenshotBuffer")
            .text()
            .replace(/\s+/g, " ")
            .trim();

        console.log("Extracted text length:", extractedText.length);

        const aiData = await geminiService.describeImage(extractedText);

        console.log("AI data:", aiData);

        const textForEmbedding = `
        Title: ${aiData.title || title}
        Description: ${aiData.description || ""}
        Summary: ${aiData.summary || ""}
        Tags: ${(aiData.tags || []).join(", ")}
        Category: ${aiData.category || ""}
        Content: ${extractedText}
        `;

        const embedding =
            await embeddingService.generateEmbedding(
                textForEmbedding
            );


        const newUrl = await Url.create({

            user: user,

            title: aiData.title || title,

            url: url,

            originalTitle: title,

            aiDescription: aiData.description || "",

            summary: aiData.summary || "",

            extractedText: extractedText,

            tags: aiData.tags || [],

            category: aiData.category || "Other",
            contentSize: Buffer.byteLength(extractedText, "utf8"),

            embedding: embedding,
            thumbnailUrl,
            faviconUrl: `https://www.google.com/s2/favicons?domain=${url}&sz=128`

        });

        res.status(201).json({
            message: "URL saved successfully",
            newUrl
        });

    } catch (err) {

        console.error("saveUrl error:", err);

        res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
};
urlController.getUrlsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const urls = await Url.find({ user: userId });
        res.status(200).json({ urls });
    } catch (err) {
        console.error("getUrlsByUser error:", err);
        res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
};

urlController.getUrl = async (req, res) => {
    try {
        const { id } = req.params;
        const url = await Url.findById(id);
        res.status(200).json(url);
    } catch (err) {
        console.error("getUrl error:", err);
        res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
};

module.exports = urlController;