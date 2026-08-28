const YTDlpWrap = require("yt-dlp-wrap").default;
const ffmpegPath = require("ffmpeg-static");
const { execFile } = require("child_process");
const util = require("util");
const execFileAsync = util.promisify(execFile);
const fs = require("fs/promises");
const os = require("os");
const path = require("path");

const ytDlpWrap = new YTDlpWrap(); 

const videoService = {};

videoService.getVideoMetadata = async (videoUrl) => {
    const { stdout } = await execFileAsync("yt-dlp", ["-j", videoUrl]);
    const meta = JSON.parse(stdout);

    return {
        platform: meta.extractor_key || meta.extractor || "unknown", // e.g. "Pinterest", "Youtube"
        duration: meta.duration || 0,          // in seconds
        thumbnailUrl: meta.thumbnail || "",
        title: meta.title || ""
    };
};

videoService.captureVideoFrame = async (videoUrl, maxFrames = 4) => {
    const dir = os.tmpdir();
    const prefix = `frames-${Date.now()}`;
    const pattern = path.join(dir, `${prefix}-%02d.jpg`);

    try {
        const { stdout } = await execFileAsync("yt-dlp", ["-f", "bv", "-g", videoUrl]);
        const directUrl = stdout.trim().split("\n")[0];

      
        await execFileAsync(ffmpegPath, [
            "-y",
            "-i", directUrl,
            "-vf", "fps=1/3",
            "-frames:v", String(maxFrames),
            "-q:v", "2",
            pattern
        ]);

        const buffers = [];
        for (let i = 1; i <= maxFrames; i++) {
            const framePath = path.join(dir, `${prefix}-${String(i).padStart(2, "0")}.jpg`);
            try {
                buffers.push(await fs.readFile(framePath));
                await fs.unlink(framePath).catch(() => {});
            } catch {
                break; 
            }
        }
        return buffers;  
    } catch (err) {
        throw err;
    }
};

videoService.downloadVideoClip = async (videoUrl, maxDurationSeconds = 15) => {
    const outputPath = path.join(os.tmpdir(), `clip-${Date.now()}.mp4`);

    try {
        await execFileAsync("yt-dlp", [
            "-f", "bv+ba/best",
            "--download-sections", `*0-${maxDurationSeconds}`,
            "--force-keyframes-at-cuts",
            "--recode-video", "mp4",
            "-o", outputPath,
            videoUrl,
        ]);

        return await fs.readFile(outputPath);
    } finally {
        await fs.unlink(outputPath).catch(() => {});
    }
};
module.exports = videoService;