function analyzeMessage(text) {
  const lowerText = text.toLowerCase();

  const foodKeywords = [
    "หิว", "กิน", "อาหาร", "ข้าว",
    "อยากกิน", "แนะนำ", "ของกิน",
    "ร้านอาหาร", "กินอะไรดี"
  ];

  let score = 0;

  foodKeywords.forEach(keyword => {
    if (lowerText.includes(keyword)) {
      score++;
    }
  });

  // 🔥 ใช้ score แทน boolean (ฉลาดกว่า)
  if (score >= 1) {
    return { intent: "food_request" };
  }

  return { intent: "chat" };
}

module.exports = { analyzeMessage };