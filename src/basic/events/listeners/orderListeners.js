import { PRODUCT_LIST } from "../../data/product.js";
import { updateOrderSummary } from "../../components/OrderSummary.js";
import { ORDER_SUMMARY_UPDATED, ORDER_CALCULATION_REQUESTED, ORDER_SUMMARY_CALCULATED, ORDER_UI_UPDATED } from "../../constants/events.js";

// 주문 관련 이벤트 리스너
export class OrderEventListeners {
  constructor(uiEventBus, orderService) {
    this.uiEventBus = uiEventBus;
    this.orderService = orderService;
    this.initOrderEventListeners();
  }

  // 주문 이벤트 리스너를 초기화합니다.
  initOrderEventListeners() {
    // 주문 요약 업데이트 이벤트
    this.uiEventBus.on(ORDER_SUMMARY_UPDATED, data => {
      if (data.success) {
        this.handleOrderSummaryUpdate(data.cartItems, data.totalAmount, data.isTuesday, data.itemCount);
      }
    });

    // 주문 계산 요청 이벤트
    this.uiEventBus.on(ORDER_CALCULATION_REQUESTED, data => {
      if (data.success) {
        this.handleOrderCalculation(data.cartItems, data.totalAmount, data.isTuesday, data.itemCount);
      }
    });
  }

  // 주문 요약 업데이트를 처리합니다.
  handleOrderSummaryUpdate(cartItems, totalAmount, isTuesday, itemCount) {
    const orderSummary = this.orderService.calculateOrderSummary(Array.from(cartItems), PRODUCT_LIST);
    const pointsResult = this.orderService.calculatePoints(Array.from(cartItems), totalAmount, isTuesday, itemCount);

    // 계산 결과를 이벤트로 emit
    this.uiEventBus.emit(ORDER_SUMMARY_CALCULATED, {
      orderSummary,
      pointsResult,
      success: true,
    });

    // UI 업데이트 이벤트 emit
    this.uiEventBus.emit(ORDER_UI_UPDATED, {
      orderSummary,
      pointsResult,
      success: true,
    });

    // UI 업데이트 직접 처리
    this.renderOrderSummary(orderSummary, pointsResult);
  }

  // 주문 계산을 처리합니다.
  handleOrderCalculation(cartItems, totalAmount, isTuesday, itemCount) {
    const orderSummary = this.orderService.calculateOrderSummary(Array.from(cartItems), PRODUCT_LIST);
    const pointsResult = this.orderService.calculatePoints(Array.from(cartItems), totalAmount, isTuesday, itemCount);

    // UI 업데이트 직접 처리
    this.renderOrderSummary(orderSummary, pointsResult);
  }

  // 주문 요약을 렌더링합니다.
  renderOrderSummary(orderSummary, pointsResult) {
    const orderState = {
      ...orderSummary,
      cartItems: orderSummary.cartItems || [],
      totalPoints: pointsResult.totalPoints,
      pointsDetails: pointsResult.details,
    };

    updateOrderSummary(orderState);
  }
}
