/**
 * 상품 검색 유틸리티 함수들
 */

/**
 * ID로 상품 찾기
 * @param {Array} products - 상품 배열
 * @param {string} productId - 찾을 상품 ID
 * @returns {Object|null} 찾은 상품 객체 또는 null
 */
export function findProductById(products, productId) {
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === productId) {
      return products[i];
    }
  }
  return null;
}

/**
 * 특정 상품을 제외한 사용 가능한 상품 찾기
 * @param {Array} products - 상품 배열
 * @param {string} excludeId - 제외할 상품 ID
 * @returns {Object|null} 찾은 상품 객체 또는 null
 */
export function findAvailableProductExcept(products, excludeId) {
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    if (product.id !== excludeId && product.q > 0 && !product.suggestSale) {
      return product;
    }
  }
  return null;
}

/**
 * 전체 재고 계산
 * @param {Array} products - 상품 배열
 * @returns {number} 전체 재고 수량
 */
export function calculateTotalStock(products) {
  let total = 0;
  for (let i = 0; i < products.length; i++) {
    total += products[i].q;
  }
  return total;
} 