import { DISCOUNT_POLICIES } from "../constants.js";

export class DiscountService {
  // 개별 상품 할인 계산
  static calculateIndividualDiscount(productId, quantity) {
    if (quantity < 10) return 0;

    const discountRate = DISCOUNT_POLICIES.INDIVIDUAL[productId] || 0;
    return discountRate;
  }

  // 대량구매 할인 계산
  static calculateBulkDiscount(totalQuantity) {
    if (totalQuantity >= DISCOUNT_POLICIES.BULK.THRESHOLD) {
      return DISCOUNT_POLICIES.BULK.DISCOUNT_RATE;
    }
    return 0;
  }

  // 화요일 할인 계산
  static calculateTuesdayDiscount() {
    const today = new Date();
    const isTuesday = today.getDay() === 2;
    return isTuesday ? DISCOUNT_POLICIES.TUESDAY.DISCOUNT_RATE : 0;
  }

  // 총 할인율 계산
  static calculateTotalDiscountRate(cartItems, totalQuantity) {
    let totalDiscountRate = 0;

    // 개별 상품 할인
    cartItems.forEach((item) => {
      const individualDiscount = this.calculateIndividualDiscount(
        item.productId,
        item.quantity
      );
      if (individualDiscount > 0) {
        totalDiscountRate +=
          (individualDiscount * item.getTotalPrice()) /
          item.getOriginalTotalPrice();
      }
    });

    // 대량구매 할인
    const bulkDiscount = this.calculateBulkDiscount(totalQuantity);
    if (bulkDiscount > 0) {
      totalDiscountRate += bulkDiscount;
    }

    // 화요일 할인
    const tuesdayDiscount = this.calculateTuesdayDiscount();
    if (tuesdayDiscount > 0) {
      totalDiscountRate += tuesdayDiscount;
    }

    return Math.min(totalDiscountRate, 100); // 최대 100% 할인
  }

  // 할인 금액 계산
  static calculateDiscountAmount(originalTotal, discountRate) {
    return originalTotal * (discountRate / 100);
  }

  // 최종 가격 계산
  static calculateFinalPrice(originalTotal, discountRate) {
    return originalTotal * (1 - discountRate / 100);
  }
}
