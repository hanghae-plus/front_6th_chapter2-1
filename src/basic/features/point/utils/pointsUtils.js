/**
 * Point Utils - 실제 PointsCalculator에서 사용중인 순수 함수들
 */

/**
 * 기본 포인트 계산 (PointsCalculator.calculateBasePoints 기반)
 * @param {number} totalAmount - 총 결제 금액
 * @returns {number} 기본 포인트
 */
export const calculateBasePoints = totalAmount => {
  return Math.floor(totalAmount / 1000);
};

/**
 * 화요일 여부 확인
 * @param {Date} date - 확인할 날짜 (기본값: 현재)
 * @returns {boolean} 화요일 여부
 */
export const isTuesday = (date = new Date()) => {
  return date.getDay() === 2;
};

/**
 * 카트에 있는 상품 ID 목록 추출 (PointsCalculator.getProductIdsInCart 기반)
 * @param {HTMLCollection|Array} cartElements - 카트 요소들 또는 상품 배열
 * @param {Array} products - 상품 목록 (요소에서 ID 추출시 필요)
 * @returns {Array} 상품 ID 배열
 */
export const getProductIdsFromCart = (cartElements, products) => {
  const productIds = [];

  for (const cartElement of cartElements) {
    const product = products.find(p => p.id === cartElement.id);
    if (product) {
      productIds.push(product.id);
    }
  }

  return productIds;
};
