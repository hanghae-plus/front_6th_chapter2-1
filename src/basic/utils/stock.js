// ================================================
// 재고 관리 유틸리티
// ================================================

import { LOW_STOCK_THRESHOLD } from '../constants.js';

/**
 * 재고 상태 확인
 * @param {number} quantity - 재고 수량
 * @returns {string} 재고 상태
 */
export function getStockStatus(quantity) {
  if (quantity === 0) {
    return '품절';
  }
  if (quantity < LOW_STOCK_THRESHOLD) {
    return '재고 부족';
  }
  return '재고 있음';
}

/**
 * 재고 부족 상품 필터링
 * @param {Array} products - 상품 목록
 * @returns {Array} 재고 부족 상품 목록
 */
export function getLowStockProducts(products) {
  return products.filter((product) => product.quantity < LOW_STOCK_THRESHOLD);
}

/**
 * 재고 부족 메시지 생성
 * @param {Array} lowStockProducts - 재고 부족 상품 목록
 * @returns {string} 재고 부족 메시지
 */
export function generateStockWarningMessage(lowStockProducts) {
  return lowStockProducts
    .map((product) => {
      if (product.quantity === 0) {
        return `${product.name}: 품절`;
      }
      return `${product.name}: 재고 부족 (${product.quantity}개 남음)`;
    })
    .join('\n');
}

/**
 * 재고 수량 업데이트
 * @param {Array} products - 상품 목록
 * @param {string} productId - 상품 ID
 * @param {number} change - 변경 수량 (음수: 감소, 양수: 증가)
 * @returns {boolean} 업데이트 성공 여부
 */
export function updateStockQuantity(products, productId, change) {
  const product = products.find((p) => p.id === productId);
  if (!product) {
    return false;
  }

  const newQuantity = product.quantity + change;
  if (newQuantity < 0) {
    return false; // 재고 부족
  }

  product.quantity = newQuantity;
  return true;
}

/**
 * 재고 충분 여부 확인
 * @param {Object} product - 상품 정보
 * @param {number} requestedQuantity - 요청 수량
 * @returns {boolean} 재고 충분 여부
 */
export function hasEnoughStock(product, requestedQuantity) {
  return product.quantity >= requestedQuantity;
}

/**
 * 재고 상태에 따른 상품 선택 가능 여부
 * @param {Object} product - 상품 정보
 * @returns {boolean} 선택 가능 여부
 */
export function isProductSelectable(product) {
  return product.quantity > 0;
}
