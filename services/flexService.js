// buildFlexMessage constructs a LINE Flex message. It expects food.image
// to be either an absolute URL or a path beginning with "/". If the latter,
// we prepend BASE_URL, which should be configured in the environment (e.g.
// https://system-random-line-bot-food.onrender.com). This makes sure the image
// is reachable by LINE's servers.
// Determine the base URL for images. In Render the platform provides
// RENDER_EXTERNAL_URL (e.g. "https://system-random-line-bot-food.onrender.com").
// We also allow overriding with BASE_URL. For local development we'll fall back
// to localhost using PORT if nothing else is set; this isn't used by LINE
// itself but keeps `npm start` from crashing.
const BASE_URL =
  process.env.BASE_URL ||
  process.env.RENDER_EXTERNAL_URL ||
  (process.env.PORT ? `http://localhost:${process.env.PORT}` : "");

const fs = require("fs");
const path = require("path");

function cacheBustedUrl(relPath) {
  // relPath begins with '/'
  const base = BASE_URL.replace(/\/$/, "");
  let url = base + relPath;
  try {
    const filePath = path.join(__dirname, "..", "public", relPath);
    const stats = fs.statSync(filePath);
    const mtime = stats.mtime.getTime();  // เวลาแก้ไขไฟล์ล่าสุด
    url += (url.includes("?") ? "&" : "?") + "t=" + mtime;
  } catch (e) {
    // if file read fails just return plain url
    console.warn("cacheBustedUrl failed for", relPath, e.message);
  }
  return url;
}

function createFlexMessage(food) {
  let imageUrl = food.image;
  if (imageUrl.startsWith("/")) {
    imageUrl = cacheBustedUrl(imageUrl);
  }

  return {
    type: "flex",
    altText: "เมนูอาหารแนะนำ",
    contents: {
      type: "bubble",
      hero: {
        type: "image",
        url: imageUrl,
        size: "full",
        aspectRatio: "20:13",
        aspectMode: "cover"
      },
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: food.name,
            weight: "bold",
            size: "xl"
          },
          {
            type: "text",
            text: `พลังงาน: ${food.nutrition.calories} kcal`
          },
          {
            type: "text",
            text: `โปรตีน: ${food.nutrition.protein}`
          },
          {
            type: "text",
            text: `คาร์โบไฮเดรต: ${food.nutrition.carbs}`
          },
          {
            type: "text",
            text: `ไขมัน: ${food.nutrition.fat}`
          }
        ]
      }
    }
  };
}

module.exports = {
  createFlexMessage
};