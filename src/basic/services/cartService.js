// ==========================================
// 장바구니 서비스 🛒
// ==========================================

import { CartItem } from '../components/ui.js';
import { QUANTITY_THRESHOLDS } from '../constants/config.js';
import { PRODUCT_LIST } from '../constants/products.js';

// ==========================================
// 장바구니 아이템 관리 함수들
// ==========================================

/**
 * 기존 장바구니 아이템 수량 증가
 * @param {HTMLElement} cartItem - 장바구니 DOM 요소
 * @param {Object} productItem - 상품 정보 객체
 */
export function updateExistingCartItem(cartItem, productItem) {
  const quantityElement = cartItem.querySelector('.quantity-number');
  const currentQuantity = parseInt(quantityElement.textContent);
  const newQuantity =
    currentQuantity + QUANTITY_THRESHOLDS.DEFAULT_QUANTITY_INCREMENT;

  if (newQuantity <= productItem.quantity + currentQuantity) {
    quantityElement.textContent = newQuantity;
    productItem.quantity--;
  } else {
    alert('재고가 부족합니다.');
  }
}

/**
 * 새 장바구니 아이템 추가
 * @param {Object} item - 추가할 상품 정보
 * @param {HTMLElement} cartDisplay - 장바구니 컨테이너
 */
export function addNewItem(item, cartDisplay) {
  // 간단하고 안전한 방법
  cartDisplay.insertAdjacentHTML('beforeend', CartItem(item));
  item.quantity--;
}

/**
 * 장바구니 아이템 제거
 * @param {string} productId - 제거할 상품 ID
 * @param {Function} handleCalculateCartStuff - 총액 계산 함수
 */
export function removeItem(productId, handleCalculateCartStuff) {
  const cartItem = document.getElementById(productId);

  // 안전장치: null 체크
  if (!cartItem) {
    console.warn(`장바구니 아이템을 찾을 수 없습니다: ${productId}`);
    return;
  }

  const product = PRODUCT_LIST.find((p) => p.id === productId);
  const quantityElement = cartItem.querySelector('.quantity-number');

  // 안전장치: 수량 요소 체크
  if (quantityElement) {
    const quantity = parseInt(quantityElement.textContent);
    if (product) {
      product.quantity += quantity;
    }
  }

  cartItem.remove();
  handleCalculateCartStuff();
}

/**
 * 장바구니 수량 변경 처리
 * @param {string} productId - 상품 ID
 * @param {number} change - 변경할 수량 (+1 또는 -1)
 * @param {Function} handleCalculateCartStuff - 총액 계산 함수
 * @param {Function} updateProductOptions - 상품 옵션 업데이트 함수
 */
export function changeCartItemQuantity(
  productId,
  change,
  handleCalculateCartStuff,
  updateProductOptions
) {
  const cartItem = document.getElementById(productId);
  const product = PRODUCT_LIST.find((p) => p.id === productId);

  if (cartItem && product) {
    const quantityElement = cartItem.querySelector('.quantity-number');
    const currentQuantity = parseInt(quantityElement.textContent);
    const newQuantity = currentQuantity + change;

    if (newQuantity > 0 && newQuantity <= product.quantity + currentQuantity) {
      quantityElement.textContent = newQuantity;
      product.quantity -= change;
      handleCalculateCartStuff();
      updateProductOptions();
    } else if (newQuantity <= 0) {
      // 수량이 0이 되면 아이템 제거
      product.quantity += currentQuantity;
      cartItem.remove();
      handleCalculateCartStuff();
      updateProductOptions();
    } else {
      alert('재고가 부족합니다.');
    }
  }
}

/**
 * 상품을 장바구니에 추가 (메인 로직)
 * @param {string} selectedProductId - 선택된 상품 ID
 * @param {HTMLElement} cartDisplay - 장바구니 컨테이너
 * @param {Function} handleCalculateCartStuff - 총액 계산 함수
 * @returns {string|null} - 추가된 상품 ID 또는 null
 */
export function addProductToCart(
  selectedProductId,
  cartDisplay,
  handleCalculateCartStuff
) {
  const itemToAdd = PRODUCT_LIST.find(
    (product) => product.id === selectedProductId
  );

  if (!selectedProductId || !itemToAdd || itemToAdd.quantity <= 0) {
    return null;
  }

  // 이미 존재하는 상품인지 확인
  const existingCartItem = document.getElementById(itemToAdd.id);

  if (existingCartItem) {
    // 이미 있으면 수량 증가
    updateExistingCartItem(existingCartItem, itemToAdd);
  } else {
    // 새롭게 추가
    addNewItem(itemToAdd, cartDisplay);
  }

  // UI 업데이트
  handleCalculateCartStuff();
  return selectedProductId;
}
