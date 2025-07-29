// ==========================================
// 🎯 재고 정보 컴포넌트
// ==========================================

import { THRESHOLDS } from '../constant/index.js';

/**
 * 📦 재고 정보 UI 업데이트
 *
 * @description 각 제품의 재고 상태를 확인하여 부족/품절 알림 메시지를 생성하고 UI에 표시
 *
 * 알림 조건:
 * - 재고 5개 미만: "재고 부족 (N개 남음)" 메시지 표시
 * - 재고 0개: "품절" 메시지 표시
 * - 전체 재고 30개 미만: 추가 로직 실행 (현재 빈 구현)
 *
 * @param {Array} products - 상품 목록
 * @param {number} totalStock - 전체 재고 수량
 * @param {HTMLElement} stockInfoElement - 재고 정보 표시 DOM 요소
 */
export const updateStockInfoUI = (products, totalStock, stockInfoElement) => {
  let infoMsg = '';

  if (totalStock < THRESHOLDS.STOCK_MANAGEMENT_THRESHOLD) {
    return;
  }

  products.forEach(item => {
    if (item.quantity < THRESHOLDS.LOW_STOCK_WARNING) {
      if (item.quantity > 0) {
        infoMsg = `${infoMsg + item.name}: 재고 부족 (${item.quantity}개 남음)\n`;
      } else {
        infoMsg = `${infoMsg + item.name}: 품절\n`;
      }
    }
  });

  if (stockInfoElement) {
    stockInfoElement.textContent = infoMsg;
  }
};
