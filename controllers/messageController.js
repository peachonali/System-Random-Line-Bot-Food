const { client } = require("../config/lineConfig");
const { getRandomFood } = require("../services/foodService");
const { createFlexMessage } = require("../services/flexService");
const { analyzeMessage } = require("../services/AIService");

async function handleMessage(event) {
  const text = event.message.text;

  try {
    const result = await analyzeMessage(text);

    const intent = result?.intent || "chat";

    // 🎯 กรณีอยากกินอาหาร
    if (intent === "food_request") {
      const food = getRandomFood();
      const flex = createFlexMessage(food);

      return client.replyMessage(event.replyToken, [
        {
          type: "text",
          text: "หิวใช่ไหม 😄 เดี๋ยวแนะนำเมนูให้ครับ"
        },
        flex
      ]);
    }

    // 💬 fallback chat (ไม่ใช้ AI แล้ว)
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: "ผมยังคุยได้ไม่เก่ง 😅 แต่ถ้าหิวลองพิมพ์เกี่ยวกับอาหารได้นะ!"
    });

  } catch (error) {
    console.error("Error handling message:", error);

    return client.replyMessage(event.replyToken, {
      type: "text",
      text: "ขอโทษครับ ระบบมีปัญหา กรุณาลองใหม่"
    });
  }
}

module.exports = {
  handleMessage
};