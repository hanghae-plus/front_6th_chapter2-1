// ==========================================
// 앱 상태 관리 Custom Hook
// ==========================================

import { initializeProductState } from '../state/ProductState.js';
import { UI_CONSTANTS } from '../constant/index.js';

/**
 * 앱 상태 관리 Custom Hook
 *
 * @description 리액트의 useState 패턴을 모방한 상태 관리 훅
 * @returns {Object} 앱 상태와 상태 업데이트 함수들
 */
export function useAppState() {
  // 초기 상태
  const initialState = {
    products: initializeProductState(),
    cart: {
      totalAmount: UI_CONSTANTS.INITIAL_CART_AMOUNT,
      itemCount: UI_CONSTANTS.INITIAL_CART_COUNT,
      bonusPoints: UI_CONSTANTS.INITIAL_BONUS_POINTS,
    },
    lastSelected: null,
  };

  // 상태 업데이트 함수들 (setState 패턴)
  const setProducts = newProducts => {
    // 실제로는 상태를 업데이트하는 로직
    return { ...initialState, products: newProducts };
  };

  const setCart = newCart => {
    return { ...initialState, cart: newCart };
  };

  const setLastSelected = newLastSelected => {
    return { ...initialState, lastSelected: newLastSelected };
  };

  return {
    state: initialState,
    setProducts,
    setCart,
    setLastSelected,
  };
}

/**
 * 장바구니 상태 관리 Custom Hook
 *
 * @description 장바구니 관련 상태만 관리
 * @returns {Object} 장바구니 상태와 업데이트 함수들
 */
export function useCartState() {
  const cartState = {
    totalAmount: UI_CONSTANTS.INITIAL_CART_AMOUNT,
    itemCount: UI_CONSTANTS.INITIAL_CART_COUNT,
    bonusPoints: UI_CONSTANTS.INITIAL_BONUS_POINTS,
  };

  const setCartState = newCartState => {
    return { ...cartState, ...newCartState };
  };

  return {
    cartState,
    setCartState,
  };
}

/**
 * 상품 상태 관리 Custom Hook
 *
 * @description 상품 관련 상태만 관리
 * @returns {Object} 상품 상태와 업데이트 함수들
 */
export function useProductState() {
  const productState = {
    products: initializeProductState(),
    lastSelected: null,
  };

  const setProductState = newProductState => {
    return { ...productState, ...newProductState };
  };

  return {
    productState,
    setProductState,
  };
}
