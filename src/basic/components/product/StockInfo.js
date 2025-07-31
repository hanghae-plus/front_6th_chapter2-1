import { LOW_STOCK_LIMIT } from '../../data/policy';

/** 재고 상태 메시지 생성
 * @param {Object} product - 상품 정보
 */
const createStockMessage = (product) => {
  if (product.stock === 0) {
    return `${product.name}: 품절`;
  }
  if (product.stock < LOW_STOCK_LIMIT) {
    return `${product.name}: 재고 부족 (${product.stock}개 남음)`;
  }
  return null; // 정상 재고는 메시지 없음
};

export const createStockInfo = () => {
  const stockInfo = document.createElement('div');
  stockInfo.id = 'stock-status';
  stockInfo.className = 'text-xs text-red-500 mt-3 whitespace-pre-line';
  return stockInfo;
};

export const updateStockInfo = (stockInfoElement, productList) => {
  if (!stockInfoElement || !productList?.length) return;

  // 재고 부족 메시지 생성
  const stockMessages = productList.map(createStockMessage).filter((message) => message !== null);

  // 메시지 업데이트
  stockInfoElement.textContent = stockMessages.join('\n');
};
