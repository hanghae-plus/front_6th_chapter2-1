import { OrderStore } from "../store/orderStore.js";
import { getCartItemQuantity } from "../utils/domUtils.js";

// 주문 관련 비즈니스 로직을 처리하는 서비스 클래스
export class OrderService {
  // OrderService 인스턴스를 생성합니다.
  constructor(discountService, pointService) {
    this.orderStore = new OrderStore();
    this.discountService = discountService;
    this.pointService = pointService;
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
    // 주입받은 discountService를 사용하여 할인 계산
    const discountResult = this.discountService.applyAllDiscounts(cartItems, productList);

    const today = new Date().getDay();
    const isTuesday = today === 2;
    const itemCount = cartItems.reduce((sum, cartItemElement) => sum + getCartItemQuantity(cartItemElement), 0);

    return {
      cartItems,
      subtotal: discountResult.originalAmount,
      totalAmount: discountResult.finalAmount,
      discountRate: discountResult.originalAmount > 0 ? (discountResult.originalAmount - discountResult.finalAmount) / discountResult.originalAmount : 0,
      savedAmount: discountResult.savedAmount,
      itemCount,
      itemDiscounts: discountResult.individualDiscounts.map(discount => ({
        name: discount.name,
        discount: discount.discount,
      })),
      isTuesday,
    };
  }
}
