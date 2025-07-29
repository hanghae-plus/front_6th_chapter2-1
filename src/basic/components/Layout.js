/**
 * 전체 애플리케이션 레이아웃 생성
 */
export function Layout() {
  const root = document.getElementById('app');
  const gridContainer = document.createElement('div');
  const leftColumn = document.createElement('div');
  const selectorContainer = document.createElement('div');

  // 🎨 메인 레이아웃 구성 (좌측 카트 + 우측 요약)
  selectorContainer.className = 'mb-6 pb-6 border-b border-gray-200';

  leftColumn.className = 'bg-white border border-gray-200 p-8 overflow-y-auto';
  leftColumn.appendChild(selectorContainer);

  // 🔲 메인 그리드 구성 (2열 레이아웃: 카트 + 요약)
  gridContainer.className =
    'grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden';

  return {
    root,
    gridContainer,
    leftColumn,
    selectorContainer,
  };
}

/**
 * Layout 렌더링 함수
 *
 * @description 레이아웃 HTML 문자열을 생성
 *
 * @returns {string} 레이아웃 HTML 문자열
 */
export const renderLayout = () => {
  return `
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
      <div class="bg-white border border-gray-200 p-8 overflow-y-auto">
        <div class="mb-6 pb-6 border-b border-gray-200"></div>
      </div>
    </div>
  `;
};
