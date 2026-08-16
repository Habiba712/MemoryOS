const fs = require("fs");
const cheerio = require("cheerio");

const filePath =
  "./test-data/instagram-export/your_instagram_activity/saved/saved_posts.html";

const html = fs.readFileSync(filePath, "utf8");
const $ = cheerio.load(html);

const posts = [];

$("main > div").each((index, element) => {
  const post = $(element);

  const url = post.find('a[href*="instagram.com"]').first().attr("href");

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

const username = usernameCell.next("td").text().trim() || null;

  posts.push({
    url,
    caption,
    username,
  });
});
const limit = 10;

const selectedPosts = posts.slice(0, limit);

console.log(`Total posts found: ${selectedPosts.length}`);
console.log(`Posts selected: ${selectedPosts.length}`);

console.log(selectedPosts);

console.log("Posts found:", selectedPosts.length);

console.dir(selectedPosts[0], { depth: null });