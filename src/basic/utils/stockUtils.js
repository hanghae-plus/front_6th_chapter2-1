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
  let stockMsg = "";
  
  for (let stockIdx = 0; stockIdx < productList.length; stockIdx++) {
    const item = productList[stockIdx];
    if (item.quantity < QUANTITY_THRESHOLDS.STOCK_DISPLAY_WARNING) {
      if (item.quantity > 0) {
        stockMsg += `${item.name}: 재고 부족 (${item.quantity}개 남음)\n`;
      } else {
        stockMsg += `${item.name}: 품절\n`;
      }
    }
  }
  
  return stockMsg;
}

/**
 * 재고 부족 상품 목록을 반환합니다.
 * @param {Array} productList - 상품 목록
 * @param {number} threshold - 재고 부족 기준값
 * @returns {Array} 재고 부족 상품 목록
 */
export function getLowStockProducts(productList, threshold = QUANTITY_THRESHOLDS.LOW_STOCK_WARNING) {
  return productList.filter(product => 
    product.quantity < threshold && product.quantity > 0
  );
}