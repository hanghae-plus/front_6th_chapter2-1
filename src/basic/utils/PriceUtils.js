/**
 * 가격을 한국어 형식으로 포맷팅
 * @param {number} price - 포맷팅할 가격
 * @returns {string} 포맷팅된 가격 문자열
 */
export function formatPrice(price) {
  return `₩${price.toLocaleString()}`;
}

/**
 * 할인된 가격 계산
 * @param {number} originalPrice - 원래 가격
 * @param {number} discountRate - 할인율 (0~1)
 * @returns {number} 할인된 가격
 */
export function calculateDiscountedPrice(originalPrice, discountRate) {
  return Math.round(originalPrice * (1 - discountRate));
}

/**
 * 할인 금액 계산
 * @param {number} originalPrice - 원래 가격
 * @param {number} discountedPrice - 할인된 가격
 * @returns {number} 할인 금액
 */
export function calculateDiscountAmount(originalPrice, discountedPrice) {
  return originalPrice - discountedPrice;
}

/**
 * 할인율 계산
 * @param {number} originalPrice - 원래 가격
 * @param {number} discountedPrice - 할인된 가격
 * @returns {number} 할인율 (0~1)
 */
export function calculateDiscountRate(originalPrice, discountedPrice) {
  return (originalPrice - discountedPrice) / originalPrice;
}
