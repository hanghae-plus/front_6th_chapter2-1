import { LOW_STOCK_THRESHOLD, OUT_OF_STOCK } from './const';

/**
 * 상품 리스트에서 전체 재고 수량 합계를 계산해 반환합니다.
 */
export const getTotalStock = (productList) => {
  return productList.reduce((totalStock, currentProduct) => totalStock + currentProduct.q, 0);
};

/**
 * 단일 상품에 대한 재고 상태 메시지를 생성합니다.
 * - 재고가 충분한 경우 빈 문자열 반환
 * - 재고가 부족하면 '재고 부족' 또는 '품절' 메시지 반환
 */
export const getStockStatusMessage = (product) => {
  if (product.q >= LOW_STOCK_THRESHOLD) return '';
  return `${product.name}: ${product.q > OUT_OF_STOCK ? `재고 부족 (${product.q}개 남음)` : '품절'}\n`;
};
