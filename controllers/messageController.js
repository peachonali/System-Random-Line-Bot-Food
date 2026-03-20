const { client } = require("../config/lineConfig");
const { getRandomFood } = require("../services/foodService");
const { createFlexMessage } = require("../services/flexService");
const { analyzeMessage } = require("../services/AIService");

function getSmartReply(level) {
  const replies = {
    high: [
      "โอ้โห ดูเหมือนจะหิวมากเลยนะ 😆 จัดเมนูให้ด่วน!",
      "หิวขนาดนี้ ต้องรีบกินแล้วนะ! เดี๋ยวผมจัดให้ 🍛",
      "ทนไม่ไหวแล้วใช่ไหม 😄 เอาเมนูนี้ไปเลย!"
    ],
    medium: [
      "หิวแล้วใช่ไหม เดี๋ยวแนะนำเมนูให้ครับ 😋",
      "กำลังคิดเรื่องกินอยู่ใช่ไหม 😄 ลองเมนูนี้ดู!",
      "อยากกินอะไรสักอย่างใช่ไหม ผมช่วยเลือกให้!"
    ]
  };

  const arr = replies[level] || replies["medium"];
  return arr[Math.floor(Math.random() * arr.length)];
}

function getChatReply(text) {
  if (text.includes("เหนื่อย")) {
    return "เหนื่อยก็พักก่อนนะครับ ✨ หรือจะหาอะไรอร่อยๆกินดี 😄";
  }

  if (text.includes("เรียน")) {
    return "สู้ๆนะครับ 📚 เรียนเสร็จแล้วอย่าลืมหาอะไรกินนะ!";
  }

  if (text.includes("สวัสดี")) {
    return "สวัสดีครับ! ยินดีที่ได้ช่วยเหลือคุณ 😊";
  }

  if (text.includes("แฟนไม่รักผมเลย")) {
    return "อืม…ฟังดูเหมือนอาการเดียวกับ “ยังไม่ได้กินข้าว” เลยนะครับ 😅 ลองกินอะไรอร่อยๆดูนะ อาจจะช่วยให้รู้สึกดีขึ้นก็ได้!";
  }

  if (text.includes("แฟนไม่รักแต่ไม่อยากกินข้าว")) {
    return "ไปกินข้าวก่อน อย่างน้อย “ข้าวยังไม่เทคุณ! ถ้านึกเมนูไม่ออก ลองถามผมได้นะครับ 😄";
  }
  return "ผมยังคุยไม่เก่ง 😅 แต่ถ้าหิวลองถามเรื่องอาหารได้นะ!";
}

async function handleMessage(event) {
  const text = event.message.text;

  try {
    const result = analyzeMessage(text);

    const intent = result?.intent || "chat";
    const level = result?.level || "low";

    // 🎯 FOOD
    if (intent === "food_request") {
      const food = getRandomFood();
      const flex = createFlexMessage(food);

      const smartText = getSmartReply(level);

      return client.replyMessage(event.replyToken, [
        {
          type: "text",
          text: smartText
        },
        flex
      ]);
    }

    // 💬 CHAT
    const reply = getChatReply(text);

    return client.replyMessage(event.replyToken, {
      type: "text",
      text: reply
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