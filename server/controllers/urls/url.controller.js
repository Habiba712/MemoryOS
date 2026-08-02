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

        const { title, url, user } = req.body;

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

        const extractedText = $("body")
            .text()
            .replace(/\s+/g, " ")
            .trim();

        console.log("Extracted text length:", extractedText.length);

        const aiData = await geminiService.describeText(extractedText);

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
            thumbnailUrl: `https://www.google.com/s2/favicons?domain=${url}`,

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