const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function analyzeMessage(text) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
คุณคือ AI วิเคราะห์ intent ของผู้ใช้
ตอบแค่ JSON เท่านั้น เช่น:
{ "intent": "hungry" }

intent มี:
- hungry
- recommend_food
- chat
`
      },
      {
        role: "user",
        content: text
      }
    ]
  });

  return JSON.parse(response.choices[0].message.content);
}

module.exports = { analyzeMessage };