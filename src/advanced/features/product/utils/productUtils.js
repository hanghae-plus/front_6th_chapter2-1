/**
 * Product Utils - 실제 productService.js에서 사용중인 순수 함수들
 */

/**
 * 상품 ID로 상품 찾기 (현재 productService.js의 productUtils.findById 기반)
 */
export const findProductById = (productId, products) => {
  return products.find(p => p.id === productId);
};

/**
 * 총 재고 수량 계산 (현재 updateProductSelector에서 사용중)
 */
export const getTotalStock = products => {
  return products.reduce((sum, product) => sum + product.q, 0);
};

/**
 * 재고 상태 메시지 생성 (현재 updateStockInfo에서 사용중인 로직)
 */
export const generateStockStatusMessage = (products, threshold = 5) => {
  let infoMsg = '';

  products.forEach(item => {
    if (item.q < threshold) {
      if (item.q > 0) {
        infoMsg += `${item.name}: 재고 부족 (${item.q}개 남음)\n`;
      } else {
        infoMsg += `${item.name}: 품절\n`;
      }
    }
  });

  return infoMsg;
};

/**
 * 재고 부족 여부 확인 (총 재고가 임계값 미만인지)
 */
