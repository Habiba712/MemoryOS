const { YoutubeTranscript } = require("youtube-transcript");

const youtubeService = {};

youtubeService.getTranscript = async (videoUrl) => {
    try {
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
        console.error("YouTube transcript error:", err);
        throw new Error("Could not retrieve YouTube transcript");
    }
};

module.exports = youtubeService;