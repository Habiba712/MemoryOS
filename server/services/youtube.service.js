const { YoutubeTranscript } = require("youtube-transcript");

const youtubeService = {};

youtubeService.getTranscript = async (videoUrl, instagramCaption = "") => {

    console.log('captoion', instagramCaption)
    try {
        // Instagram
        if (
            videoUrl.includes("instagram.com") &&
            instagramCaption
        ) {
            return instagramCaption
                .replace(/\s+/g, " ")
                .trim();
        }

        // YouTube
        let normalizedUrl = videoUrl;

        const shortsMatch = videoUrl.match(
            /youtube\.com\/shorts\/([^?&/]+)/
        );

        if (shortsMatch) {
            normalizedUrl = `https://www.youtube.com/watch?v=${shortsMatch[1]}`;
        }

        const transcript = await YoutubeTranscript.fetchTranscript(
            normalizedUrl
        );

        return transcript
            .map((item) => item.text)
            .join(" ")
            .replace(/\s+/g, " ")
            .trim();

    } catch (err) {
        console.error("Transcript error:", err);
        // throw new Error("Could not retrieve transcript");
    }
};

module.exports = youtubeService;