export const createMainLayout = ({ productColumn, summaryColumn }) => {
  const mainLayout = document.createElement('div');

  mainLayout.className = 'grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden';

  // 제품 목록, 주문 요약 추가
  mainLayout.appendChild(productColumn);
  mainLayout.appendChild(summaryColumn);

  return mainLayout;
};
