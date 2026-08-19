const { YoutubeTranscript } = require("youtube-transcript");

const youtubeService = {};

youtubeService.getTranscript = async (videoUrl, instagramCaption = "") => {
    try {
      
        if (videoUrl.includes("instagram.com")) {
            console.log("Instagram text:", instagramCaption);

            return (instagramCaption || "")
                .replace(/\s+/g, " ")
                .trim();
        }
 
        if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {

            let normalizedUrl = videoUrl;

            const shortsMatch = videoUrl.match(
                /youtube\.com\/shorts\/([^?&/]+)/
            );

            if (shortsMatch) {
                normalizedUrl =
                    `https://www.youtube.com/watch?v=${shortsMatch[1]}`;
            }

            const transcript =
                await YoutubeTranscript.fetchTranscript(normalizedUrl);

            return transcript
                .map((item) => item.text)
                .join(" ")
                .replace(/\s+/g, " ")
                .trim();
        }
 
        return "";

    } catch (err) {
        console.error("Transcript error:", err.message);
        return "";
    }
};

module.exports = youtubeService;