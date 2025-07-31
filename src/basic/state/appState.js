import { AppState } from '../types/state.js';
import { createState } from '../utils/stateManager.js';

// 앱 전체 상태 관리
const [getAppState, setAppState, subscribeApp] = createState(AppState);

/** 상품 목록 조회 */
export function getProductList() {
  return getAppState().product.list;
}

/** 상품 목록 설정 */
export function setProductList(productList) {
  setAppState((prev) => ({
    ...prev,
    product: { ...prev.product, list: productList },
  }));
}

/** 카트 상태 조회 */
export function getCartState() {
  return getAppState().cart;
}

/** 카트 상태 설정 */
export function setCartState(newCartState) {
  setAppState((prev) => ({
    ...prev,
    cart: { ...prev.cart, ...newCartState },
  }));
}

/** 카트 아이템 수량 업데이트 */
export function updateCartItemCount(newCount) {
  setCartState((prev) => ({ ...prev, totalItemCount: newCount }));
}

/** 카트 아이템 목록 업데이트 */
export function updateCartItems(newItems) {
  setCartState((prev) => ({ ...prev, items: newItems }));
}

/** 카트 총액 업데이트 */
export function updateCartTotal(newTotal) {
  setCartState((prev) => ({ ...prev, totalAmount: newTotal }));
}

/** 카트 할인 업데이트 */
export function updateCartDiscount(newDiscount) {
  setCartState((prev) => ({ ...prev, discountAmount: newDiscount }));
}

export { subscribeApp };
