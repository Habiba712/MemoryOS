const fs = require("fs");
const path = require("path");
const unzipper = require("unzipper");
const cheerio = require("cheerio");

const parseInstagramSavedPosts = (filePath) => {
    const html = fs.readFileSync(filePath, "utf8");
    const $ = cheerio.load(html);

    const posts = [];

    $("main > div").each((index, element) => {
        const post = $(element);

        const url = post
            .find('a[href*="instagram.com"]')
            .first()
            .attr("href");

        if (!url) return;

        const cells = post.find("td");

        const caption = cells
            .filter((i, el) => $(el).text().trim() === "Caption")
            .next()
            .text()
            .trim();

        const usernameCell = post
            .find("td")
            .filter((i, el) => $(el).text().trim() === "Username")
            .first();

        const username =
            usernameCell.next("td").text().trim() || null;

        posts.push({
            url,
            caption,
            username,
        });
    });

    return posts;
};


const importInstagram = async (zipPath, userId) => {

    console.log("ZIP received:", zipPath);

     const extractDir = path.join(
        path.dirname(zipPath),
        `instagram-extract-${Date.now()}`
    );

    fs.mkdirSync(extractDir, { recursive: true });

    try {

        await fs.createReadStream(zipPath)
            .pipe(unzipper.Extract({ path: extractDir }))
            .promise();

        console.log("ZIP extracted:", extractDir);



        const savedHtmlPath = path.join(
            extractDir,
            "your_instagram_activity",
            "saved",
            "saved_posts.html"
        );

        console.log("Looking for:", savedHtmlPath);

        if (!fs.existsSync(savedHtmlPath)) {
            throw new Error(
                "Could not find your_instagram_activity/saved/saved_posts.html inside the Instagram export."
            );
        }

        console.log("✅ saved_posts.html found");

        const posts = parseInstagramSavedPosts(savedHtmlPath);

        console.log(`Found ${posts.length} saved Instagram posts`);


        const results = {
            posts,
            totalFound: posts.length,
            selected: posts.length,
            successful: [],
            failed: [],
        };

        return results;

    } finally {

        fs.rmSync(extractDir, {
            recursive: true,
            force: true,
        });

        console.log("🧹 Temporary Instagram files deleted");
    }
};



const processingPosts = async (posts, userId, limit = 10) => {
    const results = {
        totalFound: posts.length,
        selected: 0,
        successful: [],
        failed: [],
    };

    for (const post of posts) {
        // Stop once we have enough successful imports
        if (results.successful.length >= limit) {
            break;
        }

        try {
            console.log(`Importing Instagram post: ${post.url}`);

            const response = await fetch(
                "http://localhost:4000/api/video/saveVideo",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        user: userId,
                        videoUrl: post.url,
                        caption: post.caption
                    }),
                }
            );

            if (response.ok) {
                results.successful.push(post);

                console.log(
                    `✅ Imported successfully (${results.successful.length}/${limit})`
                );

            } else {
                const errorText = await response.text();

                results.failed.push({
                    post,
                    error: errorText || response.statusText,
                });

                console.log(
                    `⏭️ Skipping failed post: ${post.url}`
                );

                continue;
            }

        } catch (error) {

            results.failed.push({
                post,
                error: error.message,
            });

            console.log(
                `⏭️ Skipping problematic post: ${post.url}`
            );

            continue;
        }
    }

    return results;
};

module.exports = {
    parseInstagramSavedPosts,
    importInstagram,
    processingPosts,
};