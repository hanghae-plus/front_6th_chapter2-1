/**
 * 계산 유틸리티 함수 테스트
 */

import { describe, expect, it } from 'vitest';
import { DISCOUNT_POLICIES } from '../../constants/discountPolicies';
import { calculateDiscount } from '../calculations';

describe('calculations', () => {
  describe('calculateDiscount', () => {
    it('should return 0 for amount below minimum', () => {
      // Given: 최소 금액보다 작은 금액
      const amount = 50000;
      const policies = DISCOUNT_POLICIES;

      // When: 할인을 계산함
      const result = calculateDiscount(amount, policies);

      // Then: 할인이 0이어야 함
      expect(result).toBe(0);
    });

    it('should apply percentage discount correctly', () => {
      // Given: 할인 조건을 만족하는 금액
      const amount = 150000;
      const policies = DISCOUNT_POLICIES;

      // When: 할인을 계산함
      const result = calculateDiscount(amount, policies);

      // Then: 올바른 할인이 적용되어야 함
      expect(result).toBe(15000); // 10% 할인
    });

    it('should respect maximum discount limit', () => {
      // Given: 최대 할인 한도를 초과하는 금액
      const amount = 1000000;
      const policies = DISCOUNT_POLICIES;

      // When: 할인을 계산함
      const result = calculateDiscount(amount, policies);

      // Then: 최대 할인 한도가 적용되어야 함
      expect(result).toBe(200000); // 10% 할인 (200000원)
    });

    it('should apply multiple discount policies', () => {
      // Given: 여러 할인 정책
      const amount = 200000;
      const policies = [
        {
          id: 'test1',
          type: 'percentage' as const,
          value: 10,
          minAmount: 100000,
          description: 'Test discount 1'
        },
        {
          id: 'test2',
          type: 'fixed' as const,
          value: 5000,
          minAmount: 50000,
          description: 'Test discount 2'
        }
      ];

      // When: 할인을 계산함
      const result = calculateDiscount(amount, policies);

      // Then: 여러 할인 정책이 적용되어야 함
      expect(result).toBe(25000); // 10% + 5000원
    });

    it('should handle empty policies array', () => {
      // Given: 빈 할인 정책 배열
      const amount = 100000;
      const policies: any[] = [];

      // When: 할인을 계산함
      const result = calculateDiscount(amount, policies);

      // Then: 할인이 0이어야 함
      expect(result).toBe(0);
    });

    it('should handle invalid amount', () => {
      // Given: 잘못된 금액
      const amount = -1000;
      const policies = DISCOUNT_POLICIES;

      // When: 할인을 계산함
      const result = calculateDiscount(amount, policies);

      // Then: 할인이 0이어야 함
      expect(result).toBe(0);
    });
  });
});
