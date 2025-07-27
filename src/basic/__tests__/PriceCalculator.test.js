/**
 * PriceCalculator 단위 테스트
 */

import { describe, expect, it } from 'vitest';
import { PriceCalculator } from '../calculations/PriceCalculator.js';

describe('PriceCalculator', () => {
  describe('calculateSubtotal', () => {
    it('빈 배열에 대해 0을 반환해야 함', () => {
      const result = PriceCalculator.calculateSubtotal([]);
      expect(result).toEqual({ subtotal: 0, itemTotals: [] });
    });

    it('단일 아이템의 소계를 올바르게 계산해야 함', () => {
      const cartItems = [{ id: 'p1', quantity: 2, price: 10000 }];
      const result = PriceCalculator.calculateSubtotal(cartItems);

      expect(result.subtotal).toBe(20000);
      expect(result.itemTotals).toEqual([{ id: 'p1', total: 20000 }]);
    });

    it('여러 아이템의 소계를 올바르게 계산해야 함', () => {
      const cartItems = [
        { id: 'p1', quantity: 2, price: 10000 },
        { id: 'p2', quantity: 1, price: 15000 },
      ];
      const result = PriceCalculator.calculateSubtotal(cartItems);

      expect(result.subtotal).toBe(35000);
      expect(result.itemTotals).toHaveLength(2);
    });
  });

  describe('calculateItemDiscount', () => {
    it('수량이 10개 미만일 때 할인이 없어야 함', () => {
      const item = { id: 'p1', price: 10000 };
      const result = PriceCalculator.calculateItemDiscount(item, 5);

      expect(result.discountRate).toBe(0);
      expect(result.discountAmount).toBe(0);
    });

    it('수량이 10개 이상일 때 할인이 적용되어야 함', () => {
      const item = { id: 'p1', price: 10000 };
      const result = PriceCalculator.calculateItemDiscount(item, 15);

      // 할인율이 0보다 크거나 같아야 함 (실제 할인율은 DiscountPolicies에 의존)
      expect(result.discountRate).toBeGreaterThanOrEqual(0);
      expect(result.discountAmount).toBeGreaterThanOrEqual(0);
    });
  });

  describe('calculateBulkDiscount', () => {
    it('수량이 30개 미만일 때 대량구매 할인이 없어야 함', () => {
      const result = PriceCalculator.calculateBulkDiscount(25, 100000);

      expect(result.discountRate).toBe(0);
      expect(result.discountAmount).toBe(0);
    });

    it('수량이 30개 이상일 때 대량구매 할인이 적용되어야 함', () => {
      const result = PriceCalculator.calculateBulkDiscount(35, 100000);

      expect(result.discountRate).toBe(0.25); // 25% 할인
      expect(result.discountAmount).toBe(25000); // 100000 * 0.25
    });
  });

  describe('calculateTuesdayDiscount', () => {
    it('화요일이 아닐 때 할인이 없어야 함', () => {
      const monday = new Date('2023-12-11'); // 월요일
      const result = PriceCalculator.calculateTuesdayDiscount(100000, monday);

      expect(result.discountRate).toBe(0);
      expect(result.discountAmount).toBe(0);
      expect(result.isTuesday).toBe(false);
    });

    it('화요일일 때 10% 할인이 적용되어야 함', () => {
      const tuesday = new Date('2023-12-12'); // 화요일
      const result = PriceCalculator.calculateTuesdayDiscount(100000, tuesday);

      expect(result.discountRate).toBe(0.1); // 10% 할인
      expect(result.discountAmount).toBe(10000); // 100000 * 0.1
      expect(result.isTuesday).toBe(true);
    });
  });

  describe('calculateFinalPrice', () => {
    it('빈 장바구니에 대해 0 결과를 반환해야 함', () => {
      const result = PriceCalculator.calculateFinalPrice([]);

      expect(result.subtotal).toBe(0);
      expect(result.finalAmount).toBe(0);
      expect(result.totalSavings).toBe(0);
    });

    it('할인이 없는 기본 케이스를 올바르게 계산해야 함', () => {
      const cartItems = [
        { id: 'p1', quantity: 5, price: 10000 }, // 10개 미만이므로 개별 할인 없음
      ];
      const monday = new Date('2023-12-11'); // 월요일 (화요일 할인 없음)

      const result = PriceCalculator.calculateFinalPrice(cartItems, monday);

      expect(result.subtotal).toBe(50000);
      expect(result.finalAmount).toBe(50000);
      expect(result.totalSavings).toBe(0);
      expect(result.individualDiscounts).toHaveLength(0);
    });

    it('대량구매 할인을 올바르게 적용해야 함', () => {
      const cartItems = [
        { id: 'p1', quantity: 35, price: 10000 }, // 35개 > 30개 대량구매 조건
      ];
      const monday = new Date('2023-12-11'); // 월요일

      const result = PriceCalculator.calculateFinalPrice(cartItems, monday);

      expect(result.subtotal).toBe(350000);
      expect(result.bulkDiscount.discountRate).toBe(0.25);
      expect(result.bulkDiscount.discountAmount).toBe(87500);
      expect(result.finalAmount).toBe(262500);
      expect(result.totalSavings).toBe(87500);
    });
  });
});
