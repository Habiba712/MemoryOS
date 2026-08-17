const fs = require("fs");
const cheerio = require("cheerio");

const filePath =
  "./test-data/instagram-export/your_instagram_activity/saved/saved_posts.html";

const html = fs.readFileSync(filePath, "utf8");
const $ = cheerio.load(html);
const posts = [];
const failed = [];

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

const saveVideo = async (url, user) => {
  console.log(`Saving video: ${url}`);
  console.log(`User: ${user}`);

  const response = await fetch("http://localhost:4000/api/video/saveVideo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${YOUR_TOKEN}`,
    },
    body: JSON.stringify({
      user,
      videoUrl: url
    }),
  });

  const result = await response.json();

  console.log(result);
};
for (const post of selectedPosts) {
  console.log(`Processing: ${post.url}`);
const user = "6a6373cd96081f4f02c0de75";
try{
  saveVideo(post.url, user);
}catch(err){
    failed.push({
      url: post.url,
      error: err.message,
    });
}

}