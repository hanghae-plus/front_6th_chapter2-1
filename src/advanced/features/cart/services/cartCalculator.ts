/**
 * 장바구니 계산 서비스 (TypeScript version)
 * 장바구니 관련 계산 로직 - React 데이터 구조 적용
 */

import { calculateItemDiscountRate } from '@/advanced/features/cart/utils/discountUtils.ts';
import { BUSINESS_CONSTANTS } from '@/advanced/shared/constants/business.ts';
import { PRODUCTS } from '@/advanced/features/product/constants/index.ts';
import { CartItem } from '@/advanced/features/cart/types/index.ts';

export interface CartCalculationResult {
  subtotal: number;
  totalAmount: number;
  totalItemCount: number;
  itemDiscounts: Array<{
    productId: string;
    originalAmount: number;
    discountedAmount: number;
    discountRate: number;
  }>;
  discountRate: number;
  savedAmount: number;
  isTuesday: boolean;
  hasDiscounts: boolean;
}

/**
 * 아이템 총액 계산 (순수 함수)
 */
const calculateItemTotal = (val: number, quantity: number): number => {
  return val * quantity;
};

/**
 * 소계 계산 (순수 함수)
 */
const calculateSubtotal = (cartItems: CartItem[]) => {
  return cartItems.reduce(
    (acc, cartItem) => {
      const itemTotal = calculateItemTotal(cartItem.val, cartItem.quantity);

      return {
        subtotal: acc.subtotal + itemTotal,
        totalItemCount: acc.totalItemCount + cartItem.quantity,
      };
    },
    { subtotal: 0, totalItemCount: 0 },
  );
};

/**
 * 아이템 할인 적용 (순수 함수)
 */
const applyItemDiscounts = (cartItems: CartItem[]) => {
  return cartItems.reduce(
    (acc, cartItem) => {
      const discountRate = calculateItemDiscountRate(
        cartItem.id,
        cartItem.quantity,
        BUSINESS_CONSTANTS,
        PRODUCTS,
      );

      const itemTotal = calculateItemTotal(cartItem.val, cartItem.quantity);
      const discountedTotal = itemTotal * (1 - discountRate);

      return {
        totalAmount: acc.totalAmount + discountedTotal,
        itemDiscounts:
          discountRate > 0
            ? [
                ...acc.itemDiscounts,
                {
                  productId: cartItem.id,
                  originalAmount: itemTotal,
                  discountedAmount: discountedTotal,
                  discountRate,
                },
              ]
            : acc.itemDiscounts,
      };
    },
    { totalAmount: 0, itemDiscounts: [] as Array<any> },
  );
};

/**
 * 화요일 할인 적용 (순수 함수)
 */
const applyTuesdayDiscount = (amount: number) => {
  const isTuesday = new Date().getDay() === 2;
  const { TUESDAY_DISCOUNT_RATE } = BUSINESS_CONSTANTS.DISCOUNT;
  const discountedAmount =
    isTuesday && amount > 0 ? amount * (1 - TUESDAY_DISCOUNT_RATE) : amount;

  return {
    finalAmount: discountedAmount,
    isTuesday,
  };
};

/**
 * 할인율 계산 (순수 함수)
 */
const calculateDiscountRate = (
  subtotal: number,
  finalAmount: number,
): number => {
  return subtotal > 0 ? (subtotal - finalAmount) / subtotal : 0;
};

/**
 * 장바구니 총 계산 (메인 함수) - React 데이터 구조용
 */
export const calculateCartTotals = (
  cartItems: CartItem[],
): CartCalculationResult => {
  if (cartItems.length === 0) {
    return {
      subtotal: 0,
      totalAmount: 0,
      totalItemCount: 0,
      itemDiscounts: [],
      discountRate: 0,
      savedAmount: 0,
      isTuesday: new Date().getDay() === 2,
      hasDiscounts: false,
    };
  }

  const { subtotal, totalItemCount } = calculateSubtotal(cartItems);

  const isBulkPurchase =
    totalItemCount >= BUSINESS_CONSTANTS.DISCOUNT.BULK_DISCOUNT_THRESHOLD;

  const { BULK_DISCOUNT_RATE } = BUSINESS_CONSTANTS.DISCOUNT;
  const amountAfterBulkDiscount = isBulkPurchase
    ? subtotal * (1 - BULK_DISCOUNT_RATE)
    : subtotal;

  const itemDiscountResult = isBulkPurchase
    ? { totalAmount: amountAfterBulkDiscount, itemDiscounts: [] }
    : applyItemDiscounts(cartItems);

  const { finalAmount: afterTuesdayDiscount, isTuesday } = applyTuesdayDiscount(
    itemDiscountResult.totalAmount,
  );

  const discountRate = calculateDiscountRate(subtotal, afterTuesdayDiscount);
  const savedAmount = subtotal - afterTuesdayDiscount;

  return {
    subtotal,
    totalAmount: Math.round(afterTuesdayDiscount),
    totalItemCount,
    itemDiscounts: itemDiscountResult.itemDiscounts,
    discountRate,
    savedAmount: Math.round(savedAmount),
    isTuesday,
    hasDiscounts: discountRate > 0,
  };
};
