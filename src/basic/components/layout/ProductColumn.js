export const createProductColumn = ({ productSelector, cartAddButton, stockStatusElement, cartDisplay }) => {
  const productColumn = document.createElement('div');

  productColumn.className = 'bg-white border border-gray-200 p-8 overflow-y-auto';

  const selectorContainer = document.createElement('div');
  selectorContainer.className = 'space-y-2';
  selectorContainer.appendChild(productSelector);
  selectorContainer.appendChild(cartAddButton);

  productColumn.appendChild(selectorContainer); // 제품 선택 영역
  productColumn.appendChild(stockStatusElement); // 재고 상태
  productColumn.appendChild(cartDisplay); // 장바구니 목록

  return productColumn;
};
