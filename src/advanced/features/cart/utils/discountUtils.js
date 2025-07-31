/**
 * Cart Utils - 실제 cartCalculator에서 사용중인 순수 함수들
 */

/**
 * 개별 상품 할인율 계산 (cartCalculator.calculateItemDiscount 기반)
 * @param {string} productId - 상품 ID
 * @param {number} quantity - 수량
 * @param {object} constants - 비즈니스 상수
 * @param {object} productIds - 상품 ID 맵
 * @returns {number} 할인율 (0~1)
 */
export const calculateItemDiscountRate = (
  productId,
  quantity,
  constants,
  productIds,
) => {
  if (quantity < constants.DISCOUNT.ITEM_DISCOUNT_MIN_QUANTITY) {
    return 0;
  }

  const discountRates = {
    [productIds.KEYBOARD]: 0.1,
    [productIds.MOUSE]: 0.15,
    [productIds.MONITOR_ARM]: 0.2,
    [productIds.LAPTOP_POUCH]: 0.05,
    [productIds.SPEAKER]: 0.25,
  };

  return discountRates[productId] || 0;
};
