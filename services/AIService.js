function analyzeMessage(text) {
  const lowerText = text.toLowerCase();

  const strongFoodWords = [
    "หิวมาก", "โคตรหิว", "หิวสุดๆ", "อยากกินมาก"
  ];

  const normalFoodWords = [
    "หิว", "กิน", "อาหาร", "ข้าว",
    "อยากกิน", "แนะนำ", "ของกิน",
    "ร้านอาหาร", "กินอะไรดี"
  ];

  let score = 0;

  strongFoodWords.forEach(word => {
    if (lowerText.includes(word)) {
      score += 2;
    }
  });

  normalFoodWords.forEach(word => {
    if (lowerText.includes(word)) {
      score += 1;
    }
  });

  if (score >= 2) {
    return { intent: "food_request", level: "high" };
  }

  if (score === 1) {
    return { intent: "food_request", level: "medium" };
  }

  return { intent: "chat", level: "low" };
}

module.exports = { analyzeMessage };