export const createOption = (item) => {
  if (item.q === 0) {
    return {
      text: `${item.name} - ${item.val}원 (품절)`,
      disabled: true,
      className: "text-gray-400",
    };
  }

  if (item.onSale && item.suggestSale) {
    return {
      text: `⚡💝${item.name} - ${item.originalVal}원 → ${item.val}원 (25% SUPER SALE!)`,
      className: "text-purple-600 font-bold",
    };
  }

  if (item.onSale) {
    return {
      text: `⚡${item.name} - ${item.originalVal}원 → ${item.val}원 (20% SALE!)`,
      className: "text-red-500 font-bold",
    };
  }

  if (item.suggestSale) {
    return {
      text: `💝${item.name} - ${item.originalVal}원 → ${item.val}원 (5% 추천할인!)`,
      className: "text-blue-500 font-bold",
    };
  }

  return {
    text: `${item.name} - ${item.val}원`,
    className: "",
  };
};
