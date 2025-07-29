// 헤더 업데이트
export const renderTotalProductCount = (appState) => {
  const itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    itemCountElement.textContent = '🛍️ ' + appState.totalProductCount + ' items in cart';
  }
};
