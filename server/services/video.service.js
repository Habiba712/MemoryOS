const YTDlpWrap = require("yt-dlp-wrap").default;
const ffmpegPath = require("ffmpeg-static");
const { execFile } = require("child_process");
const util = require("util");
const execFileAsync = util.promisify(execFile);
const fs = require("fs/promises");
const os = require("os");
const path = require("path");

const ytDlpWrap = new YTDlpWrap(); // auto-locates/downloads the yt-dlp binary

const videoService = {};

videoService.captureVideoFrame = async (videoUrl, maxFrames = 4) => {
    const dir = os.tmpdir();
    const prefix = `frames-${Date.now()}`;
    const pattern = path.join(dir, `${prefix}-%02d.jpg`);

    try {
        const { stdout } = await execFileAsync("yt-dlp", ["-f", "bv", "-g", videoUrl]);
        const directUrl = stdout.trim().split("\n")[0];

        // one frame every ~3 seconds, capped at maxFrames
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
                break; // fewer frames existed than maxFrames, that's fine for short clips
            }
        }
        return buffers; // array instead of a single buffer
    } catch (err) {
        throw err;
    }
};

videoService.downloadVideoClip = async (videoUrl, maxDurationSeconds = 15) => {
    const outputPath = path.join(os.tmpdir(), `clip-${Date.now()}.mp4`);

    try {
        const { stdout } = await execFileAsync("yt-dlp", ["-f", "bv+ba/best", "-g", videoUrl]);
        const urls = stdout.trim().split("\n"); // could be [video, audio] or just [combined]

        const ffmpegArgs = ["-y"];
        urls.forEach(u => ffmpegArgs.push("-i", u));
        ffmpegArgs.push(
            "-t", String(maxDurationSeconds), // cap length so we never send a huge file to Gemini
            "-c:v", "libx264",
            "-c:a", "aac",
            "-movflags", "faststart",
            outputPath
        );

        await execFileAsync(ffmpegPath, ffmpegArgs);

        return await fs.readFile(outputPath);
    } finally {
        await fs.unlink(outputPath).catch(() => {});
    }
};

module.exports = videoService;