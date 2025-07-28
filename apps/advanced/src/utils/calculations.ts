/**
 * 계산 관련 유틸리티 함수 - 선언형 접근
 */

import { DISCOUNT_POLICIES } from "../constants/discountPolicies";
import { POINTS_POLICIES } from "../constants/pointsPolicies";
import { CartItem } from "../types/cart.types";
import { DiscountPolicy, PointsPolicy } from "../types/promotion.types";
import { calculateTotalDiscount } from "./discounts";
import { calculateTotalPointsEarned } from "./points";

/**
 * 장바구니 아이템의 소계를 계산합니다
 * @param item - 장바구니 아이템
 * @returns 소계 금액
 */
export const calculateItemSubtotal = (item: CartItem): number =>
  item.product.price * item.quantity;

/**
 * 장바구니 아이템의 할인 금액을 계산합니다
 * @param item - 장바구니 아이템
 * @returns 할인 금액
 */
export const calculateItemDiscount = (item: CartItem): number =>
  calculateItemSubtotal(item) * (item.discount / 100);

/**
 * 장바구니 아이템의 포인트를 계산합니다
 * @param item - 장바구니 아이템
 * @returns 포인트
 */
export const calculateItemPoints = (item: CartItem): number =>
  Math.floor(calculateItemSubtotal(item) * 0.001);

/**
 * 장바구니 총계를 계산합니다 - 선언형 접근
 * @param items - 장바구니 아이템 배열
 * @returns 총계 정보
 */
export const calculateCartTotals = (items: CartItem[]) => {
  const calculations = {
    subtotal: () =>
      items.reduce((sum, item) => sum + calculateItemSubtotal(item), 0),
    discount: () =>
      items.reduce((sum, item) => sum + calculateItemDiscount(item), 0),
    points: () =>
      items.reduce((sum, item) => sum + calculateItemPoints(item), 0),
    itemCount: () => items.reduce((sum, item) => sum + item.quantity, 0),
  };

  const subtotal = calculations.subtotal();
  const discount = calculations.discount();

  return {
    subtotal,
    discount,
    total: subtotal - discount,
    points: calculations.points(),
    itemCount: calculations.itemCount(),
  };
};

/**
 * 할인 금액을 계산합니다 - 선언형 접근
 * @param totalAmount - 총 구매 금액
 * @param policies - 할인 정책 배열
 * @returns 할인 금액
 */
export const calculateDiscount = (
  totalAmount: number,
  policies: DiscountPolicy[] = DISCOUNT_POLICIES,
): number => calculateTotalDiscount(totalAmount, policies);

/**
 * 포인트 적립을 계산합니다 - 선언형 접근
 * @param totalAmount - 총 구매 금액
 * @param policies - 포인트 정책 배열
 * @returns 포인트 적립
 */
export const calculatePoints = (
  totalAmount: number,
  policies: PointsPolicy[] = POINTS_POLICIES,
): number => calculateTotalPointsEarned(totalAmount, policies);

/**
 * 세율을 계산합니다 - 선언형 접근
 * @param amount - 금액
 * @param taxRate - 세율 (0.1 = 10%)
 * @returns 세금
 */
export const calculateTax = (amount: number, taxRate: number = 0.1): number =>
  Math.floor(amount * taxRate);

/**
 * 배송비를 계산합니다 - 선언형 접근
 * @param subtotal - 소계 금액
 * @param freeShippingThreshold - 무료 배송 임계값
 * @param shippingCost - 기본 배송비
 * @returns 배송비
 */
export const calculateShippingCost = (
  subtotal: number,
  freeShippingThreshold: number = 50000,
  shippingCost: number = 3000,
): number => (subtotal >= freeShippingThreshold ? 0 : shippingCost);

/**
 * 최종 결제 금액을 계산합니다 - 선언형 접근
 * @param subtotal - 소계 금액
 * @param discount - 할인 금액
 * @param tax - 세금
 * @param shipping - 배송비
 * @returns 최종 결제 금액
 */
export const calculateFinalAmount = (
  subtotal: number,
  discount: number = 0,
  tax: number = 0,
  shipping: number = 0,
): number => subtotal - discount + tax + shipping;
