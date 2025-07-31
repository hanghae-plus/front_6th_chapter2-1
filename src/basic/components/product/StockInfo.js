/**
 * 재고 정보 컴포넌트
 * 상품의 재고 상태를 표시하는 컴포넌트를 생성합니다.
 */
export function createStockInfo() {
  const stockInfoElement = document.createElement('div');
  stockInfoElement.id = 'stock-status';
  stockInfoElement.className = 'text-xs text-red-500 mt-3 whitespace-pre-line';
  return stockInfoElement;
}
