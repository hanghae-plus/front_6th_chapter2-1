// 메인 그리드 레이아웃 생성
export function MainGrid() {
  const gridContainer = document.createElement("div");
  gridContainer.className =
    "grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden";
  return gridContainer;
}
