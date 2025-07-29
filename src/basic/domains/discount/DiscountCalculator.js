import { DISCOUNT_THRESHOLDS, DISCOUNT_RATES } from '../../constants/DiscountConstants.js';
import { isTuesday } from '../../utils/DateUtils.js';

/**
 * 할인 계산기
 */
export class DiscountCalculator {
  /**
   * 개별 상품 할인율 계산
   * @param {string} productId - 상품 ID
   * @param {number} quantity - 수량
   * @returns {number} 할인율 (0~1)
   */
  calculateItemDiscount(productId, quantity) {
    if (quantity < DISCOUNT_THRESHOLDS.INDIVIDUAL_ITEM) {
      return 0;
    }

    return DISCOUNT_RATES[productId] || 0;
  }

  /**
   * 대량구매 할인율 계산
   * @param {number} totalQuantity - 총 수량
   * @returns {number} 할인율 (0~1)
   */
  calculateBulkDiscount(totalQuantity) {
    return totalQuantity >= DISCOUNT_THRESHOLDS.BULK_PURCHASE ? DISCOUNT_RATES.BULK_PURCHASE : 0;
  }

  /**
   * 화요일 할인율 계산
   * @returns {number} 할인율 (0~1)
   */
  calculateTuesdayDiscount() {
    return isTuesday() ? DISCOUNT_RATES.TUESDAY : 0;
  }

  /**
   * 총 할인율 계산
   * @param {number} subtotal - 소계
   * @param {number} totalQuantity - 총 수량
   * @param {number} itemDiscounts - 개별 할인 적용된 금액
   * @returns {Object} 할인 정보
   */
  calculateTotalDiscount(subtotal, totalQuantity, itemDiscounts) {
    let finalAmount = itemDiscounts;
    let discountRate = 0;

    // 대량구매 할인 적용
    const bulkDiscountRate = this.calculateBulkDiscount(totalQuantity);
    if (bulkDiscountRate > 0) {
      finalAmount = subtotal * (1 - bulkDiscountRate);
      discountRate = bulkDiscountRate;
    } else {
      discountRate = (subtotal - finalAmount) / subtotal;
    }

    // 화요일 할인 적용
    const tuesdayDiscountRate = this.calculateTuesdayDiscount();
    if (tuesdayDiscountRate > 0 && finalAmount > 0) {
      finalAmount = finalAmount * (1 - tuesdayDiscountRate);
      discountRate = 1 - finalAmount / subtotal;
    }

    return {
      finalAmount,
      discountRate,
      isTuesday: tuesdayDiscountRate > 0,
      isBulkPurchase: bulkDiscountRate > 0,
    };
  }

  /**
   * 할인 정보 생성
   * @param {Array} cartItems - 장바구니 아이템 목록
   * @returns {Object} 할인 정보
   */
  generateDiscountInfo(cartItems) {
    const itemDiscounts = [];
    let totalAmount = 0;
    let itemCount = 0;
    let subtotal = 0;

    cartItems.forEach((item) => {
      const itemDiscount = this.calculateItemDiscount(item.id, item.quantity);
      const itemTotal = item.getTotalPrice();
      const itemOriginalTotal = item.getOriginalTotalPrice();

      itemCount += item.quantity;
      subtotal += itemOriginalTotal;
      totalAmount += itemTotal;

      if (itemDiscount > 0) {
        itemDiscounts.push({
          name: item.name,
          discount: itemDiscount * 100,
        });
      }
    });

    const { finalAmount, discountRate, isTuesday, isBulkPurchase } = this.calculateTotalDiscount(
      subtotal,
      itemCount,
      totalAmount,
    );

    return {
      finalAmount,
      discountRate,
      subtotal,
      itemCount,
      itemDiscounts,
      isTuesday,
      isBulkPurchase,
      savedAmount: subtotal - finalAmount,
    };
  }
}
