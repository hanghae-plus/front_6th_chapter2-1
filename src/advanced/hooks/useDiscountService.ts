import { useMemo } from "react";
import { DISCOUNT_THRESHOLDS, DISCOUNT_RATES } from "../constants";
import type { CartItem } from "../types";

interface DiscountResult {
  finalTotal: number;
  originalTotal: number;
  discountRate: number;
  itemDiscounts: Array<{
    name: string;
    discount: number;
  }>;
  isTuesday: boolean;
}

export function useDiscountService(
  cartItems: CartItem[],
  isTuesday: boolean = false
) {
  const discountResult = useMemo((): DiscountResult => {
    const subtotal = cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );

    const itemCount = cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );

    let finalAmount = subtotal;
    const originalAmount = subtotal;
    const itemDiscounts: Array<{ name: string; discount: number }> = [];

    // 대량구매 할인 (30개 이상)
    if (itemCount >= DISCOUNT_THRESHOLDS.BULK_DISCOUNT) {
      finalAmount = finalAmount * (1 - DISCOUNT_RATES.BULK);
    } else {
      // 개별 상품 할인
      cartItems.forEach((item) => {
        if (item.quantity >= DISCOUNT_THRESHOLDS.INDIVIDUAL_DISCOUNT) {
          let discountRate = 0;

          switch (item.product.id) {
            case "p1":
              discountRate = DISCOUNT_RATES.INDIVIDUAL.KEYBOARD;
              break;
            case "p2":
              discountRate = DISCOUNT_RATES.INDIVIDUAL.MOUSE;
              break;
            case "p3":
              discountRate = DISCOUNT_RATES.INDIVIDUAL.MONITOR_ARM;
              break;
            case "p4":
              discountRate = DISCOUNT_RATES.INDIVIDUAL.LAPTOP_POUCH;
              break;
            case "p5":
              discountRate = DISCOUNT_RATES.INDIVIDUAL.SPEAKER;
              break;
          }

          if (discountRate > 0) {
            const itemTotal = item.product.price * item.quantity;
            const discount = itemTotal * discountRate;
            finalAmount -= discount;

            itemDiscounts.push({
              name: item.product.name,
              discount: Math.round(discountRate * 100),
            });
          }
        }
      });
    }

    // 화요일 추가 할인
    if (isTuesday && finalAmount > 0) {
      finalAmount = finalAmount * (1 - DISCOUNT_RATES.TUESDAY);
    }

    const totalDiscountRate =
      originalAmount > 0 ? (originalAmount - finalAmount) / originalAmount : 0;

    return {
      finalTotal: Math.max(0, finalAmount),
      originalTotal: originalAmount,
      discountRate: totalDiscountRate,
      itemDiscounts,
      isTuesday,
    };
  }, [cartItems, isTuesday]);

  return discountResult;
}

// 개별 할인 계산 함수
export function calculateTotalDiscount(
  subtotal: number,
  cartItems: CartItem[],
  isTuesday: boolean = false
) {
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  let finalAmount = subtotal;
  const itemDiscounts: Array<{ name: string; discount: number }> = [];

  // 대량구매 할인 (30개 이상)
  if (itemCount >= DISCOUNT_THRESHOLDS.BULK_DISCOUNT) {
    finalAmount = finalAmount * (1 - DISCOUNT_RATES.BULK);
  } else {
    // 개별 상품 할인
    cartItems.forEach((item) => {
      if (item.quantity >= DISCOUNT_THRESHOLDS.INDIVIDUAL_DISCOUNT) {
        let discountRate = 0;

        switch (item.product.id) {
          case "p1":
            discountRate = DISCOUNT_RATES.INDIVIDUAL.KEYBOARD;
            break;
          case "p2":
            discountRate = DISCOUNT_RATES.INDIVIDUAL.MOUSE;
            break;
          case "p3":
            discountRate = DISCOUNT_RATES.INDIVIDUAL.MONITOR_ARM;
            break;
          case "p4":
            discountRate = DISCOUNT_RATES.INDIVIDUAL.LAPTOP_POUCH;
            break;
          case "p5":
            discountRate = DISCOUNT_RATES.INDIVIDUAL.SPEAKER;
            break;
        }

        if (discountRate > 0) {
          const itemTotal = item.product.price * item.quantity;
          const discount = itemTotal * discountRate;
          finalAmount -= discount;

          itemDiscounts.push({
            name: item.product.name,
            discount: Math.round(discountRate * 100),
          });
        }
      }
    });
  }

  // 화요일 추가 할인
  if (isTuesday && finalAmount > 0) {
    finalAmount = finalAmount * (1 - DISCOUNT_RATES.TUESDAY);
  }

  const totalDiscountRate =
    subtotal > 0 ? (subtotal - finalAmount) / subtotal : 0;

  return {
    finalTotal: Math.max(0, finalAmount),
    originalTotal: subtotal,
    discountRate: totalDiscountRate,
    itemDiscounts,
    isTuesday,
  };
}
