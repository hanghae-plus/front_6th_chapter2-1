/**
 * UI 렌더링 컴포넌트들 (남은 컴포넌트들)
 * 대부분의 컴포넌트는 src/basic/components/ 폴더로 이동되었습니다.
 */

// 장바구니 추가 버튼 컴포넌트
export function createAddToCartButton() {
  const addToCartButton = document.createElement('button');
  addToCartButton.id = 'add-to-cart';
  addToCartButton.innerHTML = 'Add to Cart';
  addToCartButton.className =
    'w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all';
  return addToCartButton;
}

// 상품 선택 컨테이너 컴포넌트
export function createSelectorContainer(productSelector, addToCartButton, stockInfoElement) {
  const selectorContainer = document.createElement('div');
  selectorContainer.className = 'mb-6 pb-6 border-b border-gray-200';
  selectorContainer.appendChild(productSelector);
  selectorContainer.appendChild(addToCartButton);
  selectorContainer.appendChild(stockInfoElement);
  return selectorContainer;
}

// 왼쪽 컬럼 컴포넌트
export function createLeftColumn(selectorContainer, cartDisplayElement) {
  const leftColumn = document.createElement('div');
  leftColumn.className = 'bg-white border border-gray-200 p-8 overflow-y-auto';
  leftColumn.appendChild(selectorContainer);
  leftColumn.appendChild(cartDisplayElement);
  return leftColumn;
}
