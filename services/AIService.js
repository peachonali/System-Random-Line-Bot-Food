const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function analyzeMessage(text) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: `
คุณคือ AI วิเคราะห์ intent ของผู้ใช้

ให้วิเคราะห์ว่าผู้ใช้ "ต้องการอาหาร" หรือแค่ "พูดคุยทั่วไป"

ตอบเป็น JSON เท่านั้น เช่น:
{ "intent": "food_request" }

กฎ:
- ถ้าผู้ใช้พูดถึงความหิว, อยากกิน, ขอเมนู, ขอแนะนำอาหาร → food_request
- ถ้าเป็นการคุยทั่วไป → chat
- ห้ามตอบอย่างอื่นนอกจาก JSON
`
      },
      {
        role: "user",
        content: text
      }
    ]
  });

  try {
    let content = response.choices[0].message.content.trim();

    // 🔥 กันกรณี AI ใส่ ```json ```
    if (content.startsWith("```")) {
      content = content.replace(/```json|```/g, "").trim();
    }

    return JSON.parse(content);

  } catch (err) {
    console.error("AI parse error:", err);
    return { intent: "chat" }; // fallback
  }
}

module.exports = { analyzeMessage };