import { QUANTITY_THRESHOLDS } from "../constants/index.js";

/**
 * 전체 재고 수량을 계산합니다.
 * @param {Array} productList - 상품 목록
 * @returns {number} 전체 재고 수량
 */
export function calculateTotalStock(productList) {
  return productList.reduce((total, product) => total + product.quantity, 0);
}

/**
 * 재고 부족 상품들의 메시지를 생성합니다.
 * @param {Array} productList - 상품 목록
 * @returns {string} 재고 부족 메시지
 */
export function generateStockWarningMessage(productList) {
  return productList
    .filter(item => item.quantity < QUANTITY_THRESHOLDS.LOW_STOCK_WARNING)
    .map(item => {
      if (item.quantity > 0) {
        return `${item.name}: 재고 부족 (${item.quantity}개 남음)`;
      } else {
        return `${item.name}: 품절`;
      }
    })
    .join("\n");
}

/**
 * 재고 부족 상품 목록을 반환합니다.
 * @param {Array} productList - 상품 목록
 * @param {number} threshold - 재고 부족 기준값
 * @returns {Array} 재고 부족 상품 목록
 */
export function getLowStockProducts(productList, threshold = QUANTITY_THRESHOLDS.LOW_STOCK_WARNING) {
  return productList.filter(product => product.quantity < threshold && product.quantity > 0);
}
