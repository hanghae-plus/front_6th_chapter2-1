const discountState = {
  appliedDiscounts: [], // 적용된 할인들
  totalDiscountRate: 0, // 총 할인율
  savedAmount: 0, // 절약된 금액
};

/**
 * 할인 상태 업데이트 함수들
 */
const discountStateUpdaters = {
  /**
   * 할인 정보 업데이트
   */
  updateDiscounts(discounts) {
    discountState.appliedDiscounts = discounts.appliedDiscounts || discountState.appliedDiscounts;
    discountState.totalDiscountRate =
      discounts.totalDiscountRate || discountState.totalDiscountRate;
    discountState.savedAmount = discounts.savedAmount || discountState.savedAmount;
  },

  /**
   * 적용된 할인들 업데이트
   */
  updateAppliedDiscounts(discounts) {
    discountState.appliedDiscounts = discounts;
  },

  /**
   * 총 할인율 업데이트
   */
  updateTotalDiscountRate(rate) {
    discountState.totalDiscountRate = rate;
  },

  /**
   * 절약된 금액 업데이트
   */
  updateSavedAmount(amount) {
    discountState.savedAmount = amount;
  },

  /**
   * 할인 상태 초기화
   */
  reset() {
    discountState.appliedDiscounts = [];
    discountState.totalDiscountRate = 0;
    discountState.savedAmount = 0;
  },
};

/**
 * 할인 상태 구독자들
 */
const discountStateSubscribers = [];

/**
 * 할인 상태 변경을 구독하는 함수 등록
 */
function subscribeToDiscountState(callback) {
  discountStateSubscribers.push(callback);
}

/**
 * 할인 상태 변경 시 모든 구독자들에게 알림
 */
function notifyDiscountStateChange() {
  discountStateSubscribers.forEach((callback) => callback(discountState));
}

/**
 * 할인 상태 업데이트 래퍼 함수
 */
function updateDiscountState(updater, ...args) {
  updater(...args);
  notifyDiscountStateChange();
}

// 할인 상태 업데이트 함수들을 래핑
const discountActions = {
  updateDiscounts: (discounts) =>
    updateDiscountState(discountStateUpdaters.updateDiscounts, discounts),
  updateAppliedDiscounts: (discounts) =>
    updateDiscountState(discountStateUpdaters.updateAppliedDiscounts, discounts),
  updateTotalDiscountRate: (rate) =>
    updateDiscountState(discountStateUpdaters.updateTotalDiscountRate, rate),
  updateSavedAmount: (amount) =>
    updateDiscountState(discountStateUpdaters.updateSavedAmount, amount),
  reset: () => updateDiscountState(discountStateUpdaters.reset),
};

// 외부에서 사용할 수 있도록 export
export { discountState, discountActions, subscribeToDiscountState };
