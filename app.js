require("dotenv").config();

const express = require("express");
const line = require("@line/bot-sdk");

const { config } = require("./config/lineConfig");
const { handleMessage } = require("./controllers/messageController");

const app = express();

// webhook route needs raw body for signature validation so we apply
// the LINE middleware before parsing JSON. Other routes can still use
// express.json() if needed.

// webhook
app.post(
  "/webhook",
  line.middleware(config),
  express.json(),
  async (req, res) => {

  const events = req.body.events;

  await Promise.all(
    events.map(async (event) => {

      if (event.type === "message" && event.message.type === "text") {
        return handleMessage(event);
      }

    })
  );

  res.status(200).end();
});

// มีหน้ารากให้ดูง่ายๆ เวลาทดสอบ
app.get("/", (req, res) => {
  res.send("Line bot is running");
});

// ใช้ port ของ Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});