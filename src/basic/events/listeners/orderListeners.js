import { orderService } from "../../services/orderService.js";
import { PRODUCT_LIST } from "../../data/product.js";

/**
 * Order 관련 이벤트 리스너
 * 주문 요약 관련 이벤트만 처리하는 전용 클래스
 */
export class OrderEventListeners {
  constructor(uiEventBus) {
    this.uiEventBus = uiEventBus;
    this.initOrderEventListeners();
  }

  initOrderEventListeners() {
    // 주문 요약 업데이트 이벤트
    this.uiEventBus.on("order:summary:updated", data => {
      if (data.success) {
        this.updateOrderSummaryUI(data.cartItems, data.totalAmount, data.isTuesday, data.itemCount);
      }
    });

    // 주문 계산 요청 이벤트
    this.uiEventBus.on("order:calculation:requested", data => {
      if (data.success) {
        this.calculateOrderSummary(data.cartItems, data.totalAmount, data.isTuesday, data.itemCount);
      }
    });
  }

  updateOrderSummaryUI(cartItems, totalAmount, isTuesday, itemCount) {
    orderService.calculateOrderSummary(Array.from(cartItems), PRODUCT_LIST);
    orderService.calculatePoints(Array.from(cartItems), totalAmount, isTuesday, itemCount);
  }

  calculateOrderSummary(cartItems, totalAmount, isTuesday, itemCount) {
    orderService.calculateOrderSummary(Array.from(cartItems), PRODUCT_LIST);
    orderService.calculatePoints(Array.from(cartItems), totalAmount, isTuesday, itemCount);
  }
}
