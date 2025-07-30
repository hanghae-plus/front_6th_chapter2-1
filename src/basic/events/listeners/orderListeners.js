import { orderService } from "../../services/orderService.js";
import { PRODUCT_LIST } from "../../data/product.js";
import { updateOrderSummary } from "../../components/OrderSummary.js";

// 주문 관련 이벤트 리스너
export class OrderEventListeners {
  constructor(uiEventBus) {
    this.uiEventBus = uiEventBus;
    this.initOrderEventListeners();
  }

  initOrderEventListeners() {
    // 주문 요약 업데이트 이벤트
    this.uiEventBus.on("order:summary:updated", data => {
      if (data.success) {
        this.handleOrderSummaryUpdate(data.cartItems, data.totalAmount, data.isTuesday, data.itemCount);
      }
    });

    // 주문 계산 요청 이벤트
    this.uiEventBus.on("order:calculation:requested", data => {
      if (data.success) {
        this.handleOrderCalculation(data.cartItems, data.totalAmount, data.isTuesday, data.itemCount);
      }
    });
  }

  // 공통 계산 로직
  calculateOrderAndPoints(cartItems, totalAmount, isTuesday, itemCount) {
    // 주문 요약 계산
    const orderSummary = orderService.calculateOrderSummary(Array.from(cartItems), PRODUCT_LIST);

    // 포인트 계산
    const pointsResult = orderService.calculatePoints(Array.from(cartItems), totalAmount, isTuesday, itemCount);

    return { orderSummary, pointsResult };
  }

  handleOrderSummaryUpdate(cartItems, totalAmount, isTuesday, itemCount) {
    const { orderSummary, pointsResult } = this.calculateOrderAndPoints(cartItems, totalAmount, isTuesday, itemCount);

    // 계산 결과를 이벤트로 emit
    this.uiEventBus.emit("order:summary:calculated", {
      orderSummary,
      pointsResult,
      success: true,
    });

    // UI 업데이트 이벤트 emit
    this.uiEventBus.emit("order:ui:updated", {
      orderSummary,
      pointsResult,
      success: true,
    });

    // UI 업데이트 직접 처리
    this.updateOrderSummaryUI(orderSummary, pointsResult);
  }

  handleOrderCalculation(cartItems, totalAmount, isTuesday, itemCount) {
    const { orderSummary, pointsResult } = this.calculateOrderAndPoints(cartItems, totalAmount, isTuesday, itemCount);

    // UI 업데이트 직접 처리
    this.updateOrderSummaryUI(orderSummary, pointsResult);
  }

  updateOrderSummaryUI(orderSummary, pointsResult) {
    const orderState = {
      ...orderSummary,
      totalPoints: pointsResult.totalPoints,
      pointsDetails: pointsResult.details,
    };

    updateOrderSummary(orderState);
  }
}
