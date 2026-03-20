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
  const lowerText = text.toLowerCase();

  // 😴 เหนื่อย
  if (lowerText.includes("เหนื่อย")) {
    return "เหนื่อยก็พักก่อนนะครับ ✨ หรือจะหาอะไรอร่อยๆกินดี 😄";
  }

  // 📚 เรียน
  if (lowerText.includes("เรียน")) {
    return "สู้ๆนะครับ 📚 เรียนเสร็จแล้วอย่าลืมหาอะไรกินนะ!";
  }

  // 👋 ทักทาย
  if (lowerText.includes("สวัสดี") || lowerText.includes("ดีครับ") || lowerText.includes("hello")) {
    return "สวัสดีครับ! 😊 วันนี้อยากกินอะไรดี เดี๋ยวผมช่วยแนะนำให้!";
  }

  // 💔 เรื่องความรัก (ฉลาดขึ้น)
  if (lowerText.includes("แฟน") && lowerText.includes("ไม่รัก")) {
    return "โห…ฟังดูแอบเศร้านะครับ 😢 แต่ลองหาอะไรอร่อยๆกินก่อนดีไหม อย่างน้อย “ข้าวไม่เคยทิ้งเรา” 🍛";
  }

  // 💔 ไม่อยากกิน + เศร้า
  if (
    (lowerText.includes("ไม่อยากกิน") || lowerText.includes("ไม่หิว")) &&
    lowerText.includes("แฟน")
  ) {
    return "เข้าใจเลยครับ 😢 แต่ลองกินอะไรนิดนึงนะ อย่างน้อยให้ตัวเองโอเคขึ้นก่อน แล้วค่อยว่ากัน 💛";
  }

  // 🤖 fallback
  return "ผมยังคุยไม่เก่ง 😅 แต่ถ้าหิวลองถามเรื่องอาหารได้นะ!";
}

async function handleMessage(event) {
  const messageType = event.message.type;

  try {

    // 🎯 🟡 กรณี STICKER
    if (messageType === "sticker") {
      return handleSticker(event);
    }

    // 🎯 🟢 กรณี TEXT
    if (messageType === "text") {
      const text = event.message.text;

      const result = analyzeMessage(text);
      const intent = result?.intent || "chat";
      const level = result?.level || "low";

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

      return client.replyMessage(event.replyToken, {
        type: "text",
        text: getChatReply(text)
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

module.exports = {
  handleMessage
};