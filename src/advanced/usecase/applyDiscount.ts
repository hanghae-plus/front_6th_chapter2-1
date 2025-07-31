import {
  CART_TOTAL_DISCOUNT_RATE,
  CART_TOTAL_DISCOUNT_THRESHOLD,
  PER_ITEM_DISCOUNT_RATES,
  PER_ITEM_DISCOUNT_THRESHOLD,
  TUESDAY_DISCOUNT_RATE,
} from '@/const/discount';
import { isTuesday } from '@/utils/dateUtil';

export type ItemDiscount = {
  name: string;
  discount: number;
};

export type ItemDiscountResult = {
  subTotal: number;
  totalAfterItemDiscount: number;
  appliedItemDiscounts: ItemDiscount[];
};

export type TotalDiscountResult = {
  finalTotal: number;
  finalDiscountRate: number;
  itemDiscounts: ItemDiscount[];
};

export const applyItemDiscount = (
  cartItems: {
    id: string;
    name: string;
    quantity: number;
    discountPrice: number;
  }[]
): ItemDiscountResult => {
  return cartItems.reduce<ItemDiscountResult>(
    (result, { discountPrice, id, name, quantity: cartQuantity }) => {
      const itemTotalPrice = discountPrice * cartQuantity;

      let discountRate = 0;
      if (cartQuantity >= PER_ITEM_DISCOUNT_THRESHOLD) {
        discountRate = PER_ITEM_DISCOUNT_RATES[id as keyof typeof PER_ITEM_DISCOUNT_RATES] ?? 0;
      }

      if (discountRate > 0) {
        result.appliedItemDiscounts.push({
          name,
          discount: discountRate * 100,
        });
      }

      result.subTotal += itemTotalPrice;
      result.totalAfterItemDiscount += itemTotalPrice * (1 - discountRate);

      return result;
    },
    { subTotal: 0, totalAfterItemDiscount: 0, appliedItemDiscounts: [] }
  );
};

export const applyTotalDiscount = (
  itemDiscountResult: ItemDiscountResult,
  cartTotalCount: number
): TotalDiscountResult => {
  const { subTotal, totalAfterItemDiscount, appliedItemDiscounts } = itemDiscountResult;

  let finalTotal = totalAfterItemDiscount;
  let finalDiscountRate = subTotal === 0 ? 0 : (subTotal - finalTotal) / subTotal;

  if (cartTotalCount >= CART_TOTAL_DISCOUNT_THRESHOLD) {
    finalTotal = subTotal * (1 - CART_TOTAL_DISCOUNT_RATE);
    finalDiscountRate = CART_TOTAL_DISCOUNT_RATE;
  }

  if (isTuesday() && finalTotal > 0) {
    finalTotal = finalTotal * (1 - TUESDAY_DISCOUNT_RATE);
    finalDiscountRate = subTotal === 0 ? 0 : 1 - finalTotal / subTotal;
  }

  finalTotal = Math.round(finalTotal);
  finalDiscountRate = Math.round(finalDiscountRate * 100) / 100;

  return {
    finalTotal,
    finalDiscountRate,
    itemDiscounts: cartTotalCount >= CART_TOTAL_DISCOUNT_THRESHOLD ? [] : appliedItemDiscounts,
  };
};
