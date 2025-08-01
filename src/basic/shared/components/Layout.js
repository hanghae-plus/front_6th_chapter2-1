/** 메인 그리드 컨테이너 생성 */
export function MainGrid() {
  const mainGrid = document.createElement('main');
  mainGrid.className =
    'grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden';
  return mainGrid;
}

/** 좌측 컬럼 (상품 선택 + 장바구니) 생성 */
export function LeftColumn() {
  const leftColumn = document.createElement('section');
  leftColumn.className = 'bg-white border border-gray-200 p-8 overflow-y-auto';
  return leftColumn;
}
