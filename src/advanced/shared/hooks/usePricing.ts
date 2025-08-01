/**
 * 가격 계산 로직을 처리하는 Custom Hook
 */

import { useMemo } from 'react';
import { CartItem, Product, Discount, UsePricingReturn } from '../types';
import {
  calculateSubtotal,
  calculateIndividualDiscounts,
  calculateBulkDiscount,
  calculateTuesdayDiscount,
  calculateLightningDiscount,
  calculateSuggestedDiscount,
  calculateActualTotal,
} from '../utils/pricingCalculations';

export const usePricing = (cartItems: CartItem[], products: Product[]): UsePricingReturn => {
  return useMemo(() => {
    if (cartItems.length === 0) {
      return {
        subtotal: 0,
        totalAmount: 0,
        discounts: [],
        totalDiscount: 0,
      };
    }

    // 1. 기본 소계 계산
    const subtotal = calculateSubtotal(cartItems);
    let totalAmount = subtotal;
    const discounts: Discount[] = [];

    // 2. 개별 상품 할인 계산
    const individualDiscounts = calculateIndividualDiscounts(cartItems);
    discounts.push(...individualDiscounts);
    
    // 개별 할인 금액 차감
    const totalIndividualDiscount = individualDiscounts.reduce((sum, d) => sum + d.amount, 0);
    totalAmount -= totalIndividualDiscount;

    // 3. 전체 수량 할인 계산
    const bulkDiscount = calculateBulkDiscount(cartItems, totalAmount);
    if (bulkDiscount) {
      discounts.push(bulkDiscount);
      totalAmount -= bulkDiscount.amount;
    }

    // 4. 화요일 할인 계산
    const tuesdayDiscount = calculateTuesdayDiscount(totalAmount);
    if (tuesdayDiscount) {
      discounts.push(tuesdayDiscount);
      totalAmount -= tuesdayDiscount.amount;
    }

    // 5. 프로모션 할인 계산 (번개세일, 추천할인)
    const lightningDiscount = calculateLightningDiscount(cartItems);
    if (lightningDiscount) {
      discounts.push(lightningDiscount);
    }

    const suggestedDiscount = calculateSuggestedDiscount(cartItems);
    if (suggestedDiscount) {
      discounts.push(suggestedDiscount);
    }

    // 최종 금액 계산 (프로모션이 적용된 실제 가격 기준)
    const actualTotal = calculateActualTotal(cartItems);
    const individualAndBulkDiscount = discounts
      .filter(d => d.type === 'individual' || d.type === 'bulk' || d.type === 'tuesday')
      .reduce((sum, d) => sum + d.amount, 0);

    const finalAmount = Math.max(0, actualTotal - individualAndBulkDiscount);
    const totalDiscountAmount = subtotal - finalAmount;

    return {
      subtotal,
      totalAmount: finalAmount,
      discounts,
      totalDiscount: totalDiscountAmount,
    };
  }, [cartItems, products]);
};