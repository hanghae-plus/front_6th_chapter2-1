// 상품 패널 (좌측) 생성
export function ProductPanel() {
  const leftColumn = document.createElement("div");
  leftColumn.className = "bg-white border border-gray-200 p-8 overflow-y-auto";
  return leftColumn;
}
