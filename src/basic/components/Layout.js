/**
 * 그리드 컨테이너를 생성합니다.
 * @returns {HTMLElement} 그리드 컨테이너 요소
 */
export function createGridContainer() {
  const gridContainer = document.createElement("div");
  gridContainer.className = "grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden";
  return gridContainer;
}

/**
 * 왼쪽 컬럼을 생성합니다.
 * @returns {HTMLElement} 왼쪽 컬럼 요소
 */
export function createLeftColumn() {
  const leftColumn = document.createElement("div");
  leftColumn.className = "bg-white border border-gray-200 p-8 overflow-y-auto";
  return leftColumn;
}

/**
 * 오른쪽 컬럼을 생성합니다.
 * @returns {HTMLElement} 오른쪽 컬럼 요소
 */
export function createRightColumn() {
  const rightColumn = document.createElement("div");
  rightColumn.className = "bg-black text-white p-8 flex flex-col";
  return rightColumn;
}

/**
 * 전체 레이아웃 시스템을 생성합니다.
 * @returns {Object} 레이아웃 컴포넌트들
 */
export function createLayoutSystem() {
  const gridContainer = createGridContainer();
  const leftColumn = createLeftColumn();
  const rightColumn = createRightColumn();

  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumn);

  return {
    gridContainer,
    leftColumn,
    rightColumn,
  };
}
