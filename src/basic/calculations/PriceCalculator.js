/**
 * 가격 및 할인 계산 엔진
 * 순수 함수로 구현된 가격 계산 로직을 제공합니다.
 */

import {
  calculateFinalDiscount,
  calculateBulkDiscount as getBulkDiscountRate,
  calculateTuesdayDiscount as getTuesdayDiscountRate,
} from '../constants/DiscountPolicies.js';

/**
 * @typedef {Object} CartItem
 * @property {string} id - 상품 ID
 * @property {number} quantity - 수량
 * @property {number} price - 단가
 * @property {Object} [product] - 상품 정보 객체
 */

/**
 * @typedef {Object} SubtotalResult
 * @property {number} subtotal - 총 소계
 * @property {Array<{id: string, total: number}>} itemTotals - 개별 상품별 합계
 */

/**
 * @typedef {Object} DiscountResult
 * @property {number} discountRate - 할인율 (0.1 = 10%)
 * @property {number} discountAmount - 할인 금액
 */

/**
 * @typedef {Object} TuesdayDiscountResult
 * @property {number} discountRate - 할인율
 * @property {number} discountAmount - 할인 금액
 * @property {boolean} isTuesday - 화요일 여부
 */

/**
 * @typedef {Object} FinalPriceResult
 * @property {number} subtotal - 소계
 * @property {Array<Object>} individualDiscounts - 개별 할인 목록
 * @property {Object} bulkDiscount - 대량구매 할인 정보
 * @property {Object} tuesdayDiscount - 화요일 할인 정보
 * @property {number} finalAmount - 최종 금액
 * @property {number} totalSavings - 총 절약 금액
 */

/**
 * 가격 및 할인 계산을 위한 순수 함수 클래스
 */
export class PriceCalculator {
  /**
   * 장바구니 아이템들의 소계를 계산합니다
   * @param {Array<CartItem>} cartItems - 장바구니 아이템 배열
   * @returns {SubtotalResult} 소계 계산 결과
   */
  static calculateSubtotal(cartItems) {
    if (!cartItems || !Array.isArray(cartItems)) {
      return { subtotal: 0, itemTotals: [] };
    }

    let subtotal = 0;
    const itemTotals = [];

    for (const item of cartItems) {
      if (!item || typeof item.quantity !== 'number' || typeof item.price !== 'number') {
        continue;
      }

      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      itemTotals.push({
        id: item.id,
        total: itemTotal,
      });
    }

    return {
      subtotal,
      itemTotals,
    };
  }

  /**
   * 개별 상품의 할인을 계산합니다
   * @param {Object} item - 상품 정보
   * @param {number} quantity - 수량
   * @returns {DiscountResult} 할인 계산 결과
   */
  static calculateItemDiscount(item, quantity) {
    if (!item || typeof quantity !== 'number' || quantity < 10) {
      return { discountRate: 0, discountAmount: 0 };
    }

    // DiscountPolicies.js의 calculateFinalDiscount 활용
    const discountInfo = calculateFinalDiscount({
      productId: item.id,
      quantity: quantity,
      totalQuantity: 0, // 개별 할인 단계에서는 총 수량 무시
      date: new Date(),
    });

    const itemTotal = item.price * quantity;
    const discountAmount = itemTotal * discountInfo.baseDiscount;

    return {
      discountRate: discountInfo.baseDiscount,
      discountAmount: discountAmount,
    };
  }

  /**
   * 대량구매 할인을 계산합니다
   * @param {number} totalQuantity - 전체 수량
   * @param {number} subtotal - 소계
   * @returns {DiscountResult} 대량구매 할인 결과
   */
  static calculateBulkDiscount(totalQuantity, subtotal) {
    if (typeof totalQuantity !== 'number' || typeof subtotal !== 'number' || subtotal <= 0) {
      return { discountRate: 0, discountAmount: 0 };
    }

    // DiscountPolicies.js의 calculateBulkDiscount 활용
    const discountRate = getBulkDiscountRate(totalQuantity);
    const discountAmount = subtotal * discountRate;

    return {
      discountRate,
      discountAmount,
    };
  }

  /**
   * 화요일 할인을 계산합니다
   * @param {number} subtotal - 소계
   * @param {Date} [date] - 확인할 날짜 (기본값: 현재 날짜)
   * @returns {TuesdayDiscountResult} 화요일 할인 결과
   */
  static calculateTuesdayDiscount(subtotal, date = new Date()) {
    if (typeof subtotal !== 'number' || subtotal <= 0) {
      return { discountRate: 0, discountAmount: 0, isTuesday: false };
    }

    // DiscountPolicies.js의 calculateTuesdayDiscount 활용
    const discountRate = getTuesdayDiscountRate(date);
    const discountAmount = subtotal * discountRate;
    const isTuesday = date.getDay() === 2;

    return {
      discountRate,
      discountAmount,
      isTuesday,
    };
  }

  /**
   * 모든 할인을 적용한 최종 가격을 계산합니다
   * @param {Array<CartItem>} cartItems - 장바구니 아이템 배열
   * @param {Date} [date] - 확인할 날짜 (기본값: 현재 날짜)
   * @returns {FinalPriceResult} 최종 가격 계산 결과
   */
  static calculateFinalPrice(cartItems, date = new Date()) {
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return {
        subtotal: 0,
        individualDiscounts: [],
        bulkDiscount: { discountRate: 0, discountAmount: 0 },
        tuesdayDiscount: { discountRate: 0, discountAmount: 0, isTuesday: false },
        finalAmount: 0,
        totalSavings: 0,
      };
    }

    // 1. 소계 계산
    const { subtotal, itemTotals } = this.calculateSubtotal(cartItems);

    // 2. 전체 수량 계산
    const totalQuantity = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

    // 3. 개별 할인 계산 (할인 우선순위: 개별 → 대량 → 화요일)
    const individualDiscounts = [];
    let subtotalAfterIndividualDiscounts = subtotal;

    for (const item of cartItems) {
      if (item.quantity >= 10) {
        const itemDiscount = this.calculateItemDiscount(item, item.quantity);
        if (itemDiscount.discountRate > 0) {
          individualDiscounts.push({
            productId: item.id,
            productName: item.product?.name || item.id,
            quantity: item.quantity,
            originalAmount: item.price * item.quantity,
            discountRate: itemDiscount.discountRate,
            discountAmount: itemDiscount.discountAmount,
          });

          subtotalAfterIndividualDiscounts -= itemDiscount.discountAmount;
        }
      }
    }

    // 4. 대량구매 할인 계산 (개별 할인이 적용되지 않은 경우에만)
    let bulkDiscount = { discountRate: 0, discountAmount: 0 };
    let currentAmount = subtotalAfterIndividualDiscounts;

    // 대량구매 할인은 개별 할인보다 우선 적용 (기존 로직에 따라)
    const bulkDiscountRate = getBulkDiscountRate(totalQuantity);
    if (bulkDiscountRate > 0) {
      // 대량구매 할인이 있으면 개별 할인 무시하고 소계에서 대량할인 적용
      bulkDiscount = this.calculateBulkDiscount(totalQuantity, subtotal);
      currentAmount = subtotal - bulkDiscount.discountAmount;
      // 개별 할인 초기화 (대량구매 할인이 우선)
      individualDiscounts.length = 0;
    }

    // 5. 화요일 할인 계산 (다른 할인 후에 적용)
    const tuesdayDiscount = this.calculateTuesdayDiscount(currentAmount, date);
    const finalAmount = currentAmount - tuesdayDiscount.discountAmount;

    // 6. 총 절약 금액 계산
    const totalSavings = subtotal - finalAmount;

    return {
      subtotal,
      individualDiscounts,
      bulkDiscount,
      tuesdayDiscount,
      finalAmount: Math.max(0, finalAmount), // 음수 방지
      totalSavings: Math.max(0, totalSavings), // 음수 방지
    };
  }
}
