// 재고 상태 표시 영역 생성
export function StockStatusDisplay() {
  const div = document.createElement("div");
  div.id = "stock-status";
  div.className = "text-xs text-red-500 mt-3 whitespace-pre-line";
  return div;
}
