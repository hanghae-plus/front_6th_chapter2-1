import { cartState, cartActions, subscribeToCartState } from './cartState.js';
import { discountState, discountActions, subscribeToDiscountState } from './discountState.js';
import { pointsState, pointsActions, subscribeToPointsState } from './pointsState.js';
import { productState, productActions, subscribeToProductState } from './productState.js';
import { uiState, uiActions, subscribeToUiState } from './uiState.js';

const state = {
  cart: cartState,
  selectedProduct: productState.selectedProduct,
  ui: uiState,
  discounts: discountState,
  points: pointsState,
};

const stateActions = {
  // 장바구니 관련 액션
  updateCartTotal: cartActions.updateTotal,
  updateCartItemCount: cartActions.updateItemCount,
  updateCartItems: cartActions.updateItems,
  resetCart: cartActions.reset,

  // 상품 선택 관련 액션
  updateSelectedProduct: productActions.updateSelectedProduct,
  clearSelectedProduct: productActions.clearSelectedProduct,
  resetProduct: productActions.reset,

  // UI 관련 액션
  toggleManualOverlay: uiActions.toggleManualOverlay,
  openManualOverlay: uiActions.openManualOverlay,
  closeManualOverlay: uiActions.closeManualOverlay,
  resetUI: uiActions.reset,

  // 할인 관련 액션
  updateDiscounts: discountActions.updateDiscounts,
  updateAppliedDiscounts: discountActions.updateAppliedDiscounts,
  updateTotalDiscountRate: discountActions.updateTotalDiscountRate,
  updateSavedAmount: discountActions.updateSavedAmount,
  resetDiscounts: discountActions.reset,

  // 포인트 관련 액션
  updatePoints: pointsActions.updatePoints,
  updateBasePoints: pointsActions.updateBasePoints,
  updateBonusPoints: pointsActions.updateBonusPoints,
  updateTotalPoints: pointsActions.updateTotalPoints,
  updatePointsDetail: pointsActions.updatePointsDetail,
  resetPoints: pointsActions.reset,

  /**
   * 전체 상태 초기화
   */
  resetAll() {
    cartActions.reset();
    productActions.reset();
    uiActions.reset();
    discountActions.reset();
    pointsActions.reset();
  },
};

/**
 * 통합 상태 구독 함수
 */
function subscribeToState(callback) {
  // 모든 상태 변경을 구독
  subscribeToCartState(callback);
  subscribeToUiState(callback);
  subscribeToProductState(callback);
  subscribeToDiscountState(callback);
  subscribeToPointsState(callback);
}

// 외부에서 사용할 수 있도록 export
export { state, stateActions, subscribeToState };
