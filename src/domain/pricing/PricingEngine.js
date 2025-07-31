// PricingEngine: calculate discounts based on cart content
import { isTuesday } from "./helpers.js";

const BULK_DISCOUNT_MAP = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
};

/**
 * @typedef {import('../Cart.js').default} Cart
 */

export default class PricingEngine {
  /**
   * @param {Cart} cart
   * @param {Date} [now]
   * @returns {{finalTotal:number, originalSubtotal:number, discountRate:number, breakdown:string[]}}
   */
  static calculate(cart, now = new Date()) {
    const originalSubtotal = cart.subtotal;
    if (originalSubtotal === 0) {
      return {
        finalTotal: 0,
        originalSubtotal: 0,
        discountRate: 0,
        breakdown: [],
      };
    }

    const breakdown = [];
    let discountedTotal = originalSubtotal;

    // 전체 수량 할인 우선순위: 30개 이상 25%
    if (cart.totalQuantity >= 30) {
      discountedTotal *= 0.75;
      breakdown.push("대량구매 25%");
    } else {
      // 개별 상품 할인
      for (const item of cart.list) {
        const bulkRate =
          item.quantity >= 10 ? BULK_DISCOUNT_MAP[item.id] || 0 : 0;
        if (bulkRate > 0) {
          const itemSubtotal = item.product.salePrice * item.quantity;
          const saved = itemSubtotal * bulkRate;
          discountedTotal -= saved;
          breakdown.push(`${item.product.name} -${bulkRate * 100}%`);
        }
      }
    }

    // 화요일 10% 추가 (중복 허용)
    if (isTuesday(now) && discountedTotal > 0) {
      discountedTotal *= 0.9;
      breakdown.push("화요일 -10%");
    }

    const discountRate = 1 - discountedTotal / originalSubtotal;

    return {
      finalTotal: Math.round(discountedTotal),
      originalSubtotal,
      discountRate,
      breakdown,
    };
  }
}
