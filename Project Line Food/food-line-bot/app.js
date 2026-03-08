require("dotenv").config();

const express = require("express");
const line = require("@line/bot-sdk");

const { config } = require("./config/lineConfig");
const { handleMessage } = require("./controllers/messageController");

const app = express();

app.use(express.json());

// webhook
app.post("/webhook", line.middleware(config), async (req, res) => {

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

// ใช้ port ของ Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});