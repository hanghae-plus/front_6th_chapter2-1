import { STOCK_THRESHOLDS } from '../../shared/constants/index.js';

/**
 * 재고 부족 경고 메시지 생성
 * @param {Array} products - 상품 목록
 * @returns {string} 경고 메시지
 */
export function buildLowStockWarning(products) {
  const warningMessages = [];

  for (const product of products) {
    if (product.stock < STOCK_THRESHOLDS.LOW) {
      if (product.stock > 0) {
        warningMessages.push(
          `${product.name}: 재고 부족 (${product.stock}개 남음)`
        );
      } else {
        warningMessages.push(`${product.name}: 품절`);
      }
    }
  }

  return warningMessages.join('\n');
}

/**
 * 전체 재고 수량 계산
 * @param {Array} products - 상품 목록
 * @returns {number} 전체 재고 수량
 */
export function calculateTotalStock(products) {
  return products.reduce((total, product) => total + product.stock, 0);
}

/**
 * 재고 부족 상품 확인
 * @param {Array} products - 상품 목록
 * @returns {Array} 재고 부족 상품 배열
 */
export function getLowStockProducts(products) {
  return products.filter(
    (product) => product.stock < STOCK_THRESHOLDS.LOW && product.stock > 0
  );
}

/**
 * 품절 상품 확인
 * @param {Array} products - 상품 목록
 * @returns {Array} 품절 상품 배열
 */
export function getOutOfStockProducts(products) {
  return products.filter((product) => product.stock === 0);
}

/**
 * 재고 상태 확인
 * @param {Object} product - 상품 객체
 * @returns {string} 재고 상태 ('available', 'low', 'out')
 */
export function getStockStatus(product) {
  if (product.stock === 0) return 'out';
  if (product.stock < STOCK_THRESHOLDS.LOW) return 'low';
  return 'available';
}

/**
 * 재고 차감 가능 여부 확인
 * @param {Object} product - 상품 객체
 * @param {number} requestedQuantity - 요청 수량
 * @returns {boolean} 차감 가능 여부
 */
export function canReduceStock(product, requestedQuantity) {
  return product.stock >= requestedQuantity;
}

/**
 * 재고 차감
 * @param {Object} product - 상품 객체
 * @param {number} quantity - 차감할 수량
 * @returns {boolean} 차감 성공 여부
 */
export function reduceStock(product, quantity) {
  if (!canReduceStock(product, quantity)) return false;

  product.stock -= quantity;
  return true;
}

/**
 * 재고 복구
 * @param {Object} product - 상품 객체
 * @param {number} quantity - 복구할 수량
 */
export function restoreStock(product, quantity) {
  product.stock += quantity;
}
