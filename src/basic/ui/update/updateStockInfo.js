/**
 * 재고 정보 UI 업데이트
 * @param {Array} lowStockItems - 재고 부족 상품 정보 배열
 */
export const updateStockInfo = (lowStockItems) => {
  const stockInfo = document.getElementById("stock-status");
  if (!stockInfo) return;

  if (lowStockItems.length === 0) {
    stockInfo.textContent = "";
    return;
  }

  const infoMsg = lowStockItems.map((item) => item.message).join("\n");

  stockInfo.textContent = infoMsg;
};
