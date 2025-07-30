// ==========================================
// 상태 관리 시스템 (순수 함수)
// ==========================================

import { validateProduct } from '../utils/pureFunctions.js';

/**
 * 앱 상태 초기화
 *
 * @returns {Object} 초기 상태
 */
export function createInitialState() {
  return {
    products: [
      { id: 'p1', name: '버그 없애는 키보드', val: 30000, quantity: 10 },
      { id: 'p2', name: '생산성 폭발 마우스', val: 30000, quantity: 10 },
      { id: 'p3', name: '거북목 탈출 모니터암', val: 30000, quantity: 10 },
      { id: 'p4', name: '에러 방지 노트북 파우치', val: 30000, quantity: 10 },
      {
        id: 'p5',
        name: '코딩할 때 듣는 Lo-Fi 스피커',
        val: 30000,
        quantity: 10,
      },
    ],
    cartItems: [],
    lastSelected: null,
  };
}

/**
 * 장바구니에 상품 추가 (순수 함수)
 *
 * @param {Object} state - 현재 상태
 * @param {string} productId - 상품 ID
 * @returns {Object} 새로운 상태
 */
export function addToCart(state, productId) {
  const product = state.products.find(p => p.id === productId);
  const validation = validateProduct(product, 1);

  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  // 기존 아이템 확인
  const existingItemIndex = state.cartItems.findIndex(
    item => item.id === productId,
  );

  if (existingItemIndex >= 0) {
    // 기존 상품 수량 증가
    const updatedCartItems = [...state.cartItems];
    updatedCartItems[existingItemIndex] = {
      ...updatedCartItems[existingItemIndex],
      quantity: updatedCartItems[existingItemIndex].quantity + 1,
    };

    return {
      ...state,
      cartItems: updatedCartItems,
      products: updateProductQuantity(state.products, productId, -1),
    };
  } else {
    // 새 상품 추가
    return {
      ...state,
      cartItems: [...state.cartItems, { id: productId, quantity: 1 }],
      products: updateProductQuantity(state.products, productId, -1),
    };
  }
}

/**
 * 장바구니 수량 변경 (순수 함수)
 *
 * @param {Object} state - 현재 상태
 * @param {string} productId - 상품 ID
 * @param {string} action - 'increase' | 'decrease'
 * @returns {Object} 새로운 상태
 */
export function changeQuantity(state, productId, action) {
  const itemIndex = state.cartItems.findIndex(item => item.id === productId);
  if (itemIndex === -1) {
    return state;
  }

  const item = state.cartItems[itemIndex];
  const product = state.products.find(p => p.id === productId);

  let newQuantity = item.quantity;
  let stockChange = 0;

  if (action === 'increase') {
    if (item.quantity < product.quantity) {
      newQuantity = item.quantity + 1;
      stockChange = -1;
    } else {
      throw new Error('재고가 부족합니다.');
    }
  } else if (action === 'decrease') {
    if (item.quantity > 1) {
      newQuantity = item.quantity - 1;
      stockChange = 1;
    } else {
      // 수량이 0이 되면 장바구니에서 제거
      return removeFromCart(state, productId);
    }
  }

  const updatedCartItems = [...state.cartItems];
  updatedCartItems[itemIndex] = {
    ...updatedCartItems[itemIndex],
    quantity: newQuantity,
  };

  return {
    ...state,
    cartItems: updatedCartItems,
    products: updateProductQuantity(state.products, productId, stockChange),
  };
}

/**
 * 장바구니에서 상품 제거 (순수 함수)
 *
 * @param {Object} state - 현재 상태
 * @param {string} productId - 상품 ID
 * @returns {Object} 새로운 상태
 */
export function removeFromCart(state, productId) {
  const itemIndex = state.cartItems.findIndex(item => item.id === productId);
  if (itemIndex === -1) {
    return state;
  }

  const item = state.cartItems[itemIndex];
  const updatedCartItems = state.cartItems.filter(
    item => item.id !== productId,
  );

  return {
    ...state,
    cartItems: updatedCartItems,
    products: updateProductQuantity(state.products, productId, item.quantity),
  };
}

/**
 * 상품 선택 (순수 함수)
 *
 * @param {Object} state - 현재 상태
 * @param {string} productId - 상품 ID
 * @returns {Object} 새로운 상태
 */
export function selectProduct(state, productId) {
  return {
    ...state,
    lastSelected: productId,
  };
}

/**
 * 상품 재고 업데이트 (순수 함수)
 *
 * @param {Array} products - 상품 목록
 * @param {string} productId - 상품 ID
 * @param {number} change - 재고 변경량 (음수: 감소, 양수: 증가)
 * @returns {Array} 업데이트된 상품 목록
 */
function updateProductQuantity(products, productId, change) {
  return products.map(product =>
    product.id === productId
      ? { ...product, quantity: Math.max(0, product.quantity + change) }
      : product,
  );
}

/**
 * 상태 검증 (순수 함수)
 *
 * @param {Object} state - 검증할 상태
 * @returns {Object} 검증 결과
 */
export function validateState(state) {
  const errors = [];

  // 장바구니 아이템 검증
  state.cartItems.forEach(item => {
    const product = state.products.find(p => p.id === item.id);
    if (!product) {
      errors.push(`상품 ID ${item.id}를 찾을 수 없습니다.`);
    } else if (item.quantity <= 0) {
      errors.push(`${product.name}의 수량이 0 이하입니다.`);
    }
  });

  // 재고 검증
  state.products.forEach(product => {
    if (product.quantity < 0) {
      errors.push(`${product.name}의 재고가 음수입니다.`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}
