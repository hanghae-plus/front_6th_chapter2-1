/**
 * 재고 정보 표시 업데이트
 * 상품 재고 상태를 기반으로 재고 정보를 표시
 */
export function updateStockDisplay({ stockInfo }) {
  const stockStatusElement = document.getElementById('stock-status');

  if (stockStatusElement) {
    stockStatusElement.textContent = stockInfo;
  }
}
