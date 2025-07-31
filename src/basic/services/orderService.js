import { OrderStore } from "../store/orderStore.js";
import { pointService } from "./pointService.js";
import { getCartItemQuantity } from "../utils/domUtils.js";

/**
 * 주문 관련 비즈니스 로직을 처리하는 서비스 클래스
 *
 * 주문 요약 계산, 포인트 계산, 주문 상태 관리 등의 기능을 제공합니다.
 * 할인 서비스를 의존성으로 주입받아 할인 계산을 위임합니다.
 */
export class OrderService {
  /**
   * OrderService 인스턴스를 생성합니다.
   *
   * @param {Object} discountService - 할인 계산을 담당하는 서비스
   */
  constructor(discountService) {
    this.orderStore = new OrderStore();
    this.discountService = discountService;
  }

  /**
   * 주문 요약을 계산하고 OrderStore에 상태를 업데이트합니다.
   *
   * 장바구니 아이템과 상품 목록을 기반으로 주문 데이터를 계산하고,
   * 할인 적용, 총액 계산, 아이템 개수 계산 등을 수행합니다.
   *
   * @param {Array} cartItems - 장바구니 아이템 배열
   * @param {Array} productList - 상품 목록 배열
   * @returns {Object} 계산된 주문 요약 데이터
   * @returns {Array} returns.cartItems - 장바구니 아이템
   * @returns {number} returns.subtotal - 할인 전 총액
   * @returns {number} returns.totalAmount - 할인 후 총액
   * @returns {number} returns.discountRate - 할인율 (0-1)
   * @returns {number} returns.savedAmount - 절약된 금액
   * @returns {number} returns.itemCount - 총 아이템 개수
   * @returns {Array} returns.itemDiscounts - 개별 할인 정보
   * @returns {boolean} returns.isTuesday - 화요일 여부

   */
  calculateOrderSummary(cartItems, productList) {
    const orderData = this.calculateOrderData(cartItems, productList);
    this.orderStore.setState(orderData);
    return orderData;
  }

  /**
   * 포인트를 계산하고 OrderStore에 포인트 상태를 업데이트합니다.
   *
   * 장바구니 아이템, 총액, 화요일 여부, 아이템 개수를 기반으로
   * 적립 포인트를 계산합니다. PointService를 통해 실제 포인트 계산을 수행합니다.
   *
   * @param {Array} cartItems - 장바구니 아이템 배열
   * @param {number} totalAmount - 주문 총액
   * @param {boolean} isTuesday - 화요일 여부
   * @param {number} itemCount - 총 아이템 개수
   * @returns {Object} 계산된 포인트 데이터
   * @returns {number} returns.totalPoints - 총 적립 포인트
   * @returns {Array} returns.details - 포인트 적립 상세 내역

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
   * 현재 주문 상태를 반환합니다.
   *
   * OrderStore에서 관리하는 모든 주문 관련 상태를 반환합니다.
   *
   * @returns {Object} 현재 주문 상태
   * @returns {Array} returns.cartItems - 장바구니 아이템
   * @returns {number} returns.subtotal - 할인 전 총액
   * @returns {number} returns.totalAmount - 할인 후 총액
   * @returns {number} returns.discountRate - 할인율
   * @returns {number} returns.savedAmount - 절약된 금액
   * @returns {number} returns.itemCount - 총 아이템 개수
   * @returns {Array} returns.itemDiscounts - 개별 할인 정보
   * @returns {boolean} returns.isTuesday - 화요일 여부
   * @returns {number} returns.totalPoints - 총 적립 포인트
   * @returns {Array} returns.pointsDetails - 포인트 적립 상세 내역
   */
  getState() {
    return this.orderStore.getState();
  }

  /**
   * 주문 데이터를 계산합니다.
   *
   * 장바구니 아이템과 상품 목록을 기반으로 주문 관련 모든 데이터를 계산합니다.
   * 할인 서비스를 통해 할인을 적용하고, 화요일 할인 여부를 확인합니다.
   *
   * @param {Array} cartItems - 장바구니 아이템 배열
   * @param {Array} productList - 상품 목록 배열
   * @returns {Object} 계산된 주문 데이터
   * @returns {Array} returns.cartItems - 장바구니 아이템
   * @returns {number} returns.subtotal - 할인 전 총액
   * @returns {number} returns.totalAmount - 할인 후 총액
   * @returns {number} returns.discountRate - 할인율 (0-1)
   * @returns {number} returns.savedAmount - 절약된 금액
   * @returns {number} returns.itemCount - 총 아이템 개수
   * @returns {Array} returns.itemDiscounts - 개별 할인 정보
   * @returns {boolean} returns.isTuesday - 화요일 여부
   *
   */
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
