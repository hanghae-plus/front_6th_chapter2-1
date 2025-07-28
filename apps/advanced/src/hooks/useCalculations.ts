/**
 * 계산 관련 커스텀 Hook
 * 선언적 프로그래밍 패러다임을 적용한 계산 로직
 */

import { useMemo } from 'react';
import { DISCOUNT_POLICIES } from '../constants/discountPolicies';
import { POINTS_POLICIES } from '../constants/pointsPolicies';
import { CartItem } from '../types/cart.types';
import { DiscountPolicy, PointsPolicy } from '../types/promotion.types';

interface CalculationResult {
  subtotal: number;
  discount: number;
  total: number;
  points: number;
  itemCount: number;
}

/**
 * 장바구니 계산을 위한 커스텀 Hook
 * @param cartItems - 장바구니 아이템 배열
 * @returns 계산 결과
 */
export const useCalculations = (cartItems: CartItem[]): CalculationResult => {
  return useMemo(() => {
    // 선언적 계산 로직
    const calculations = {
      subtotal: () => cartItems.reduce((sum, item) => sum + item.subtotal, 0),
      itemCount: () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
      discount: () =>
        calculateTotalDiscount(calculations.subtotal(), DISCOUNT_POLICIES),
      points: () =>
        calculateTotalPoints(calculations.subtotal(), POINTS_POLICIES)
    };

    const subtotal = calculations.subtotal();
    const discount = calculations.discount();
    const points = calculations.points();
    const itemCount = calculations.itemCount();

    return {
      subtotal,
      discount,
      total: subtotal - discount,
      points,
      itemCount
    };
  }, [cartItems]);
};

/**
 * 총 할인 금액을 계산합니다 (선언적 접근)
 * @param totalAmount - 총 구매 금액
 * @param policies - 할인 정책 배열
 * @returns 총 할인 금액
 */
const calculateTotalDiscount = (
  totalAmount: number,
  policies: DiscountPolicy[]
): number => {
  return policies
    .filter(policy => totalAmount >= (policy.minAmount ?? 0))
    .reduce((totalDiscount, policy) => {
      const discount = calculatePolicyDiscount(totalAmount, policy);
      return totalDiscount + discount;
    }, 0);
};

/**
 * 개별 정책의 할인 금액을 계산합니다 (선언적 접근)
 * @param totalAmount - 총 구매 금액
 * @param policy - 할인 정책
 * @returns 할인 금액
 */
const calculatePolicyDiscount = (
  totalAmount: number,
  policy: DiscountPolicy
): number => {
  const discount =
    policy.type === 'percentage'
      ? totalAmount * (policy.value / 100)
      : policy.value;

  return policy.maxDiscount ? Math.min(discount, policy.maxDiscount) : discount;
};

/**
 * 총 포인트를 계산합니다 (선언적 접근)
 * @param totalAmount - 총 구매 금액
 * @param policies - 포인트 정책 배열
 * @returns 총 포인트
 */
const calculateTotalPoints = (
  totalAmount: number,
  policies: PointsPolicy[]
): number => {
  return policies
    .filter(policy => totalAmount >= policy.minPurchase)
    .reduce((totalPoints, policy) => {
      const points = calculatePolicyPoints(totalAmount, policy);
      return totalPoints + points;
    }, 0);
};

/**
 * 개별 정책의 포인트를 계산합니다 (선언적 접근)
 * @param totalAmount - 총 구매 금액
 * @param policy - 포인트 정책
 * @returns 포인트
 */
const calculatePolicyPoints = (
  totalAmount: number,
  policy: PointsPolicy
): number => {
  const points = Math.floor(totalAmount * policy.earnRate);

  return policy.maxPoints ? Math.min(points, policy.maxPoints) : points;
};

/**
 * 세율을 계산합니다 (선언적 접근)
 * @param amount - 금액
 * @param taxRate - 세율 (0.1 = 10%)
 * @returns 세금
 */
export const useTaxCalculation = (amount: number, taxRate: number = 0.1) => {
  return useMemo(() => Math.floor(amount * taxRate), [amount, taxRate]);
};

/**
 * 배송비를 계산합니다 (선언적 접근)
 * @param subtotal - 소계 금액
 * @param freeShippingThreshold - 무료 배송 임계값
 * @param shippingCost - 기본 배송비
 * @returns 배송비
 */
export const useShippingCalculation = (
  subtotal: number,
  freeShippingThreshold: number = 50000,
  shippingCost: number = 3000
) => {
  return useMemo(
    () => (subtotal >= freeShippingThreshold ? 0 : shippingCost),
    [subtotal, freeShippingThreshold, shippingCost]
  );
};

/**
 * 최종 금액을 계산합니다 (선언적 접근)
 * @param subtotal - 소계 금액
 * @param discount - 할인 금액
 * @param tax - 세금
 * @param shipping - 배송비
 * @returns 최종 금액
 */
export const useFinalAmountCalculation = (
  subtotal: number,
  discount: number = 0,
  tax: number = 0,
  shipping: number = 0
) => {
  return useMemo(
    () => subtotal - discount + tax + shipping,
    [subtotal, discount, tax, shipping]
  );
};
