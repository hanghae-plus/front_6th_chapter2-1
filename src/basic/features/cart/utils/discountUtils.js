/**
 * Cart Utils - 실제 CartCalculator에서 사용중인 순수 함수들
 */

/**
 * 개별 상품 할인율 계산 (CartCalculator.calculateItemDiscount 기반)
 * @param {string} productId - 상품 ID
 * @param {number} quantity - 수량
 * @param {object} constants - 비즈니스 상수
 * @param {object} products - 상품 ID 맵
 * @returns {number} 할인율 (0~1)
 */
export const calculateItemDiscountRate = (
  productId,
  quantity,
  constants,
  products,
) => {
  if (quantity < constants.DISCOUNT.ITEM_DISCOUNT_MIN_QUANTITY) {
    return 0;
  }

  const discountRates = {
    [products.KEYBOARD]: 0.1,
    [products.MOUSE]: 0.15,
    [products.MONITOR_ARM]: 0.2,
    [products.LAPTOP_POUCH]: 0.05,
    [products.SPEAKER]: 0.25,
  };

  return discountRates[productId] || 0;
};
