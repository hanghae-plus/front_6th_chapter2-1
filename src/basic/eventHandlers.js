// ============================================
// EVENT HANDLERS & TIMER FUNCTIONS
// ============================================

import { TIMER_CONFIG } from './constants.js';
import {
  DOMElements,
  safeSetTextContent,
  safeSetInnerHTML,
  safeAppendChild,
  safeRemoveElement,
  safeGetTextContent,
  safeGetValue,
} from './domElements.js';
import { updateSelectOptions, calculateCart, updatePricesInCart } from './uiUpdates.js';

// 전역 변수들 (main.basic.js에서 설정됨) - 점진적 정리 중
// 상품 목록과 lastSelectedProduct는 래퍼 함수로 접근
// productSelector와 cartDisplay는 래퍼 함수로 접근

// 전역 변수 설정 함수 (더 이상 필요하지 않음)
export const setGlobalVariables = (globals) => {
  // 모든 상태는 래퍼 함수를 통해 접근
};

// 이벤트 리스너 설정 함수 (매개변수로 필요한 함수들을 받음)
export const createSetupEventListeners = (
  getDOMElements,
  getProductList,
  updateLastSelectedProduct,
  getCartState,
  setCartState,
  calculateCart,
  updateSelectOptions,
) => {
  return (addButton) => {
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
};

// 장바구니에 상품 추가 함수 (매개변수로 필요한 함수들을 받음)
const createHandleAddToCart = (
  getDOMElements,
  getProductList,
  updateLastSelectedProduct,
  getCartState,
  setCartState,
  calculateCart,
) => {
  return () => {
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

    calculateCart(getProductList, getCartState, setCartState, getDOMElements);
    // lastSelectedProduct 업데이트는 래퍼 함수 사용
    updateLastSelectedProduct(selectedProductId);
  };
};

// 장바구니 아이템 요소 생성
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

// 장바구니 상호작용 처리 함수 (매개변수로 필요한 함수들을 받음)
const createHandleCartInteraction = (
  getDOMElements,
  getProductList,
  getCartState,
  setCartState,
  calculateCart,
  updateSelectOptions,
) => {
  return (event) => {
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

    calculateCart(getProductList, getCartState, setCartState, getDOMElements);
    updateSelectOptions(getProductList, getDOMElements);
  };
};

// 타이머 설정
export const setupTimers = () => {
  // 번개세일 타이머 - 원본과 동일한 지연 시간 적용
  const lightningDelay = Math.random() * TIMER_CONFIG.LIGHTNING_DELAY_MAX;
  setTimeout(() => {
    setInterval(() => {
      const productList = getProductList();
      const luckyIndex = Math.floor(Math.random() * productList.length);
      const luckyProduct = productList[luckyIndex];

      if (luckyProduct.quantity > 0 && !luckyProduct.onSale) {
        luckyProduct.value = Math.round(luckyProduct.originalValue * 0.8);
        luckyProduct.onSale = true;
        alert(`⚡번개세일! ${luckyProduct.name}이(가) 20% 할인 중입니다!`);
        updateSelectOptions();
        updatePricesInCart();
      }
    }, TIMER_CONFIG.LIGHTNING_INTERVAL);
  }, lightningDelay);

  // 추천할인 타이머 - 원본과 동일한 지연 시간 적용
  setTimeout(() => {
    setInterval(() => {
      const elements = getDOMElements();
      if (elements.cartDisplay.children.length === 0) {
        return;
      }
      const { lastSelectedProduct } = getCartState();
      if (lastSelectedProduct) {
        const productList = getProductList();
        const suggestProduct = productList.find(
          (product) =>
            product.id !== lastSelectedProduct && product.quantity > 0 && !product.suggestSale,
        );

        if (suggestProduct) {
          alert(`💝 ${suggestProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          suggestProduct.value = Math.round(suggestProduct.value * 0.95);
          suggestProduct.suggestSale = true;
          updateSelectOptions();
          updatePricesInCart();
        }
      }
    }, TIMER_CONFIG.RECOMMENDATION_INTERVAL);
  }, Math.random() * TIMER_CONFIG.RECOMMENDATION_DELAY_MAX);
};
