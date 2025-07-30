/**
 * React 스타일 ProductSelector 컴포넌트 (순수 함수)
 * 
 * @param {Object} props - 컴포넌트 props
 * @param {Array} props.products - 상품 목록
 * @param {string} props.selectedProductId - 선택된 상품 ID
 * @param {Function} props.onProductSelect - 상품 선택 핸들러
 * @param {Function} props.onAddToCart - 장바구니 추가 핸들러
 * @param {number} props.totalStock - 총 재고 수량
 * @returns {Object} DOM 요소들과 렌더 함수
 */
export function ProductSelector(props = {}) {
  const {
    products = [],
    selectedProductId = null,
    onProductSelect = () => {},
    onAddToCart = () => {},
    totalStock = 0
  } = props;

  // DOM 요소 생성 (한 번만)
  const createElement = () => {
    const productSelect = document.createElement('select');
    productSelect.id = 'product-select';
    productSelect.className = 'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';

    const addButton = document.createElement('button');
    addButton.id = 'add-to-cart';
    addButton.innerHTML = 'Add to Cart';
    addButton.className = 'w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all';

    const stockInfo = document.createElement('div');
    stockInfo.id = 'stock-status';
    stockInfo.className = 'text-xs text-red-500 mt-3 whitespace-pre-line';

    return { productSelect, addButton, stockInfo };
  };

  // 렌더링 함수 (props에 따라 DOM 업데이트)
  const render = (elements) => {
    if (!elements) return null;

    const { productSelect, stockInfo } = elements;

    // 상품 옵션 렌더링
    productSelect.innerHTML = products.map(product => {
      const discountIcon = product.onSale ? '⚡' : product.suggestSale ? '💝' : '';
      const priceDisplay = product.onSale || product.suggestSale 
        ? `₩${product.val.toLocaleString()}` 
        : `₩${product.originalVal.toLocaleString()}`;
      
      return `<option value="${product.id}" ${selectedProductId === product.id ? 'selected' : ''}>
        ${discountIcon}${product.name} - ${priceDisplay}
      </option>`;
    }).join('');

    // 재고 정보 렌더링
    stockInfo.textContent = `총 재고: ${totalStock}개`;
    
    return elements;
  };

  // 이벤트 핸들러 바인딩
  const bindEvents = (elements) => {
    if (!elements) return;

    const { productSelect, addButton } = elements;
    
    productSelect.addEventListener('change', (e) => {
      onProductSelect(e.target.value);
    });

    addButton.addEventListener('click', () => {
      if (selectedProductId) {
        onAddToCart(selectedProductId);
      }
    });
  };

  return {
    createElement,
    render,
    bindEvents
  };
}

/**
 * ProductSelector 렌더링 함수
 *
 * @description 상품 선택 영역 HTML 문자열을 생성
 *
 * @returns {string} 상품 선택 영역 HTML 문자열
 */
export const renderProductSelector = () => {
  return `
    <select id="product-select" class="w-full p-3 border border-gray-300 rounded-lg text-base mb-3">
    </select>
    <button id="add-to-cart" class="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all">
      Add to Cart
    </button>
    <div id="stock-status" class="text-xs text-red-500 mt-3 whitespace-pre-line"></div>
  `;
};
