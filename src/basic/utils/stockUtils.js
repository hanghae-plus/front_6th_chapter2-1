// ==========================================
// 🎯 재고 유틸리티
// ==========================================

import { THRESHOLDS } from '../constant/index.js';

/**
 * 📦 재고 경고 메시지 생성
 *
 * @description 재고가 부족한 상품들의 경고 메시지를 생성
 *
 * @param {Array} products - 상품 목록
 * @returns {string} 재고 경고 메시지
 */
export const generateStockWarningMessage = products => {
  // 🎯 for문 → filter() + map() + join() 메서드 체인으로 현대화
  return products
    .filter(product => product.quantity < THRESHOLDS.LOW_STOCK_WARNING)
    .map(product => {
      if (product.quantity > 0) {
        return `${product.name}: 재고 부족 (${product.quantity}개 남음)`;
      } else {
        return `${product.name}: 품절`;
      }
    })
    .join('\n');
};
