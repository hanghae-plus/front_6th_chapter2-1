// EventHandler.js - 이벤트 핸들러 관리 유틸리티

import { cartStoreActions } from '../store/cartStore.js';
import { getProductById } from '../services/product/ProductService.js';
import { UI_CONSTANTS } from '../constants/index.js';

/**
 * 장바구니 추가 버튼 클릭 이벤트 핸들러
 * @param {HTMLSelectElement} productSelector - 상품 선택 요소
 * @param {Function} addItemToCartUI - 장바구니 추가 UI 함수
 */
export function handleAddToCartClick(productSelector, addItemToCartUI) {
  const selectedProductId = productSelector.value;

  if (!selectedProductId) {
    return;
  }

  // 장바구니에 상품 추가
  addItemToCartUI(selectedProductId, 1);
}

/**
 * 장바구니 내 수량 변경 이벤트 핸들러
 * @param {Event} event - 클릭 이벤트
 * @param {Object} handlers - 핸들러 함수들
 */
export function handleQuantityChange(event, handlers) {
  const { updateCartItemQuantity, removeItemFromCart, calculateCartSummary, updateProductOptions } =
    handlers;

  const { target } = event;
  const { productId } = target.dataset;
  const quantityChange = parseInt(target.dataset.change);

  const itemElement = document.getElementById(productId);
  const quantityElement = itemElement.querySelector('.quantity-number');
  const currentQuantity = parseInt(quantityElement.textContent);
  const newQuantity = currentQuantity + quantityChange;

  if (newQuantity > 0) {
    // 수량 변경
    const result = updateCartItemQuantity(productId, newQuantity);
    if (result.success) {
      quantityElement.textContent = newQuantity;
    } else {
      alert(result.message || '재고가 부족합니다.');
    }
  } else {
    // 상품 제거
    const result = removeItemFromCart(productId);
    if (result.success) {
      itemElement.remove();
    } else {
      alert(result.message || '상품 제거에 실패했습니다.');
    }
  }

  // 재고 상태 확인 및 알림
  checkStockStatus(productId);

  // UI 업데이트
  calculateCartSummary();
  updateProductOptions();
}

/**
 * 장바구니 내 상품 제거 이벤트 핸들러
 * @param {Event} event - 클릭 이벤트
 * @param {Object} handlers - 핸들러 함수들
 */
export function handleRemoveItem(event, handlers) {
  const { removeItemFromCart, calculateCartSummary, updateProductOptions } = handlers;

  const { target } = event;
  const { productId } = target.dataset;

  const itemElement = document.getElementById(productId);

  // 상품 제거
  const result = removeItemFromCart(productId);
  if (result.success) {
    itemElement.remove();
  } else {
    alert(result.message || '상품 제거에 실패했습니다.');
  }

  // 재고 상태 확인 및 알림
  checkStockStatus(productId);

  // UI 업데이트
  calculateCartSummary();
  updateProductOptions();
}

/**
 * 재고 상태 확인 및 알림
 * @param {string} productId - 상품 ID
 */
function checkStockStatus(productId) {
  const product = getProductById(cartStoreActions.getProducts(), productId);

  if (product && product.quantity < UI_CONSTANTS.LOW_STOCK_THRESHOLD) {
    // 재고 부족 알림 (필요시 추가 구현)
    console.log(`${product.name}의 재고가 부족합니다.`);
  }
}

/**
 * 장바구니 이벤트 위임 핸들러
 * @param {Event} event - 클릭 이벤트
 * @param {Object} handlers - 핸들러 함수들
 */
export function handleCartItemClick(event, handlers) {
  const { target } = event;

  if (target.classList.contains('quantity-change')) {
    handleQuantityChange(event, handlers);
  } else if (target.classList.contains('remove-item')) {
    handleRemoveItem(event, handlers);
  }
}

/**
 * 상품 선택 변경 이벤트 핸들러
 * @param {Event} event - change 이벤트
 * @param {Function} updateProductOptions - 상품 옵션 업데이트 함수
 */
export function handleProductSelectionChange(event, updateProductOptions) {
  const selectedProductId = event.target.value;

  if (selectedProductId) {
    // 마지막 선택된 상품 ID 저장
    cartStoreActions.setLastSelectedProductId(selectedProductId);
  }

  // 상품 옵션 업데이트
  updateProductOptions();
}

/**
 * 이벤트 리스너 등록 함수
 * @param {Object} elements - DOM 요소들
 * @param {Object} handlers - 핸들러 함수들
 */
export function setupEventListeners(elements, handlers) {
  const { addToCartButton, productSelector, cartDisplayElement } = elements;
  const {
    addItemToCartUI,
    updateCartItemQuantity,
    removeItemFromCart,
    calculateCartSummary,
    updateProductOptions,
  } = handlers;

  // 장바구니 추가 버튼 클릭 이벤트
  addToCartButton.addEventListener('click', () => {
    handleAddToCartClick(productSelector, addItemToCartUI);
  });

  // 상품 선택 변경 이벤트
  productSelector.addEventListener('change', (event) => {
    handleProductSelectionChange(event, updateProductOptions);
  });

  // 장바구니 아이템 클릭 이벤트 (위임)
  cartDisplayElement.addEventListener('click', (event) => {
    handleCartItemClick(event, {
      updateCartItemQuantity,
      removeItemFromCart,
      calculateCartSummary,
      updateProductOptions,
    });
  });
}
