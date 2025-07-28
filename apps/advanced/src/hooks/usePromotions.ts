/**
 * 프로모션 관련 커스텀 Hook
 * 선언적 프로그래밍 패러다임을 적용한 프로모션 로직
 */

import { useMemo } from 'react';
import { DISCOUNT_POLICIES } from '../constants/discountPolicies';
import { POINTS_POLICIES } from '../constants/pointsPolicies';
import { CartItem } from '../types/cart.types';
import { DiscountPolicy, PointsPolicy } from '../types/promotion.types';

interface Promotion {
  type: 'discount' | 'points';
  name: string;
  description: string;
  value: number;
}

interface PromotionResult {
  discounts: DiscountPolicy[];
  points: PointsPolicy[];
  totalDiscount: number;
  totalPoints: number;
  applicablePromotions: Promotion[];
  discountPercentage: number;
  pointsRate: number;
}

/**
 * 프로모션 관리를 위한 커스텀 Hook
 * @param cartItems - 장바구니 아이템 배열
 * @returns 프로모션 결과
 */
export const usePromotions = (cartItems: CartItem[]): PromotionResult => {
  return useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

    // 적용 가능한 할인 정책 (선언적 접근)
    const applicableDiscounts = DISCOUNT_POLICIES.filter(
      policy => subtotal >= (policy.minAmount ?? 0)
    );

    // 적용 가능한 포인트 정책 (선언적 접근)
    const applicablePoints = POINTS_POLICIES.filter(
      policy => subtotal >= policy.minPurchase
    );

    // 총 할인 금액 계산 (선언적 접근)
    const totalDiscount = calculateTotalDiscount(subtotal, applicableDiscounts);

    // 총 포인트 계산 (선언적 접근)
    const totalPoints = calculateTotalPoints(subtotal, applicablePoints);

    // 할인 퍼센티지 계산 (선언적 접근)
    const discountPercentage =
      subtotal > 0 ? (totalDiscount / subtotal) * 100 : 0;

    // 포인트 적립률 계산 (선언적 접근)
    const pointsRate = subtotal > 0 ? (totalPoints / subtotal) * 100 : 0;

    // 적용 가능한 프로모션 목록 (선언적 접근)
    const applicablePromotions = [
      ...applicableDiscounts.map(policy => ({
        type: 'discount' as const,
        name: policy.id,
        description: policy.description,
        value: calculatePolicyDiscount(subtotal, policy)
      })),
      ...applicablePoints.map(policy => ({
        type: 'points' as const,
        name: policy.id,
        description: policy.description,
        value: calculatePolicyPoints(subtotal, policy)
      }))
    ];

    return {
      discounts: applicableDiscounts,
      points: applicablePoints,
      totalDiscount,
      totalPoints,
      applicablePromotions,
      discountPercentage,
      pointsRate
    };
  }, [cartItems]);
};

/**
 * 총 할인 금액을 계산합니다 (선언적 접근)
 * @param subtotal - 소계 금액
 * @param policies - 할인 정책 배열
 * @returns 총 할인 금액
 */
const calculateTotalDiscount = (
  subtotal: number,
  policies: DiscountPolicy[]
): number => {
  return policies.reduce((total, policy) => {
    const discount = calculatePolicyDiscount(subtotal, policy);
    return total + discount;
  }, 0);
};

/**
 * 개별 정책의 할인 금액을 계산합니다 (선언적 접근)
 * @param subtotal - 소계 금액
 * @param policy - 할인 정책
 * @returns 할인 금액
 */
const calculatePolicyDiscount = (
  subtotal: number,
  policy: DiscountPolicy
): number => {
  const discount =
    policy.type === 'percentage'
      ? subtotal * (policy.value / 100)
      : policy.value;

  return policy.maxDiscount ? Math.min(discount, policy.maxDiscount) : discount;
};

/**
 * 총 포인트를 계산합니다 (선언적 접근)
 * @param subtotal - 소계 금액
 * @param policies - 포인트 정책 배열
 * @returns 총 포인트
 */
const calculateTotalPoints = (
  subtotal: number,
  policies: PointsPolicy[]
): number => {
  return policies.reduce((total, policy) => {
    const points = calculatePolicyPoints(subtotal, policy);
    return total + points;
  }, 0);
};

/**
 * 개별 정책의 포인트를 계산합니다 (선언적 접근)
 * @param subtotal - 소계 금액
 * @param policy - 포인트 정책
 * @returns 포인트
 */
const calculatePolicyPoints = (
  subtotal: number,
  policy: PointsPolicy
): number => {
  const points = Math.floor(subtotal * policy.earnRate);

  return policy.maxPoints ? Math.min(points, policy.maxPoints) : points;
};

/**
 * 특별 할인을 위한 커스텀 Hook
 * @param subtotal - 소계 금액
 * @param specialDiscounts - 특별 할인 정책 배열
 * @returns 특별 할인 결과
 */
export const useSpecialDiscounts = (
  subtotal: number,
  specialDiscounts: DiscountPolicy[]
) => {
  return useMemo(() => {
    const applicableSpecials = specialDiscounts.filter(
      policy => subtotal >= (policy.minAmount ?? 0)
    );

    const totalSpecialDiscount = applicableSpecials.reduce((total, policy) => {
      const discount = calculatePolicyDiscount(subtotal, policy);
      return total + discount;
    }, 0);

    return {
      applicableSpecials,
      totalSpecialDiscount,
      specialDiscountPercentage:
        subtotal > 0 ? (totalSpecialDiscount / subtotal) * 100 : 0
    };
  }, [subtotal, specialDiscounts]);
};

/**
 * 포인트 적립을 위한 커스텀 Hook
 * @param subtotal - 소계 금액
 * @param pointsPolicies - 포인트 정책 배열
 * @returns 포인트 적립 결과
 */
export const usePointsEarning = (
  subtotal: number,
  pointsPolicies: PointsPolicy[]
) => {
  return useMemo(() => {
    const applicablePoints = pointsPolicies.filter(
      policy => subtotal >= policy.minPurchase
    );

    const totalPoints = applicablePoints.reduce((total, policy) => {
      const points = calculatePolicyPoints(subtotal, policy);
      return total + points;
    }, 0);

    return {
      applicablePoints,
      totalPoints,
      pointsRate: subtotal > 0 ? (totalPoints / subtotal) * 100 : 0
    };
  }, [subtotal, pointsPolicies]);
};

/**
 * 프로모션 통계를 위한 커스텀 Hook
 * @param cartItems - 장바구니 아이템 배열
 * @returns 프로모션 통계
 */
export const usePromotionStats = (cartItems: CartItem[]) => {
  return useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    const { totalDiscount, totalPoints } = usePromotions(cartItems);

    return {
      subtotal,
      totalDiscount,
      totalPoints,
      finalAmount: subtotal - totalDiscount,
      savingsPercentage: subtotal > 0 ? (totalDiscount / subtotal) * 100 : 0,
      pointsRate: subtotal > 0 ? (totalPoints / subtotal) * 100 : 0,
      itemCount: cartItems.length,
      averageDiscountPerItem:
        cartItems.length > 0 ? totalDiscount / cartItems.length : 0
    };
  }, [cartItems]);
};
