const { client } = require("../config/lineConfig");
const { getRandomFood } = require("../services/foodService");
const { createFlexMessage } = require("../services/flexService");
const { analyzeMessage } = require("../services/AIService");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function handleMessage(event) {
  const text = event.message.text;

  try {
    const result = await analyzeMessage(text);

    if (result.intent === "hungry") {
      const food = getRandomFood();
      const flex = createFlexMessage(food);
      return client.replyMessage(event.replyToken, flex);

    } else if (result.intent === "recommend_food") {
      // แนะนำแบบมีเงื่อนไข - อาจจะวิเคราะห์ข้อความเพิ่มเติม
      const food = getRandomFood();
      const flex = createFlexMessage(food);
      return client.replyMessage(event.replyToken, flex);

    } else if (result.intent === "chat") {
      // คุยกับ AI
      const aiResponse = await chatWithAI(text);
      return client.replyMessage(event.replyToken, {
        type: "text",
        text: aiResponse
      });

    } else {
      return client.replyMessage(event.replyToken, {
        type: "text",
        text: "ฉันไม่เข้าใจ สามารถพิมพ์ 'หิวข้าว' หรือ 'กินอะไรดี' ได้นะครับ"
      });
    }

  } catch (error) {
    console.error("Error handling message:", error);
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: "ขอโทษครับ ระบบมีปัญหา กรุณาลองใหม่"
    });
  }
}

async function chatWithAI(text) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "คุณคือ AI ผู้ช่วยสำหรับบอทแนะนำอาหาร เป็นมิตรและให้คำแนะนำที่ดี"
      },
      { role: "user", content: text }
    ]
  });

  return response.choices[0].message.content;
}

module.exports = {
  handleMessage
};