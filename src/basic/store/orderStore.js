export class OrderStore {
  constructor() {
    this.state = {
      // 주문 요약 상태
      subtotal: 0,
      totalAmount: 0,
      discountRate: 0,
      savedAmount: 0,
      itemCount: 0,
      itemDiscounts: [],

      // 포인트 상태
      totalPoints: 0,
      pointsDetails: [],

      // 체크아웃 상태
      isCheckoutReady: false,

      // 화요일 특별 할인
      isTuesday: false,
      tuesdaySpecialApplied: false,
    };

    this.subscribers = [];
  }

  // 상태 업데이트
  updateOrderSummary(orderData) {
    this.state = { ...this.state, ...orderData };
  }

  // 포인트 업데이트
  updatePoints(pointsData) {
    this.state.totalPoints = pointsData.totalPoints;
    this.state.pointsDetails = pointsData.details;
  }
}
