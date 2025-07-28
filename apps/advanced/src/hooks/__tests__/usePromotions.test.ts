/**
 * usePromotions Hook 테스트
 * 선언적 프로그래밍 패러다임 테스트
 */

import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PRODUCTS } from '../../constants/products';
import { CartItem } from '../../types/cart.types';
import {
  usePointsEarning,
  usePromotions,
  usePromotionStats,
  useSpecialDiscounts
} from '../usePromotions';

describe('usePromotions', () => {
  describe('Given 장바구니에 상품이 있을 때', () => {
    const mockCartItems: CartItem[] = [
      {
        product: PRODUCTS[0],
        quantity: 2,
        subtotal: 2400000,
        discount: 0,
        points: 0
      },
      {
        product: PRODUCTS[1],
        quantity: 1,
        subtotal: 1200000,
        discount: 0,
        points: 0
      }
    ];

    describe('When usePromotions Hook을 호출하면', () => {
      const { result } = renderHook(() => usePromotions(mockCartItems));

      it('Then 프로모션 결과를 반환해야 한다', () => {
        expect(result.current.totalDiscount).toBeGreaterThanOrEqual(0);
        expect(result.current.totalPoints).toBeGreaterThanOrEqual(0);
        expect(result.current.discountPercentage).toBeGreaterThanOrEqual(0);
        expect(result.current.pointsRate).toBeGreaterThanOrEqual(0);
      });

      it('Then 할인 퍼센티지가 100%를 초과하지 않아야 한다', () => {
        expect(result.current.discountPercentage).toBeLessThanOrEqual(100);
      });

      it('Then 포인트 적립률이 100%를 초과하지 않아야 한다', () => {
        expect(result.current.pointsRate).toBeLessThanOrEqual(100);
      });

      it('Then 적용 가능한 프로모션 목록을 반환해야 한다', () => {
        expect(Array.isArray(result.current.applicablePromotions)).toBe(true);
        expect(
          result.current.applicablePromotions.every(
            promo => promo.type === 'discount' || promo.type === 'points'
          )
        ).toBe(true);
      });
    });
  });

  describe('Given 빈 장바구니가 있을 때', () => {
    describe('When usePromotions Hook을 호출하면', () => {
      const { result } = renderHook(() => usePromotions([]));

      it('Then 모든 값이 0이어야 한다', () => {
        expect(result.current.totalDiscount).toBe(0);
        expect(result.current.totalPoints).toBe(0);
        expect(result.current.discountPercentage).toBe(0);
        expect(result.current.pointsRate).toBe(0);
        expect(result.current.applicablePromotions).toHaveLength(0);
      });
    });
  });

  describe('Given 높은 금액의 상품이 있을 때', () => {
    const highValueItems: CartItem[] = [
      {
        product: PRODUCTS[0],
        quantity: 10,
        subtotal: 12000000,
        discount: 0,
        points: 0
      }
    ];

    describe('When usePromotions Hook을 호출하면', () => {
      const { result } = renderHook(() => usePromotions(highValueItems));

      it('Then 더 많은 할인과 포인트를 제공해야 한다', () => {
        expect(result.current.totalDiscount).toBeGreaterThan(0);
        expect(result.current.totalPoints).toBeGreaterThan(0);
      });
    });
  });
});

describe('useSpecialDiscounts', () => {
  describe('Given 특별 할인 정책이 있을 때', () => {
    const specialDiscounts = [
      {
        id: 'special1',
        type: 'percentage' as const,
        value: 10,
        minAmount: 1000000,
        description: '10% 할인'
      },
      {
        id: 'special2',
        type: 'fixed' as const,
        value: 50000,
        minAmount: 2000000,
        description: '5만원 할인'
      }
    ];

    describe('When 높은 금액으로 특별 할인을 계산하면', () => {
      const { result } = renderHook(() =>
        useSpecialDiscounts(3000000, specialDiscounts)
      );

      it('Then 적용 가능한 특별 할인을 반환해야 한다', () => {
        expect(result.current.applicableSpecials).toHaveLength(2);
        expect(result.current.totalSpecialDiscount).toBeGreaterThan(0);
        expect(result.current.specialDiscountPercentage).toBeGreaterThan(0);
      });
    });

    describe('When 낮은 금액으로 특별 할인을 계산하면', () => {
      const { result } = renderHook(() =>
        useSpecialDiscounts(500000, specialDiscounts)
      );

      it('Then 적용 가능한 특별 할인이 없어야 한다', () => {
        expect(result.current.applicableSpecials).toHaveLength(0);
        expect(result.current.totalSpecialDiscount).toBe(0);
        expect(result.current.specialDiscountPercentage).toBe(0);
      });
    });
  });
});

describe('usePointsEarning', () => {
  describe('Given 포인트 정책이 있을 때', () => {
    const pointsPolicies = [
      {
        id: 'points1',
        earnRate: 0.01,
        minPurchase: 100000,
        description: '1% 포인트 적립'
      },
      {
        id: 'points2',
        earnRate: 0.02,
        minPurchase: 500000,
        maxPoints: 10000,
        description: '2% 포인트 적립 (최대 1만점)'
      }
    ];

    describe('When 높은 금액으로 포인트를 계산하면', () => {
      const { result } = renderHook(() =>
        usePointsEarning(1000000, pointsPolicies)
      );

      it('Then 적용 가능한 포인트 정책을 반환해야 한다', () => {
        expect(result.current.applicablePoints).toHaveLength(2);
        expect(result.current.totalPoints).toBeGreaterThan(0);
        expect(result.current.pointsRate).toBeGreaterThan(0);
      });
    });

    describe('When 낮은 금액으로 포인트를 계산하면', () => {
      const { result } = renderHook(() =>
        usePointsEarning(50000, pointsPolicies)
      );

      it('Then 적용 가능한 포인트 정책이 없어야 한다', () => {
        expect(result.current.applicablePoints).toHaveLength(0);
        expect(result.current.totalPoints).toBe(0);
        expect(result.current.pointsRate).toBe(0);
      });
    });
  });
});

describe('usePromotionStats', () => {
  describe('Given 장바구니 아이템이 있을 때', () => {
    const mockCartItems: CartItem[] = [
      {
        product: PRODUCTS[0],
        quantity: 2,
        subtotal: 2400000,
        discount: 0,
        points: 0
      }
    ];

    describe('When usePromotionStats Hook을 호출하면', () => {
      const { result } = renderHook(() => usePromotionStats(mockCartItems));

      it('Then 프로모션 통계를 반환해야 한다', () => {
        expect(result.current.subtotal).toBe(2400000);
        expect(result.current.totalDiscount).toBeGreaterThanOrEqual(0);
        expect(result.current.totalPoints).toBeGreaterThanOrEqual(0);
        expect(result.current.finalAmount).toBeLessThanOrEqual(2400000);
        expect(result.current.savingsPercentage).toBeGreaterThanOrEqual(0);
        expect(result.current.pointsRate).toBeGreaterThanOrEqual(0);
        expect(result.current.itemCount).toBe(1);
        expect(result.current.averageDiscountPerItem).toBeGreaterThanOrEqual(0);
      });

      it('Then 최종 금액이 소계에서 할인을 뺀 값이어야 한다', () => {
        expect(result.current.finalAmount).toBe(
          result.current.subtotal - result.current.totalDiscount
        );
      });

      it('Then 절약 퍼센티지가 100%를 초과하지 않아야 한다', () => {
        expect(result.current.savingsPercentage).toBeLessThanOrEqual(100);
      });
    });
  });
});
