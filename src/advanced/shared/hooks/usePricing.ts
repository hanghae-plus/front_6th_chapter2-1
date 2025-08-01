/**
 * 가격 계산 로직을 처리하는 Custom Hook
 */

import { useMemo } from 'react';
import { CartItem, Product, Discount, UsePricingReturn } from '../types';
import { BUSINESS_CONSTANTS, PRODUCT_IDS } from '../constants';

// 기본 소계 계산
const calculateSubtotal = (cartItems: CartItem[]): number => {
  return cartItems.reduce((sum, item) => {
    return sum + (item.product.originalVal * item.quantity);
  }, 0);
};

// 개별 상품 할인 계산
const calculateIndividualDiscounts = (cartItems: CartItem[]): Discount[] => {
  const discounts: Discount[] = [];
  
  cartItems.forEach(item => {
    if (item.quantity >= BUSINESS_CONSTANTS.BULK_DISCOUNT_THRESHOLD) {
      let discountRate = 0;
      let discountName = '';

      switch (item.product.id) {
        case PRODUCT_IDS.KEYBOARD:
          discountRate = BUSINESS_CONSTANTS.KEYBOARD_DISCOUNT;
          discountName = '키보드 대량구매 할인';
          break;
        case PRODUCT_IDS.MOUSE:
          discountRate = BUSINESS_CONSTANTS.MOUSE_DISCOUNT;
          discountName = '마우스 대량구매 할인';
          break;
        case PRODUCT_IDS.MONITOR_ARM:
          discountRate = BUSINESS_CONSTANTS.MONITOR_ARM_DISCOUNT;
          discountName = '모니터암 대량구매 할인';
          break;
        case PRODUCT_IDS.LAPTOP_POUCH:
          discountRate = BUSINESS_CONSTANTS.LAPTOP_POUCH_DISCOUNT;
          discountName = '노트북파우치 대량구매 할인';
          break;
        case PRODUCT_IDS.SPEAKER:
          discountRate = BUSINESS_CONSTANTS.SPEAKER_DISCOUNT;
          discountName = '스피커 대량구매 할인';
          break;
      }

      if (discountRate > 0) {
        const discountAmount = Math.round(item.product.originalVal * item.quantity * discountRate);
        discounts.push({
          type: 'individual',
          name: discountName,
          rate: discountRate,
          amount: discountAmount,
          description: `${item.quantity}개 구매로 ${Math.round(discountRate * 100)}% 할인`,
        });
      }
    }
  });
  
  return discounts;
};

// 전체 수량 할인 계산
const calculateBulkDiscount = (cartItems: CartItem[], totalAmount: number): Discount | null => {
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  if (totalQuantity >= BUSINESS_CONSTANTS.BULK_QUANTITY_THRESHOLD) {
    const bulkDiscountAmount = Math.round(totalAmount * BUSINESS_CONSTANTS.BULK_QUANTITY_DISCOUNT_RATE);
    return {
      type: 'bulk',
      name: '대량구매 할인',
      rate: BUSINESS_CONSTANTS.BULK_QUANTITY_DISCOUNT_RATE,
      amount: bulkDiscountAmount,
      description: `${totalQuantity}개 구매로 25% 할인`,
    };
  }
  
  return null;
};

// 화요일 할인 계산
const calculateTuesdayDiscount = (totalAmount: number): Discount | null => {
  const today = new Date();
  
  if (today.getDay() === BUSINESS_CONSTANTS.TUESDAY_DAY_OF_WEEK) {
    const tuesdayDiscountAmount = Math.round(totalAmount * BUSINESS_CONSTANTS.TUESDAY_DISCOUNT_RATE);
    return {
      type: 'tuesday',
      name: '화요일 특별 할인',
      rate: BUSINESS_CONSTANTS.TUESDAY_DISCOUNT_RATE,
      amount: tuesdayDiscountAmount,
      description: '매주 화요일 10% 추가 할인',
    };
  }
  
  return null;
};

// 번개세일 할인 계산
const calculateLightningDiscount = (cartItems: CartItem[]): Discount | null => {
  const lightningDiscountAmount = cartItems.reduce((sum, item) => {
    if (item.product.onSale) {
      const originalTotal = item.product.originalVal * item.quantity;
      const discountedTotal = item.product.val * item.quantity;
      return sum + (originalTotal - discountedTotal);
    }
    return sum;
  }, 0);

  if (lightningDiscountAmount > 0) {
    return {
      type: 'lightning',
      name: '번개세일 할인',
      rate: BUSINESS_CONSTANTS.LIGHTNING_SALE_DISCOUNT_RATE,
      amount: lightningDiscountAmount,
      description: '번개세일 20% 할인',
    };
  }
  
  return null;
};

// 추천할인 계산
const calculateSuggestedDiscount = (cartItems: CartItem[]): Discount | null => {
  const suggestedDiscountAmount = cartItems.reduce((sum, item) => {
    if (item.product.suggestSale && !item.product.onSale) {
      const originalTotal = item.product.originalVal * item.quantity;
      const discountedTotal = item.product.val * item.quantity;
      return sum + (originalTotal - discountedTotal);
    }
    return sum;
  }, 0);

  if (suggestedDiscountAmount > 0) {
    return {
      type: 'suggested',
      name: '추천상품 할인',
      rate: BUSINESS_CONSTANTS.SUGGESTED_SALE_DISCOUNT_RATE,
      amount: suggestedDiscountAmount,
      description: '추천상품 5% 할인',
    };
  }
  
  return null;
};

// 실제 총액 계산 (프로모션 적용된 가격)
const calculateActualTotal = (cartItems: CartItem[]): number => {
  return cartItems.reduce((sum, item) => {
    return sum + (item.product.val * item.quantity);
  }, 0);
};

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