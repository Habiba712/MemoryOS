const { chromium } = require("playwright");

const videoService = {};

videoService.captureVideoFrame = async (videoUrl) => {
    const browser = await chromium.launch({
        headless: true,
        executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    });

    try {
        const page = await browser.newPage({
            viewport: {
                width: 1280,
                height: 720
            }
        });

        await page.goto(videoUrl, {
            waitUntil: "domcontentloaded",
            timeout: 30000
        });

        await page.waitForTimeout(3000);

        return await page.screenshot({
            type: "jpeg",
            quality: 70
        });

    } finally {
        await browser.close();
    }
};

module.exports = videoService;