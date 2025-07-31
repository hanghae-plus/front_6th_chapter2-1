/**
 * 재고 정보 UI 업데이트
 * @param {Array} lowStockItems - 재고 부족 상품 정보 배열
 */
export const updateStockInfo = (lowStockItems) => {
  // 재고 정보 요소 존재 체크
  const stockInfo = document.getElementById("stock-status");
  if (!stockInfo) return;

  // 재고 부족 상품이 없으면 숨김
  if (lowStockItems.length === 0) {
    stockInfo.textContent = "";
    return;
  }

  // 재고 부족 상품 메시지 생성
  const infoMsg = lowStockItems.map((item) => item.message).join("\n");

  // 재고 정보 요소 내용 업데이트
  stockInfo.textContent = infoMsg;
};
