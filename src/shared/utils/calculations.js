/**
 * 계산 관련 유틸리티 함수들
 * @description 가격, 할인, 포인트 계산 등의 순수 함수들
 */

/**
 * 총 재고 수량 계산
 * @param {Array} products - 상품 배열
 * @returns {number} 총 재고 수량
 */
export function calculateTotalStock(products) {
  return products.reduce((total, product) => total + product.q, 0);
}

/**
 * 상품 검색 (ID 기준)
 * @param {Array} products - 상품 배열  
 * @param {string} productId - 찾을 상품 ID
 * @returns {Object|null} 찾은 상품 또는 null
 */
export function findProductById(products, productId) {
  return products.find(product => product.id === productId) || null;
}

/**
 * 특정 상품을 제외하고 사용 가능한 상품 찾기
 * @param {Array} products - 상품 배열
 * @param {string} excludeId - 제외할 상품 ID
 * @returns {Object|null} 찾은 상품 또는 null
 */
export function findAvailableProductExcept(products, excludeId) {
  return products.find(product => 
    product.id !== excludeId && 
    product.q > 0 && 
    !product.suggestSale
  ) || null;
}

/**
 * 개별 상품 할인율 계산
 * @param {string} productId - 상품 ID
 * @param {number} quantity - 수량
 * @param {Object} discountRates - 할인율 객체
 * @param {number} threshold - 할인 임계값
 * @returns {number} 할인율 (0~1)
 */
export function calculateItemDiscount(productId, quantity, discountRates, threshold) {
  if (quantity < threshold) return 0;
  
  const discountMap = {
    'p1': discountRates.KEYBOARD_DISCOUNT,
    'p2': discountRates.MOUSE_DISCOUNT,
    'p3': discountRates.MONITOR_ARM_DISCOUNT,
    'p4': discountRates.LAPTOP_POUCH_DISCOUNT,
    'p5': discountRates.SPEAKER_DISCOUNT,
  };
  
  return discountMap[productId] || 0;
}

/**
 * 포인트 계산
 * @param {number} amount - 결제 금액
 * @param {number} rate - 포인트 적립률
 * @returns {number} 적립 포인트
 */
export function calculatePoints(amount, rate) {
  return Math.floor(amount * rate * 1000);
}