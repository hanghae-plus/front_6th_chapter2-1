import { OrderStore } from "../store/orderStore.js";
import { getCartItemQuantity } from "../utils/domUtils.js";

// 주문 계산 헬퍼
const OrderCalculationHelper = {
  // 할인율 계산
  calculateDiscountRate(originalAmount, finalAmount) {
    return originalAmount > 0 ? (originalAmount - finalAmount) / originalAmount : 0;
  },

  // 아이템 수량 계산
  calculateItemCount(cartItems) {
    return cartItems.reduce((sum, cartItemElement) => sum + getCartItemQuantity(cartItemElement), 0);
  },

  // 화요일 여부 확인
  isTuesday() {
    const today = new Date().getDay();
    return today === 2;
  },

  // 할인 정보 포맷팅
  formatItemDiscounts(individualDiscounts) {
    return individualDiscounts.map(discount => ({
      name: discount.name,
      discount: discount.discount,
    }));
  },
};

// 주문 관련 비즈니스 로직을 처리하는 서비스 클래스
export class OrderService {
  // OrderService 인스턴스를 생성합니다.
  constructor(discountService, pointService) {
    this.orderStore = new OrderStore();
    this.discountService = discountService;
    this.pointService = pointService;
  }

  // 헬퍼 객체에 대한 접근자
  getCalculationHelper() {
    return OrderCalculationHelper;
  }

  // 주문 요약을 계산하고 OrderStore에 상태를 업데이트합니다.
  calculateOrderSummary(cartItems, productList) {
    const orderData = this.calculateOrderData(cartItems, productList);
    this.orderStore.setState(orderData);
    return orderData;
  }

  // 포인트를 계산하고 OrderStore에 포인트 상태를 업데이트합니다.
  calculatePoints(cartItems, totalAmount, isTuesday, itemCount) {
    const pointsData = this.pointService.calculatePoints(cartItems, totalAmount, isTuesday, itemCount);
    this.orderStore.setState({
      totalPoints: pointsData.totalPoints,
      pointsDetails: pointsData.details,
    });
    return pointsData;
  }

  // 현재 주문 상태를 반환합니다.
  getState() {
    return this.orderStore.getState();
  }

  // 주문 데이터를 계산합니다.
  calculateOrderData(cartItems, productList) {
    const calcHelper = this.getCalculationHelper();

    // 주입받은 discountService를 사용하여 할인 계산
    const discountResult = this.discountService.applyAllDiscounts(cartItems, productList);

    const isTuesday = calcHelper.isTuesday();
    const itemCount = calcHelper.calculateItemCount(cartItems);

    return {
      cartItems,
      subtotal: discountResult.originalAmount,
      totalAmount: discountResult.finalAmount,
      discountRate: calcHelper.calculateDiscountRate(discountResult.originalAmount, discountResult.finalAmount),
      savedAmount: discountResult.savedAmount,
      itemCount,
      itemDiscounts: calcHelper.formatItemDiscounts(discountResult.individualDiscounts),
      isTuesday,
    };
  }
}
