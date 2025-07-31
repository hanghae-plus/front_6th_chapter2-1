/**
 * 옵션 생성
 * @param {Object} item - 상품 정보
 * @returns {Object} 옵션 정보
 */
export const createOption = (item) => {
  // 품절 상품 체크
  if (item.quantity === 0) {
    return {
      text: `${item.name} - ${item.val}원 (품절)`,
      disabled: true,
      className: "text-gray-400",
    };
  }

  // 번개할인 상품 체크
  if (item.onSale && item.suggestSale) {
    return {
      text: `⚡💝${item.name} - ${item.originalVal}원 → ${item.val}원 (25% SUPER SALE!)`,
      className: "text-purple-600 font-bold",
    };
  }

  // 번개할인 상품 체크
  if (item.onSale) {
    return {
      text: `⚡${item.name} - ${item.originalVal}원 → ${item.val}원 (20% SALE!)`,
      className: "text-red-500 font-bold",
    };
  }

  // 추천할인 상품 체크
  if (item.suggestSale) {
    return {
      text: `💝${item.name} - ${item.originalVal}원 → ${item.val}원 (5% 추천할인!)`,
      className: "text-blue-500 font-bold",
    };
  }

  // 할인 상품이 아닌 경우
  return {
    text: `${item.name} - ${item.val}원`,
    className: "",
  };
};
