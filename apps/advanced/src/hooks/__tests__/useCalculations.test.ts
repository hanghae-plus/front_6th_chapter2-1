/**
 * useCalculations Hook 테스트
 * 선언적 프로그래밍 패러다임 테스트
 */

import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PRODUCTS } from '../../constants/products';
import { CartItem } from '../../types/cart.types';
import {
  useCalculations,
  useFinalAmountCalculation,
  useShippingCalculation,
  useTaxCalculation
} from '../useCalculations';

describe('useCalculations', () => {
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

    describe('When useCalculations Hook을 호출하면', () => {
      const { result } = renderHook(() => useCalculations(mockCartItems));

      it('Then 정확한 계산 결과를 반환해야 한다', () => {
        expect(result.current.subtotal).toBe(3600000);
        expect(result.current.itemCount).toBe(3);
        expect(result.current.discount).toBeGreaterThan(0);
        expect(result.current.total).toBeLessThan(3600000);
        expect(result.current.points).toBeGreaterThan(0);
      });

      it('Then 할인 금액이 소계보다 작아야 한다', () => {
        expect(result.current.discount).toBeLessThan(result.current.subtotal);
      });

      it('Then 총 금액이 소계에서 할인을 뺀 값이어야 한다', () => {
        expect(result.current.total).toBe(
          result.current.subtotal - result.current.discount
        );
      });
    });
  });

  describe('Given 빈 장바구니가 있을 때', () => {
    describe('When useCalculations Hook을 호출하면', () => {
      const { result } = renderHook(() => useCalculations([]));

      it('Then 모든 값이 0이어야 한다', () => {
        expect(result.current.subtotal).toBe(0);
        expect(result.current.discount).toBe(0);
        expect(result.current.total).toBe(0);
        expect(result.current.points).toBe(0);
        expect(result.current.itemCount).toBe(0);
      });
    });
  });

  describe('Given 단일 상품이 있을 때', () => {
    const singleItem: CartItem[] = [
      {
        product: PRODUCTS[0],
        quantity: 1,
        subtotal: 1200000,
        discount: 0,
        points: 0
      }
    ];

    describe('When useCalculations Hook을 호출하면', () => {
      const { result } = renderHook(() => useCalculations(singleItem));

      it('Then 정확한 계산 결과를 반환해야 한다', () => {
        expect(result.current.subtotal).toBe(1200000);
        expect(result.current.itemCount).toBe(1);
        expect(result.current.total).toBeLessThanOrEqual(1200000);
      });
    });
  });
});

describe('useTaxCalculation', () => {
  describe('Given 금액과 세율이 있을 때', () => {
    describe('When useTaxCalculation Hook을 호출하면', () => {
      const { result } = renderHook(() => useTaxCalculation(1000000, 0.1));

      it('Then 정확한 세금을 계산해야 한다', () => {
        expect(result.current).toBe(100000);
      });
    });
  });

  describe('Given 기본 세율을 사용할 때', () => {
    describe('When useTaxCalculation Hook을 호출하면', () => {
      const { result } = renderHook(() => useTaxCalculation(1000000));

      it('Then 기본 세율(10%)을 적용해야 한다', () => {
        expect(result.current).toBe(100000);
      });
    });
  });
});

describe('useShippingCalculation', () => {
  describe('Given 소계가 무료 배송 임계값보다 클 때', () => {
    describe('When useShippingCalculation Hook을 호출하면', () => {
      const { result } = renderHook(() =>
        useShippingCalculation(60000, 50000, 3000)
      );

      it('Then 배송비가 0이어야 한다', () => {
        expect(result.current).toBe(0);
      });
    });
  });

  describe('Given 소계가 무료 배송 임계값보다 작을 때', () => {
    describe('When useShippingCalculation Hook을 호출하면', () => {
      const { result } = renderHook(() =>
        useShippingCalculation(30000, 50000, 3000)
      );

      it('Then 기본 배송비를 반환해야 한다', () => {
        expect(result.current).toBe(3000);
      });
    });
  });
});

describe('useFinalAmountCalculation', () => {
  describe('Given 모든 비용이 있을 때', () => {
    describe('When useFinalAmountCalculation Hook을 호출하면', () => {
      const { result } = renderHook(() =>
        useFinalAmountCalculation(1000000, 100000, 100000, 3000)
      );

      it('Then 정확한 최종 금액을 계산해야 한다', () => {
        expect(result.current).toBe(1003000); // 1000000 - 100000 + 100000 + 3000
      });
    });
  });

  describe('Given 할인과 추가 비용이 없을 때', () => {
    describe('When useFinalAmountCalculation Hook을 호출하면', () => {
      const { result } = renderHook(() => useFinalAmountCalculation(1000000));

      it('Then 소계와 동일한 금액을 반환해야 한다', () => {
        expect(result.current).toBe(1000000);
      });
    });
  });
});
