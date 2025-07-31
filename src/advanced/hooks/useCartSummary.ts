import {
  CART_TOTAL_DISCOUNT_RATE,
  CART_TOTAL_DISCOUNT_THRESHOLD,
  PER_ITEM_DISCOUNT_RATES,
  PER_ITEM_DISCOUNT_THRESHOLD,
  TUESDAY_DISCOUNT_RATE,
} from '@/const/discount';
import { useCartContext } from '@/store/CartContext';
import { isTuesday } from '@/utils/dateUtil';

import { useCartWithProduct } from './useCartWithProducts';

// 할인 내역 타입
type ItemDiscount = {
  name: string;
  discount: number; // 퍼센트 단위 (예: 10%)
};

// 1단계 할인 결과 타입
type ItemDiscountResult = {
  subTotal: number;
  totalAfterItemDiscount: number;
  appliedItemDiscounts: ItemDiscount[];
};

// 2단계 할인 결과 타입
type TotalDiscountResult = {
  finalTotal: number;
  finalDiscountRate: number; // 퍼센트 (예: 0.2는 20%)
  itemDiscounts: ItemDiscount[];
};

export const useCartSummary = () => {
  const { cartItems } = useCartWithProduct();
  const { cartTotalCount } = useCartContext();

  const applyItemDiscount = (): ItemDiscountResult => {
    return cartItems.reduce<ItemDiscountResult>(
      (result, { discountPrice, id, name, quantity: cartQuantity }) => {
        const itemTotalPrice = discountPrice * cartQuantity;

        let discountRate = 0;
        if (cartQuantity >= PER_ITEM_DISCOUNT_THRESHOLD) {
          // @ts-ignore
          discountRate = PER_ITEM_DISCOUNT_RATES[id] ?? 0;
        }

        if (discountRate > 0) {
          result.appliedItemDiscounts.push({
            name,
            discount: discountRate * 100, // 퍼센트 단위로 표기
          });
        }

        result.subTotal += itemTotalPrice;
        result.totalAfterItemDiscount += itemTotalPrice * (1 - discountRate);

        return result;
      },
      { subTotal: 0, totalAfterItemDiscount: 0, appliedItemDiscounts: [] }
    );
  };

  const applyTotalDiscount = (itemDiscountResult: ItemDiscountResult): TotalDiscountResult => {
    const { subTotal, totalAfterItemDiscount, appliedItemDiscounts } = itemDiscountResult;
    const totalItemCount = cartTotalCount;

    let finalTotal = totalAfterItemDiscount;
    let finalDiscountRate = subTotal === 0 ? 0 : (subTotal - finalTotal) / subTotal;

    if (totalItemCount >= CART_TOTAL_DISCOUNT_THRESHOLD) {
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
      itemDiscounts: totalItemCount >= CART_TOTAL_DISCOUNT_THRESHOLD ? [] : appliedItemDiscounts,
    };
  };

  return {
    applyItemDiscount,
    applyTotalDiscount,
  };
};
