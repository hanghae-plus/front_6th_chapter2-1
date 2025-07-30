export class DiscountStore {
  constructor() {
    this.state = {
      // 개별 상품 할인
      individualDiscounts: [],

      // 대량구매 할인
      bulkDiscountRate: 0,
      bulkDiscountApplied: false,

      // 화요일 특별 할인
      tuesdayDiscountRate: 0,
      tuesdayDiscountApplied: false,

      // 총 할인 정보
      totalDiscountRate: 0,
      totalSavedAmount: 0,

      // 할인 상태
      hasAnyDiscount: false,
      discountTypes: [],
    };

    this.subscribers = [];
  }

  // 불변성을 유지하는 상태 업데이트
  setState(newState) {
    this.state = { ...this.state, ...newState };
  }

  // 상태 조회
  getState() {
    return this.state;
  }
}
