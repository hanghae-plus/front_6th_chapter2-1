// ==========================================
// 이벤트 핸들러들 (리액트 스러운 패턴)
// ==========================================

import { validateProduct } from '../utils/pureFunctions.js';

/**
 * 장바구니 추가 핸들러
 *
 * @param {string} productId - 상품 ID
 * @param {Object} state - 현재 상태
 * @param {Function} setState - 상태 업데이트 함수
 * @param {Array} products - 상품 목록
 * @returns {Object} 업데이트된 상태
 */
export const handleAddToCart = (productId, state, setState, products) => {
  const product = products.find(p => p.id === productId);
  const validation = validateProduct(product, 1);

  if (!validation.isValid) {
    alert(validation.error);
    return state;
  }

  // 장바구니에 상품 추가 로직
  const newCartItems = [...state.cartItems];
  const existingItem = newCartItems.find(item => item.id === productId);

  if (existingItem) {
    // 기존 상품 수량 증가
    const quantityElement = existingItem.querySelector('.quantity-number');
    const currentQuantity = parseInt(quantityElement.textContent);
    quantityElement.textContent = currentQuantity + 1;
  } else {
    // 새 상품 추가
    const newCartItem = createCartItemElement(product, 1);
    newCartItems.push(newCartItem);
  }

  // 재고 업데이트
  const updatedProducts = products.map(p =>
    p.id === productId ? { ...p, quantity: p.quantity - 1 } : p,
  );

  return setState({
    ...state,
    cartItems: newCartItems,
    products: updatedProducts,
  });
};

/**
 * 수량 변경 핸들러
 *
 * @param {string} productId - 상품 ID
 * @param {string} action - 'increase' | 'decrease'
 * @param {Object} state - 현재 상태
 * @param {Function} setState - 상태 업데이트 함수
 * @param {Array} products - 상품 목록
 * @returns {Object} 업데이트된 상태
 */
export const handleQuantityChange = (
  productId,
  action,
  state,
  setState,
  products,
) => {
  const cartItem = state.cartItems.find(item => item.id === productId);
  if (!cartItem) {
    return state;
  }

  const quantityElement = cartItem.querySelector('.quantity-number');
  const currentQuantity = parseInt(quantityElement.textContent);
  const product = products.find(p => p.id === productId);

  let newQuantity = currentQuantity;

  if (action === 'increase') {
    if (currentQuantity < product.quantity) {
      newQuantity = currentQuantity + 1;
    } else {
      alert('재고가 부족합니다.');
      return state;
    }
  } else if (action === 'decrease') {
    if (currentQuantity > 1) {
      newQuantity = currentQuantity - 1;
    } else {
      // 수량이 0이 되면 장바구니에서 제거
      return handleRemoveFromCart(productId, state, setState, products);
    }
  }

  quantityElement.textContent = newQuantity;

  // 재고 업데이트
  const stockChange = action === 'increase' ? -1 : 1;
  const updatedProducts = products.map(p =>
    p.id === productId ? { ...p, quantity: p.quantity + stockChange } : p,
  );

  return setState({
    ...state,
    products: updatedProducts,
  });
};

/**
 * 장바구니에서 제거 핸들러
 *
 * @param {string} productId - 상품 ID
 * @param {Object} state - 현재 상태
 * @param {Function} setState - 상태 업데이트 함수
 * @param {Array} products - 상품 목록
 * @returns {Object} 업데이트된 상태
 */
export const handleRemoveFromCart = (productId, state, setState, products) => {
  const cartItem = state.cartItems.find(item => item.id === productId);
  if (!cartItem) {
    return state;
  }

  const quantityElement = cartItem.querySelector('.quantity-number');
  const quantity = parseInt(quantityElement.textContent);

  // 장바구니에서 제거
  const newCartItems = state.cartItems.filter(item => item.id !== productId);

  // 재고 복구
  const updatedProducts = products.map(p =>
    p.id === productId ? { ...p, quantity: p.quantity + quantity } : p,
  );

  return setState({
    ...state,
    cartItems: newCartItems,
    products: updatedProducts,
  });
};

/**
 * 상품 선택 핸들러
 *
 * @param {string} productId - 상품 ID
 * @param {Object} state - 현재 상태
 * @param {Function} setState - 상태 업데이트 함수
 * @returns {Object} 업데이트된 상태
 */
export const handleProductSelect = (productId, state, setState) => {
  return setState({
    ...state,
    lastSelected: productId,
  });
};

/**
 * 장바구니 아이템 DOM 요소 생성
 *
 * @param {Object} product - 상품 정보
 * @param {number} quantity - 수량
 * @returns {HTMLElement} 장바구니 아이템 DOM 요소
 */
function createCartItemElement(product, quantity) {
  const cartItem = document.createElement('div');
  cartItem.id = product.id;
  cartItem.className =
    'flex items-center justify-between mt-4 border-b border-gray-200 pb-4';

  cartItem.innerHTML = `
    <div class="flex-1">
      <h3 class="text-sm font-medium text-gray-900">${product.name}</h3>
      <p class="text-sm text-gray-500">${product.val.toLocaleString()}원</p>
    </div>
    <div class="flex items-center space-x-2">
      <button class="quantity-btn minus" data-product-id="${product.id}">-</button>
      <span class="quantity-number w-8 text-center">${quantity}</span>
      <button class="quantity-btn plus" data-product-id="${product.id}">+</button>
      <span class="text-sm font-medium">${(product.val * quantity).toLocaleString()}원</span>
      <button class="remove-btn text-red-500 hover:text-red-700" data-product-id="${product.id}">
        Remove
      </button>
    </div>
  `;

  return cartItem;
}
