const cartState = {
  total: 0, // 총 금액
  itemCount: 0, // 총 아이템 수
  items: [], // 장바구니 아이템들
};

/**
 * 장바구니 상태 업데이트 함수들
 */
const cartStateUpdaters = {
  /**
   * 장바구니 총액 업데이트
   */
  updateTotal(newTotal) {
    cartState.total = newTotal;
  },

  /**
   * 장바구니 아이템 수 업데이트
   */
  updateItemCount(newCount) {
    cartState.itemCount = newCount;
  },

  /**
   * 장바구니 아이템들 업데이트
   */
  updateItems(newItems) {
    cartState.items = newItems;
  },

  /**
   * 장바구니 상태 초기화
   */
  reset() {
    cartState.total = 0;
    cartState.itemCount = 0;
    cartState.items = [];
  },
};

/**
 * 장바구니 상태 구독자들
 */
const cartStateSubscribers = [];

/**
 * 장바구니 상태 변경을 구독하는 함수 등록
 */
function subscribeToCartState(callback) {
  cartStateSubscribers.push(callback);
}

/**
 * 장바구니 상태 변경 시 모든 구독자들에게 알림
 */
function notifyCartStateChange() {
  cartStateSubscribers.forEach((callback) => callback(cartState));
}

/**
 * 장바구니 상태 업데이트 래퍼 함수
 */
function updateCartState(updater, ...args) {
  updater(...args);
  notifyCartStateChange();
}

// 장바구니 상태 업데이트 함수들을 래핑
const cartActions = {
  updateTotal: (newTotal) => updateCartState(cartStateUpdaters.updateTotal, newTotal),
  updateItemCount: (newCount) => updateCartState(cartStateUpdaters.updateItemCount, newCount),
  updateItems: (newItems) => updateCartState(cartStateUpdaters.updateItems, newItems),
  reset: () => updateCartState(cartStateUpdaters.reset),
};

// 외부에서 사용할 수 있도록 export
export { cartState, cartActions, subscribeToCartState };
