import { LOW_STOCK_THRESHOLD } from '../data/quantity.data';

/**
 * 모든 상품의 재고 합계 계산
 * @param {Array} products - 상품 목록
 * @returns {number} 모든 상품의 재고 합계
 */
export function calculateTotalStock(products) {
  return products.reduce((total, product) => total + product.q, 0);
}

/**
 * 모든 상품의 재고 상태 확인하여 재고 부족 상품 목록 생성
 * @param {Array} products - 상품 목록
 * @param {number} threshold - 재고 부족 임계값
 * @returns {Array} 재고 부족 상품 목록
 */
export function getLowStockItems(products, threshold) {
  return products.filter(product => product.q < threshold && product.q > 0);
}

/**
 * 재고 메시지를 생성하는 함수
 * @param {Array} productList - 상품 목록
 * @param {number} lowStockThreshold - 재고 부족 임계값
 * @returns {string} 재고 메시지
 */
export function generateStockMessage(productList) {
  let stockMessage = '';

  productList.forEach(item => {
    if (item.q < LOW_STOCK_THRESHOLD) {
      if (item.q > 0) {
        stockMessage = stockMessage + item.name + ': 재고 부족 (' + item.q + '개 남음)\n';
      } else {
        stockMessage = stockMessage + item.name + ': 품절\n';
      }
    }
  });

  return stockMessage;
}

export function validateStockAvailability(product, requestedQuantity, currentQuantity = 0) {
  const availableStock = product.q + currentQuantity;
  return requestedQuantity <= availableStock;
}

export function isLowStock(product) {
  return product.q < LOW_STOCK_THRESHOLD;
}

export function isOutOfStock(product) {
  return product.q === 0;
}
