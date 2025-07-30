/**
 * 가격 계산 로직을 처리하는 Custom Hook
 */

import { useMemo } from 'react';
import { CartItem, Product, Discount, UsePricingReturn } from '../types';
import { BUSINESS_CONSTANTS, PRODUCT_IDS } from '../constants';

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
    const subtotal = cartItems.reduce((sum, item) => {
      return sum + (item.product.originalVal * item.quantity);
    }, 0);

    const discounts: Discount[] = [];
    let totalAmount = subtotal;

    // 2. 개별 상품 할인 (10개 이상 구매 시)
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
          totalAmount -= discountAmount;
        }
      }
    });

    // 3. 전체 수량 할인 (30개 이상 구매 시 25% 할인)
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    if (totalQuantity >= BUSINESS_CONSTANTS.BULK_QUANTITY_THRESHOLD) {
      const bulkDiscountAmount = Math.round(totalAmount * BUSINESS_CONSTANTS.BULK_QUANTITY_DISCOUNT_RATE);
      discounts.push({
        type: 'bulk',
        name: '대량구매 할인',
        rate: BUSINESS_CONSTANTS.BULK_QUANTITY_DISCOUNT_RATE,
        amount: bulkDiscountAmount,
        description: `${totalQuantity}개 구매로 25% 할인`,
      });
      totalAmount -= bulkDiscountAmount;
    }

    // 4. 화요일 할인 (10% 추가 할인)
    const today = new Date();
    if (today.getDay() === BUSINESS_CONSTANTS.TUESDAY_DAY_OF_WEEK) {
      const tuesdayDiscountAmount = Math.round(totalAmount * BUSINESS_CONSTANTS.TUESDAY_DISCOUNT_RATE);
      discounts.push({
        type: 'tuesday',
        name: '화요일 특별 할인',
        rate: BUSINESS_CONSTANTS.TUESDAY_DISCOUNT_RATE,
        amount: tuesdayDiscountAmount,
        description: '매주 화요일 10% 추가 할인',
      });
      totalAmount -= tuesdayDiscountAmount;
    }

    // 5. 번개세일 및 추천할인은 이미 상품 가격에 반영되어 있음
    // 실제 할인이 적용된 가격과 원가의 차이 계산
    const lightningDiscountAmount = cartItems.reduce((sum, item) => {
      if (item.product.onSale) {
        const originalTotal = item.product.originalVal * item.quantity;
        const discountedTotal = item.product.val * item.quantity;
        return sum + (originalTotal - discountedTotal);
      }
      return sum;
    }, 0);

    if (lightningDiscountAmount > 0) {
      discounts.push({
        type: 'lightning',
        name: '번개세일 할인',
        rate: 0.2,
        amount: lightningDiscountAmount,
        description: '번개세일 20% 할인',
      });
    }

    const suggestedDiscountAmount = cartItems.reduce((sum, item) => {
      if (item.product.suggestSale && !item.product.onSale) {
        const originalTotal = item.product.originalVal * item.quantity;
        const discountedTotal = item.product.val * item.quantity;
        return sum + (originalTotal - discountedTotal);
      }
      return sum;
    }, 0);

    if (suggestedDiscountAmount > 0) {
      discounts.push({
        type: 'suggested',
        name: '추천상품 할인',
        rate: 0.05,
        amount: suggestedDiscountAmount,
        description: '추천상품 5% 할인',
      });
    }

    // 번개세일/추천할인이 적용된 실제 가격으로 최종 금액 재계산
    const actualTotal = cartItems.reduce((sum, item) => {
      return sum + (item.product.val * item.quantity);
    }, 0);

    // 개별할인과 전체할인을 actualTotal에서 차감
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