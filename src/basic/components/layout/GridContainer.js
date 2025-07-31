/**
 * 그리드 컨테이너 컴포넌트
 * 왼쪽 컬럼과 오른쪽 컬럼을 감싸는 그리드 레이아웃을 생성합니다.
 */
export function createGridContainer(leftColumn, rightColumn) {
  const gridContainer = document.createElement('div');
  gridContainer.className =
    'grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden';
  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumn);
  return gridContainer;
}
