/**
 * DiscountEngine 단위 테스트
 */

import { beforeEach, describe, expect, it } from 'vitest';
import { DISCOUNT_POLICIES, DISCOUNT_TYPES, DiscountEngine } from '../DiscountEngine.js';

describe('DiscountEngine', () => {
  let mockCart;
  let mockContext;

  beforeEach(() => {
    mockCart = [
      {
        id: 'p1',
        quantity: 12,
        price: 10000,
        product: { id: 'p1', name: '상품1', onSale: false, suggestSale: false },
      },
      {
        id: 'p2',
        quantity: 8,
        price: 15000,
        product: { id: 'p2', name: '상품2', onSale: true, suggestSale: false },
      },
      {
        id: 'p3',
        quantity: 5,
        price: 20000,
        product: { id: 'p3', name: '상품3', onSale: true, suggestSale: true },
      },
    ];

    mockContext = {
      date: new Date('2024-01-02'), // Tuesday
    };
  });

  describe('isEligibleForDiscount', () => {
    it('개별 할인: 수량이 10개 이상일 때 적용 가능', () => {
      const result = DiscountEngine.isEligibleForDiscount(
        mockCart[0], // quantity: 12
        DISCOUNT_POLICIES[DISCOUNT_TYPES.INDIVIDUAL]
      );

      expect(result.eligible).toBe(true);
      expect(result.reason).toBe('할인 적용 가능');
    });

    it('개별 할인: 수량이 10개 미만일 때 적용 불가', () => {
      const result = DiscountEngine.isEligibleForDiscount(
        mockCart[2], // quantity: 5
        DISCOUNT_POLICIES[DISCOUNT_TYPES.INDIVIDUAL]
      );

      expect(result.eligible).toBe(false);
      expect(result.reason).toContain('수량이 10개 미만입니다');
    });

    it('번개세일: onSale 플래그가 true일 때 적용 가능', () => {
      const result = DiscountEngine.isEligibleForDiscount(
        mockCart[1], // onSale: true
        DISCOUNT_POLICIES[DISCOUNT_TYPES.FLASH]
      );

      expect(result.eligible).toBe(true);
    });

    it('번개세일: onSale 플래그가 false일 때 적용 불가', () => {
      const result = DiscountEngine.isEligibleForDiscount(
        mockCart[0], // onSale: false
        DISCOUNT_POLICIES[DISCOUNT_TYPES.FLASH]
      );

      expect(result.eligible).toBe(false);
      expect(result.reason).toBe('번개세일 대상 상품이 아닙니다');
    });

    it('조합할인: onSale과 suggestSale 모두 true일 때 적용 가능', () => {
      const result = DiscountEngine.isEligibleForDiscount(
        mockCart[2], // onSale: true, suggestSale: true
        DISCOUNT_POLICIES[DISCOUNT_TYPES.COMBO]
      );

      expect(result.eligible).toBe(true);
    });
  });

  describe('prioritizeDiscounts', () => {
    it('할인 우선순위에 따라 정렬', () => {
      const discounts = [
        { type: DISCOUNT_TYPES.TUESDAY, rate: 0.1 },
        { type: DISCOUNT_TYPES.INDIVIDUAL, rate: 0.15 },
        { type: DISCOUNT_TYPES.FLASH, rate: 0.2 },
      ];

      const sorted = DiscountEngine.prioritizeDiscounts(discounts);

      expect(sorted[0].type).toBe(DISCOUNT_TYPES.INDIVIDUAL); // 우선순위 1
      expect(sorted[1].type).toBe(DISCOUNT_TYPES.FLASH); // 우선순위 2
      expect(sorted[2].type).toBe(DISCOUNT_TYPES.TUESDAY); // 우선순위 3
    });
  });

  describe('combineDiscounts', () => {
    it('번개세일 + 추천할인 = 25% 조합 할인', () => {
      const discounts = [
        { type: DISCOUNT_TYPES.FLASH, rate: 0.2, description: '번개세일' },
        { type: DISCOUNT_TYPES.RECOMMEND, rate: 0.05, description: '추천할인' },
      ];

      const combined = DiscountEngine.combineDiscounts(discounts);

      expect(combined.type).toBe(DISCOUNT_TYPES.COMBO);
      expect(combined.rate).toBe(0.25);
      expect(combined.description).toBe('번개세일 + 추천할인');
    });

    it('단일 할인은 그대로 반환', () => {
      const discounts = [{ type: DISCOUNT_TYPES.INDIVIDUAL, rate: 0.15, description: '개별할인' }];

      const combined = DiscountEngine.combineDiscounts(discounts);

      expect(combined).toEqual(discounts[0]);
    });

    it('빈 배열은 적용 불가 결과 반환', () => {
      const combined = DiscountEngine.combineDiscounts([]);

      expect(combined.eligible).toBe(false);
      expect(combined.rate).toBe(0);
    });
  });

  describe('_getAllAvailableDiscounts', () => {
    it('모든 적용 가능한 할인을 찾아서 반환', () => {
      const discounts = DiscountEngine._getAllAvailableDiscounts(mockCart, mockContext);

      // 개별 할인 (상품1: 12개)
      const individualDiscount = discounts.find(d => d.type === DISCOUNT_TYPES.INDIVIDUAL);
      expect(individualDiscount).toBeDefined();
      expect(individualDiscount.productId).toBe('p1');

      // 번개세일 할인 (상품2, 상품3)
      const flashDiscount = discounts.find(d => d.type === DISCOUNT_TYPES.FLASH);
      expect(flashDiscount).toBeDefined();
      expect(flashDiscount.items).toEqual(['p2', 'p3']);

      // 추천할인 (상품3)
      const recommendDiscount = discounts.find(d => d.type === DISCOUNT_TYPES.RECOMMEND);
      expect(recommendDiscount).toBeDefined();
      expect(recommendDiscount.items).toEqual(['p3']);

      // 조합할인 (상품3)
      const comboDiscount = discounts.find(d => d.type === DISCOUNT_TYPES.COMBO);
      expect(comboDiscount).toBeDefined();
      expect(comboDiscount.items).toEqual(['p3']);

      // 화요일 할인 (화요일이므로)
      const tuesdayDiscount = discounts.find(d => d.type === DISCOUNT_TYPES.TUESDAY);
      expect(tuesdayDiscount).toBeDefined();
    });

    it('대량구매 할인: 총 수량이 30개 이상일 때 적용', () => {
      const largeMockCart = [
        {
          id: 'p1',
          quantity: 35,
          price: 10000,
          product: { id: 'p1', name: '상품1', onSale: false, suggestSale: false },
        },
      ];

      const discounts = DiscountEngine._getAllAvailableDiscounts(largeMockCart, mockContext);
      const bulkDiscount = discounts.find(d => d.type === DISCOUNT_TYPES.BULK);

      expect(bulkDiscount).toBeDefined();
      expect(bulkDiscount.rate).toBe(0.25);
    });
  });

  describe('applyDiscountPolicies', () => {
    it('최적 할인 조합을 적용하여 최종 결과 반환', () => {
      const result = DiscountEngine.applyDiscountPolicies(mockCart, mockContext);

      expect(result.appliedDiscounts).toBeDefined();
      expect(result.totalSavings).toBeGreaterThan(0);
      expect(result.finalAmount).toBeLessThan(result.appliedDiscounts.length ? 240000 : 240000); // 원래 총액: 12*10000 + 8*15000 + 5*20000 = 340000
      expect(result.availableDiscounts).toBeDefined();
    });

    it('빈 장바구니는 할인 없음', () => {
      const result = DiscountEngine.applyDiscountPolicies([], mockContext);

      expect(result.appliedDiscounts).toEqual([]);
      expect(result.totalSavings).toBe(0);
      expect(result.finalAmount).toBe(0);
      expect(result.availableDiscounts).toEqual([]);
    });
  });

  describe('findBestDiscount', () => {
    it('최대 절약 금액을 제공하는 할인 조합 선택', () => {
      const availableDiscounts = [
        { type: DISCOUNT_TYPES.INDIVIDUAL, rate: 0.15, eligible: true },
        { type: DISCOUNT_TYPES.FLASH, rate: 0.2, eligible: true },
        { type: DISCOUNT_TYPES.RECOMMEND, rate: 0.05, eligible: true },
        { type: DISCOUNT_TYPES.TUESDAY, rate: 0.1, eligible: true },
      ];

      const bestCombination = DiscountEngine.findBestDiscount(availableDiscounts);

      // 최대 할인율을 가진 조합이 선택되어야 함
      expect(bestCombination.length).toBeGreaterThan(0);
      const totalRate = bestCombination.reduce((sum, discount) => sum + discount.rate, 0);
      expect(totalRate).toBeGreaterThan(0);
    });
  });
});
