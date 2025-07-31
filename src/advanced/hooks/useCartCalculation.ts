// src/hooks/useCartCalculations.ts
import { useMemo } from 'react';

import {
  DISCOUNT_RATES,
  LOYALTY_POINTS,
  PRODUCT_FIVE,
  PRODUCT_ONE,
  PRODUCT_THREE,
  PRODUCT_TWO,
} from '../constants';
import { CartItem, ItemDiscount, Product } from '../types';

interface UseCartCalculationsResult {
  totalAmt: number;
  subtotal: number;
  discountRate: number;
  savedAmount: number;
  loyaltyPoints: number;
  itemDiscounts: ItemDiscount[];
  isTuesday: boolean;
}

export const useCartCalculations = (
  cartItems: CartItem[],
  products: Product[],
  itemCnt: number
): UseCartCalculationsResult => {
  const { totalAmt, subtotal, discountRate, savedAmount, loyaltyPoints, itemDiscounts, isTuesday } =
    useMemo(() => {
      let currentSubtotal = 0;
      let currentTotalAmt = 0;
      const currentItemDiscounts: ItemDiscount[] = [];
      const today = new Date();
      const calculatedIsTuesday = today.getDay() === 2; // 화요일: 2 (0: 일요일, 1: 월요일...)

      // 각 장바구니 아이템의 가격 계산
      cartItems.forEach((cartItem) => {
        const product = products.find((p) => p.id === cartItem.id);
        if (product) {
          const itemTotal = product.val * cartItem.quantity;
          currentSubtotal += itemTotal;
          let discRate = 0;

          if (cartItem.quantity >= 10) {
            switch (product.id) {
              case PRODUCT_ONE:
                discRate = DISCOUNT_RATES.PRODUCT_ONE_BULK;
                break;
              case PRODUCT_TWO:
                discRate = DISCOUNT_RATES.PRODUCT_TWO_BULK;
                break;
              case PRODUCT_THREE:
                discRate = DISCOUNT_RATES.PRODUCT_THREE_BULK;
                break;
              case PRODUCT_FIVE:
                discRate = DISCOUNT_RATES.PRODUCT_FIVE_BULK;
                break;
            }
            if (discRate > 0) {
              currentItemDiscounts.push({ name: product.name, discount: discRate * 100 });
            }
          }
          currentTotalAmt += itemTotal * (1 - discRate);
        }
      });

      let currentDiscountRate = (currentSubtotal - currentTotalAmt) / currentSubtotal || 0;

      // 전체 수량 할인 (30개 이상)
      if (itemCnt >= DISCOUNT_RATES.TOTAL_BULK_THRESHOLD) {
        currentTotalAmt = currentSubtotal * (1 - DISCOUNT_RATES.TOTAL_BULK_RATE);
        currentDiscountRate = DISCOUNT_RATES.TOTAL_BULK_RATE;
      }

      // 화요일 스페셜 할인
      if (calculatedIsTuesday && currentTotalAmt > 0) {
        currentTotalAmt = currentTotalAmt * (1 - DISCOUNT_RATES.TUESDAY_SPECIAL_RATE);
        currentDiscountRate = 1 - currentTotalAmt / currentSubtotal;
      }

      const currentSavedAmount = currentSubtotal - currentTotalAmt;

      // 포인트 계산 로직
      const basePoints = Math.floor(currentTotalAmt * LOYALTY_POINTS.BASE_RATE);
      let finalPoints = basePoints;

      // 화요일 2배 포인트
      if (calculatedIsTuesday) {
        finalPoints *= LOYALTY_POINTS.TUESDAY_MULTIPLIER;
      }

      // 키보드+마우스, 풀세트 여부 확인
      const hasKeyboard = cartItems.some((item) => item.id === PRODUCT_ONE);
      const hasMouse = cartItems.some((item) => item.id === PRODUCT_TWO);
      const hasMonitorArm = cartItems.some((item) => item.id === PRODUCT_THREE);

      if (hasKeyboard && hasMouse) {
        finalPoints += LOYALTY_POINTS.KEYBOARD_MOUSE_BONUS;
      }
      if (hasKeyboard && hasMouse && hasMonitorArm) {
        finalPoints += LOYALTY_POINTS.FULL_SET_BONUS;
      }

      // 수량별 추가 포인트
      if (itemCnt >= LOYALTY_POINTS.BULK_THRESHOLD_30) {
        finalPoints += LOYALTY_POINTS.BULK_BONUS_30;
      } else if (itemCnt >= LOYALTY_POINTS.BULK_THRESHOLD_20) {
        finalPoints += LOYALTY_POINTS.BULK_BONUS_20;
      } else if (itemCnt >= LOYALTY_POINTS.BULK_THRESHOLD_10) {
        finalPoints += LOYALTY_POINTS.BULK_BONUS_10;
      }

      return {
        totalAmt: currentTotalAmt,
        subtotal: currentSubtotal,
        discountRate: currentDiscountRate,
        savedAmount: currentSavedAmount,
        loyaltyPoints: finalPoints,
        itemDiscounts: currentItemDiscounts,
        isTuesday: calculatedIsTuesday,
      };
    }, [cartItems, products, itemCnt]);

  return { totalAmt, subtotal, discountRate, savedAmount, loyaltyPoints, itemDiscounts, isTuesday };
};
