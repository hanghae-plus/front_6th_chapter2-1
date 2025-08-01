/**
 * 이벤트 핸들러 및 타이머 함수들
 * 사용자 상호작용과 자동 이벤트를 처리하는 함수들을 관리
 */

import {
  DOMElements,
  safeSetTextContent,
  safeSetInnerHTML,
  safeAppendChild,
  safeRemoveElement,
  safeGetTextContent,
  safeGetValue,
} from './domElements.js';

/**
 * 이벤트 리스너 설정 함수
 * @param {Function} getDOMElements - DOM 요소 가져오기 함수
 * @param {Function} getProductList - 상품 목록 가져오기 함수
 * @param {Function} updateLastSelectedProduct - 마지막 선택 상품 업데이트 함수
 * @param {Function} getCartState - 장바구니 상태 가져오기 함수
 * @param {Function} setCartState - 장바구니 상태 설정 함수
 * @param {Function} calculateCart - 장바구니 계산 함수
 * @param {Function} updateSelectOptions - 선택 옵션 업데이트 함수
 * @returns {Function} 이벤트 리스너 설정 함수
 */
export const createSetupEventListeners =
  (
    getDOMElements,
    getProductList,
    updateLastSelectedProduct,
    getCartState,
    setCartState,
    calculateCart,
    updateSelectOptions,
  ) =>
  (addButton) => {
    const handleAddToCart = createHandleAddToCart(
      getDOMElements,
      getProductList,
      updateLastSelectedProduct,
      getCartState,
      setCartState,
      calculateCart,
    );
    const handleCartInteraction = createHandleCartInteraction(
      getDOMElements,
      getProductList,
      getCartState,
      setCartState,
      calculateCart,
      updateSelectOptions,
    );

    addButton.addEventListener('click', handleAddToCart);

    const elements = getDOMElements();
    if (elements && elements.cartDisplay) {
      elements.cartDisplay.addEventListener('click', handleCartInteraction);
    }
  };

/**
 * 장바구니에 상품 추가 함수
 * @param {Function} getDOMElements - DOM 요소 가져오기 함수
 * @param {Function} getProductList - 상품 목록 가져오기 함수
 * @param {Function} updateLastSelectedProduct - 마지막 선택 상품 업데이트 함수
 * @param {Function} getCartState - 장바구니 상태 가져오기 함수
 * @param {Function} setCartState - 장바구니 상태 설정 함수
 * @param {Function} calculateCart - 장바구니 계산 함수
 * @returns {Function} 장바구니 추가 핸들러
 */
const createHandleAddToCart =
  (
    getDOMElements,
    getProductList,
    updateLastSelectedProduct,
    getCartState,
    setCartState,
    calculateCart,
  ) =>
  () => {
    const elements = getDOMElements();
    const selectedProductId = safeGetValue(elements.productSelector);

    if (!selectedProductId) return;

    const productList = getProductList();
    const product = productList.find((p) => p.id === selectedProductId);
    if (!product || product.quantity <= 0) return;

    const existingItem = DOMElements.getCartItem(product.id);

    if (existingItem) {
      // 기존 아이템 수량 증가
      const quantityElement = DOMElements.getQuantityElement(product.id);
      const currentQuantity = parseInt(safeGetTextContent(quantityElement) || '0');
      const newQuantity = currentQuantity + 1;

      if (newQuantity <= product.quantity + currentQuantity) {
        safeSetTextContent(quantityElement, newQuantity.toString());
        product.quantity--;
      } else {
        alert('재고가 부족합니다.');
        return;
      }
    } else {
      // 새 아이템 추가
      const newItem = createCartItemElement(product);
      const elements = getDOMElements();
      safeAppendChild(elements.cartDisplay, newItem);
      product.quantity--;
    }

    calculateCart(getProductList, getCartState, setCartState);
    updateLastSelectedProduct(selectedProductId);
  };

/**
 * 장바구니 아이템 요소 생성
 * @param {Object} product - 상품 객체
 * @returns {Element} 생성된 장바구니 아이템 요소
 */
const createCartItemElement = (product) => {
  const newItem = document.createElement('div');
  newItem.id = product.id;
  newItem.className =
    'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';

  const saleIcon =
    product.onSale && product.suggestSale
      ? '⚡💝'
      : product.onSale
        ? '⚡'
        : product.suggestSale
          ? '💝'
          : '';

  const priceDisplay =
    product.onSale || product.suggestSale
      ? `<span class="line-through text-gray-400">₩${product.originalValue.toLocaleString()}</span> <span class="${product.onSale && product.suggestSale ? 'text-purple-600' : product.onSale ? 'text-red-500' : 'text-blue-500'}">₩${product.value.toLocaleString()}</span>`
      : `₩${product.value.toLocaleString()}`;

  safeSetInnerHTML(
    newItem,
    `
    <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
      <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
    </div>
    <div>
      <h3 class="text-base font-normal mb-1 tracking-tight">${saleIcon}${product.name}</h3>
      <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
      <p class="text-xs text-black mb-3">${priceDisplay}</p>
      <div class="flex items-center gap-4">
        <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${product.id}" data-change="-1">−</button>
        <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
        <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${product.id}" data-change="1">+</button>
      </div>
    </div>
    <div class="text-right">
      <div class="text-lg mb-2 tracking-tight tabular-nums">${priceDisplay}</div>
      <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${product.id}">Remove</a>
    </div>
  `,
  );

  return newItem;
};

/**
 * 장바구니 상호작용 처리 함수
 * @param {Function} getDOMElements - DOM 요소 가져오기 함수
 * @param {Function} getProductList - 상품 목록 가져오기 함수
 * @param {Function} getCartState - 장바구니 상태 가져오기 함수
 * @param {Function} setCartState - 장바구니 상태 설정 함수
 * @param {Function} calculateCart - 장바구니 계산 함수
 * @param {Function} updateSelectOptions - 선택 옵션 업데이트 함수
 * @returns {Function} 장바구니 상호작용 핸들러
 */
const createHandleCartInteraction =
  (
    getDOMElements,
    getProductList,
    getCartState,
    setCartState,
    calculateCart,
    updateSelectOptions,
  ) =>
  (event) => {
    const { target } = event;

    if (
      !target.classList.contains('quantity-change') &&
      !target.classList.contains('remove-item')
    ) {
      return;
    }

    const { productId } = target.dataset;
    const itemElement = DOMElements.getCartItem(productId);
    const productList = getProductList();
    const product = productList.find((p) => p.id === productId);

    if (!product || !itemElement) return;

    if (target.classList.contains('quantity-change')) {
      const quantityChange = parseInt(target.dataset.change);
      const quantityElement = DOMElements.getQuantityElement(productId);
      const currentQuantity = parseInt(safeGetTextContent(quantityElement) || '0');
      const newQuantity = currentQuantity + quantityChange;

      // 재고 계산 수정: 현재 장바구니 수량을 고려한 재고 확인
      const availableStock = product.quantity + currentQuantity;

      if (newQuantity > 0 && newQuantity <= availableStock) {
        safeSetTextContent(quantityElement, newQuantity.toString());
        // 재고 업데이트: 실제로 사용된 수량만큼만 차감
        product.quantity = availableStock - newQuantity;
      } else if (newQuantity <= 0) {
        // 수량이 0이 되면 재고를 모두 복구하고 아이템 제거
        product.quantity = availableStock;
        safeRemoveElement(itemElement);
      } else {
        alert('재고가 부족합니다.');
        return;
      }
    } else if (target.classList.contains('remove-item')) {
      const quantityElement = DOMElements.getQuantityElement(productId);
      const removedQuantity = parseInt(safeGetTextContent(quantityElement) || '0');
      // Remove 버튼: 현재 장바구니 수량을 재고에 복구
      product.quantity += removedQuantity;
      safeRemoveElement(itemElement);
    }

    calculateCart(getProductList, getCartState, setCartState);
    updateSelectOptions(getProductList, getDOMElements);
  };

/**
 * 타이머 설정 (사용하지 않음 - main.basic.js에서 직접 처리)
 * @returns {void}
 */
export const setupTimers = () => {
  // 이 함수는 더 이상 사용되지 않습니다.
  // 타이머 설정은 main.basic.js에서 직접 처리됩니다.
};
