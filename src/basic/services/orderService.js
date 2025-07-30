import { OrderStore } from "../store/orderStore.js";
import { discountService } from "./discountService.js";
import { pointService } from "./pointService.js";

export class OrderService {
  constructor() {
    this.orderStore = new OrderStore();
  }

  /**
   * 주문 요약을 계산하고 업데이트합니다.
   */
  calculateOrderSummary(cartItems, productList) {
    const orderData = this.calculateOrderData(cartItems, productList);
    this.orderStore.setState(orderData);
    return orderData;
  }

  /**
   * 포인트를 계산하고 업데이트합니다.
   */
  calculatePoints(cartItems, totalAmount, isTuesday, itemCount) {
    const pointsData = pointService.calculatePoints(cartItems, totalAmount, isTuesday, itemCount);
    this.orderStore.setState({
      totalPoints: pointsData.totalPoints,
      pointsDetails: pointsData.details,
    });
    return pointsData;
  }

  /**
   * 주문 상태를 반환합니다.
   *
   * @returns {Object} 주문 상태
   */
  getState() {
    return this.orderStore.getState();
  }

  /**
   * 주문 데이터를 계산합니다.
   */
  calculateOrderData(cartItems, productList) {
    // DiscountService를 사용하여 할인 계산
    const discountResult = discountService.applyAllDiscounts(cartItems, productList);

    const today = new Date().getDay();
    const isTuesday = today === 2;
    const itemCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

    return {
      subtotal: discountResult.originalAmount,
      totalAmount: discountResult.finalAmount,
      discountRate: discountResult.originalAmount > 0 ? (discountResult.originalAmount - discountResult.finalAmount) / discountResult.originalAmount : 0,
      savedAmount: discountResult.savedAmount,
      itemCount,
      itemDiscounts: discountResult.individualDiscounts.map(discount => ({
        name: discount.productName,
        discount: discount.rate * 100,
      })),
      isTuesday,
    };
  }
}

export const orderService = new OrderService();
