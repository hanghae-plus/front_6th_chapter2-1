import { orderStore } from "../store/orderStore.js";
import { POINTS, POINTS_QUANTITY_THRESHOLDS, QUANTITY_BONUS_POINTS } from "../constants/index.js";
import { discountService } from "./discountService.js";

export class OrderService {
  constructor() {
    this.orderStore = orderStore;
  }

  /**
   * 주문 요약을 계산하고 업데이트합니다.
   */
  calculateOrderSummary(cartItems, productList) {
    const orderData = this.calculateOrderData(cartItems, productList);
    this.orderStore.updateOrderSummary(orderData);
    return orderData;
  }

  /**
   * 포인트를 계산하고 업데이트합니다.
   */
  calculatePoints(cartItems, totalAmount, isTuesday, itemCount) {
    const pointsData = this.calculateLoyaltyPoints(cartItems, totalAmount, isTuesday, itemCount);
    this.orderStore.updatePoints(pointsData);
    return pointsData;
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

  /**
   * 포인트를 계산합니다.
   */
  calculateLoyaltyPoints(cartItems, totalAmount, isTuesday, itemCount) {
    if (cartItems.length === 0) {
      return { totalPoints: 0, details: [] };
    }

    const basePoints = Math.floor(totalAmount / POINTS.BASE_RATE);
    let finalPoints = 0;
    const pointsDetail = [];

    if (basePoints > 0) {
      finalPoints = basePoints;
      pointsDetail.push(`기본: ${basePoints}p`);
    }

    // 화요일 2배
    if (isTuesday && basePoints > 0) {
      finalPoints = basePoints * POINTS.TUESDAY_MULTIPLIER;
      pointsDetail.push("화요일 2배");
    }

    // 세트 구매 보너스
    const hasKeyboard = cartItems.some(item => item.id === "p1");
    const hasMouse = cartItems.some(item => item.id === "p2");
    const hasMonitorArm = cartItems.some(item => item.id === "p3");

    if (hasKeyboard && hasMouse) {
      finalPoints += POINTS.KEYBOARD_MOUSE_SET;
      pointsDetail.push("키보드+마우스 세트 +50p");
    }

    if (hasKeyboard && hasMouse && hasMonitorArm) {
      finalPoints += POINTS.FULL_SET;
      pointsDetail.push("풀세트 구매 +100p");
    }

    // 수량 보너스
    if (itemCount >= POINTS_QUANTITY_THRESHOLDS.LARGE_BULK) {
      finalPoints += QUANTITY_BONUS_POINTS.LARGE_BULK;
      pointsDetail.push("대량구매(30개+) +100p");
    } else if (itemCount >= POINTS_QUANTITY_THRESHOLDS.MEDIUM_BULK) {
      finalPoints += QUANTITY_BONUS_POINTS.MEDIUM_BULK;
      pointsDetail.push("대량구매(20개+) +50p");
    } else if (itemCount >= POINTS_QUANTITY_THRESHOLDS.SMALL_BULK) {
      finalPoints += QUANTITY_BONUS_POINTS.SMALL_BULK;
      pointsDetail.push("대량구매(10개+) +20p");
    }

    return { totalPoints: finalPoints, details: pointsDetail };
  }

  /**
   * 체크아웃을 처리합니다.
   */
  processCheckout() {
    const state = this.orderStore.getState();
    if (state.totalAmount > 0) {
      // 체크아웃 로직
      this.orderStore.updateOrderSummary({ isCheckoutReady: true });
      return { success: true, orderData: state };
    }
    return { success: false, message: "장바구니가 비어있습니다." };
  }

  /**
   * 주문 상태를 구독합니다.
   */
  subscribeToChanges(callback) {
    return this.orderStore.subscribe(callback);
  }

  /**
   * 현재 주문 상태를 반환합니다.
   */
  getOrderState() {
    return this.orderStore.getState();
  }
}

export const orderService = new OrderService();
