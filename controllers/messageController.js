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

    // 🔥 กันกรณี result แปลก
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

    // 💬 กรณี chat
    const aiResponse = await chatWithAI(text);

    return client.replyMessage(event.replyToken, {
      type: "text",
      text: aiResponse || "ผมยังตอบไม่ได้นะ ลองพิมพ์ใหม่อีกทีครับ 🙏"
    });

  } catch (error) {
    console.error("Error handling message:", error);

    return client.replyMessage(event.replyToken, {
      type: "text",
      text: "ขอโทษครับ ระบบมีปัญหา กรุณาลองใหม่"
    });
  }
}

async function chatWithAI(text) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7, // 💬 ให้คุยธรรมชาติมากขึ้น
      messages: [
        {
          role: "system",
          content: `
คุณคือ AI ผู้ช่วยใน LINE
- พูดภาษาไทย
- เป็นกันเอง
- ไม่ต้องทางการ
- ถ้าผู้ใช้พูดถึงอาหาร ให้แนะนำได้เล็กน้อย
`
        },
        { role: "user", content: text }
      ]
    });

    return response.choices[0].message.content;

  } catch (err) {
    console.error("chatWithAI error:", err);
    return "ตอนนี้ระบบแชทมีปัญหานิดหน่อย ลองใหม่อีกทีนะ 🙏";
  }
}

module.exports = {
  handleMessage
};