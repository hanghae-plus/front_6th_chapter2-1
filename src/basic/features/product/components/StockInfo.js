/** 재고 정보 표시 영역 생성 */
export function StockInfo() {
  const stockInfo = document.createElement('div');
  stockInfo.id = 'stock-status';
  stockInfo.className = 'text-xs text-red-500 mt-3 whitespace-pre-line';
  return stockInfo;
}
