require("dotenv").config();

const express = require("express");
const line = require("@line/bot-sdk");
const { client, config } = require("./config/lineConfig");
const { handleMessage } = require("./controllers/messageController");

const app = express();

// serve static files
app.use(express.static("public"));

// webhook
app.post(
  "/webhook",
  line.middleware(config),
  async (req, res) => {

    const events = req.body.events || [];

    await Promise.all(
      events.map(async (event) => {
        try {
          if (event.type === "message") {
            return await handleMessage(event);;
          }

          return await handleMessage(event);

        } catch (err) {
          console.error("Error handling message:", err);

          try {
            await client.replyMessage(event.replyToken, {
              type: "text",
              text: "เกิดข้อผิดพลาด กรุณาลองใหม่"
            });
          } catch (replyErr) {
            console.error("Error sending error reply:", replyErr);
          }
        }
      })
    );

    res.status(200).end();
  }
);

// root
app.get("/", (req, res) => {
  res.send("Line bot is running");
});

// port
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log("Server running on port " + PORT);

  // ngrok for dev
  if (
    process.env.NODE_ENV !== "production" &&
    !process.env.BASE_URL &&
    !process.env.RENDER_EXTERNAL_URL
  ) {
    try {
      const ngrok = require("ngrok");
      const url = await ngrok.connect(PORT);
      process.env.BASE_URL = url;
      console.log("ngrok tunnel opened at", url);
    } catch (err) {
      console.error("failed to start ngrok tunnel:", err);
    }
  }
});