function createFlexMessage(food) {
  return {
    type: "flex",
    altText: "เมนูอาหารแนะนำ",
    contents: {
      type: "bubble",
      hero: {
        type: "image",
        url: food.image,
        size: "full",
        aspectRatio: "20:13",
        aspectMode: "cover"
      },
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: food.name,
            weight: "bold",
            size: "xl"
          },
          {
            type: "text",
            text: `พลังงาน: ${food.nutrition.calories} kcal`
          },
          {
            type: "text",
            text: `โปรตีน: ${food.nutrition.protein}`
          },
          {
            type: "text",
            text: `คาร์โบไฮเดรต: ${food.nutrition.carbs}`
          },
          {
            type: "text",
            text: `ไขมัน: ${food.nutrition.fat}`
          }
        ]
      }
    }
  };
}

module.exports = {
  createFlexMessage
};