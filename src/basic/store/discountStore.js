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

  // 개별 할인 업데이트
  updateIndividualDiscounts(discounts) {
    this.state.individualDiscounts = discounts;
    this.calculateTotalDiscount();
    this.notifySubscribers();
  }

  // 대량구매 할인 업데이트
  updateBulkDiscount(rate, applied) {
    this.state.bulkDiscountRate = rate;
    this.state.bulkDiscountApplied = applied;
    this.calculateTotalDiscount();
    this.notifySubscribers();
  }

  // 화요일 할인 업데이트
  updateTuesdayDiscount(rate, applied) {
    this.state.tuesdayDiscountRate = rate;
    this.state.tuesdayDiscountApplied = applied;
    this.calculateTotalDiscount();
    this.notifySubscribers();
  }

  // 총 할인 계산
  calculateTotalDiscount() {
    const { individualDiscounts, bulkDiscountRate, tuesdayDiscountRate } = this.state;

    let totalRate = 0;
    const discountTypes = [];

    // 개별 할인
    if (individualDiscounts.length > 0) {
      totalRate += individualDiscounts.reduce((sum, discount) => sum + discount.rate, 0);
      discountTypes.push("individual");
    }

    // 대량구매 할인
    if (this.state.bulkDiscountApplied) {
      totalRate += bulkDiscountRate;
      discountTypes.push("bulk");
    }

    // 화요일 할인
    if (this.state.tuesdayDiscountApplied) {
      totalRate += tuesdayDiscountRate;
      discountTypes.push("tuesday");
    }

    this.state.totalDiscountRate = totalRate;
    this.state.discountTypes = discountTypes;
    this.state.hasAnyDiscount = totalRate > 0;
  }

  // 절약 금액 업데이트
  updateSavedAmount(savedAmount) {
    this.state.totalSavedAmount = savedAmount;
    this.notifySubscribers();
  }

  // 구독자 패턴
  subscribe(callback) {
    this.subscribers.push(callback);
    return () => this.unsubscribe(callback);
  }

  unsubscribe(callback) {
    this.subscribers = this.subscribers.filter(sub => sub !== callback);
  }

  notifySubscribers() {
    this.subscribers.forEach(callback => callback(this.state));
  }

  getState() {
    return { ...this.state };
  }

  // 할인 초기화
  resetDiscounts() {
    this.state = {
      individualDiscounts: [],
      bulkDiscountRate: 0,
      bulkDiscountApplied: false,
      tuesdayDiscountRate: 0,
      tuesdayDiscountApplied: false,
      totalDiscountRate: 0,
      totalSavedAmount: 0,
      hasAnyDiscount: false,
      discountTypes: [],
    };
    this.notifySubscribers();
  }
}

export const discountStore = new DiscountStore();
