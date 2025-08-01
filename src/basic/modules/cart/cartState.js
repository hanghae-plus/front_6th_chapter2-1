// =============================================================================
// CART STATE MANAGEMENT MODULE
// =============================================================================

import { findProductById } from '../data/productData.js';

// =============================================================================
// GLOBAL STATE DEFINITION
// =============================================================================

// 전역 상태 객체
let globalState = {
  // DOM 요소들
  stockStatusDisplay: null,
  productSelectElement: null,
  cartItemsContainer: null,
  cartTotalDisplay: null,

  // 비즈니스 상태
  itemCount: 0,
  totalAmount: 0,
  lastSelectedProductId: null,
};

// =============================================================================
// STATE SUBSCRIPTION SYSTEM
// =============================================================================

// 상태 변경 구독자들 (React의 리렌더링과 유사)
const subscribers = new Set();

// 상태 변경 알림 함수
function notifySubscribers() {
  subscribers.forEach((callback) => callback(globalState));
}

// 구독 함수 (React의 useEffect와 유사)
export function subscribe(callback) {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
}

// =============================================================================
// STATE UPDATE FUNCTIONS
// =============================================================================

// 상태 업데이트 함수 (React의 setState와 유사)
export function updateState(updates) {
  globalState = { ...globalState, ...updates };
  notifySubscribers();
}

// =============================================================================
// GETTER FUNCTIONS
// =============================================================================

export function getStockStatusDisplay() {
  return globalState.stockStatusDisplay;
}

export function getItemCount() {
  return globalState.itemCount;
}

export function getProductSelectElement() {
  return globalState.productSelectElement;
}

export function getTotalAmount() {
  return globalState.totalAmount;
}

export function getCartItemsContainer() {
  return globalState.cartItemsContainer;
}

export function getCartTotalDisplay() {
  return globalState.cartTotalDisplay;
}

export function getLastSelectedProductId() {
  return globalState.lastSelectedProductId;
}

// =============================================================================
// SETTER FUNCTIONS
// =============================================================================

// Setter 함수들 (상태 변경 시 알림)
export function setStockStatusDisplay(element) {
  updateState({ stockStatusDisplay: element });
}

export function setItemCount(count) {
  updateState({ itemCount: count });
}

export function setProductSelectElement(element) {
  updateState({ productSelectElement: element });
}

export function setTotalAmount(amount) {
  updateState({ totalAmount: amount });
}

export function setCartItemsContainer(container) {
  updateState({ cartItemsContainer: container });
}

export function setCartTotalDisplay(display) {
  updateState({ cartTotalDisplay: display });
}

export function setLastSelectedProductId(id) {
  updateState({ lastSelectedProductId: id });
}

// =============================================================================
// CART CALCULATION FUNCTIONS
// =============================================================================

// 장바구니 계산 함수들
export function calculateCartItems(cartItems) {
  const items = [];
  let subtotal = 0;
  let totalQuantity = 0;

  for (let i = 0; i < cartItems.length; i++) {
    const itemElement = cartItems[i];
    const product = findProductById(itemElement.id);
    if (!product) continue;

    const quantity = parseInt(
      itemElement.querySelector('.quantity-number').textContent
    );
    const itemTotal = product.price * quantity;

    items.push({ product, quantity, itemTotal });
    subtotal += itemTotal;
    totalQuantity += quantity;
  }

  return { items, subtotal, totalQuantity };
}

// =============================================================================
// CART ITEM OPERATIONS
// =============================================================================

export function updateExistingCartItem(cartItem, product) {
  const currentQuantity = getCurrentQuantity(cartItem);
  const newQuantity = currentQuantity + 1;

  if (!isStockAvailable(product)) {
    showStockShortageAlert();
    return;
  }

  updateItemQuantity(cartItem, newQuantity, product, 1);
}

// 재고 사용 가능 여부 확인
function isStockAvailable(product) {
  return product.stockQuantity > 0;
}

export function handleQuantityChange(productId, changeAmount) {
  const cartItem = getCartItemById(productId);
  if (!cartItem) return;

  const product = findProductById(productId);
  if (!product) return;

  const currentQuantity = getCurrentQuantity(cartItem);
  const newQuantity = currentQuantity + changeAmount;

  if (newQuantity <= 0) {
    handleRemoveItem(productId);
    return;
  }

  if (!isQuantityChangeValid(changeAmount, currentQuantity, product)) {
    showStockShortageAlert();
    return;
  }

  updateItemQuantity(cartItem, newQuantity, product, changeAmount);
}

// 장바구니 아이템 조회
function getCartItemById(productId) {
  return document.getElementById(productId);
}

// 현재 수량 조회
function getCurrentQuantity(cartItem) {
  const quantityElement = cartItem.querySelector('.quantity-number');
  return parseInt(quantityElement.textContent);
}

// 수량 변경 유효성 검사
function isQuantityChangeValid(changeAmount, currentQuantity, product) {
  if (changeAmount <= 0) return true;
  
  const newQuantity = currentQuantity + changeAmount;
  return newQuantity <= currentQuantity + product.stockQuantity;
}

// 재고 부족 알림
function showStockShortageAlert() {
  if (typeof window !== 'undefined' && window.alert) {
    window.alert('재고가 부족합니다.');
  }
}

// 아이템 수량 업데이트
function updateItemQuantity(cartItem, newQuantity, product, changeAmount) {
  const quantityElement = cartItem.querySelector('.quantity-number');
  quantityElement.textContent = newQuantity;
  product.stockQuantity -= changeAmount;
}

export function handleRemoveItem(productId) {
  const cartItem = getCartItemById(productId);
  if (!cartItem) return;

  const product = findProductById(productId);
  if (!product) return;

  const quantity = getCurrentQuantity(cartItem);
  restoreProductStock(product, quantity);
  removeCartItem(cartItem);
}

// 상품 재고 복원
function restoreProductStock(product, quantity) {
  product.stockQuantity += quantity;
}

// 장바구니 아이템 제거
function removeCartItem(cartItem) {
  cartItem.remove();
}

// =============================================================================
// STATE INITIALIZATION & UTILITY
// =============================================================================

// 상태 초기화 함수
export function initializeCartState() {
  updateState({
    itemCount: 0,
    totalAmount: 0,
    lastSelectedProductId: null,
  });
}

// 상태 스냅샷 함수 (디버깅용)
export function getStateSnapshot() {
  return { ...globalState };
}
