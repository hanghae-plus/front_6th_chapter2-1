import { CART_TOTAL_DISCOUNT_THRESHOLD } from '@/const/discount';
import { useCartContext } from '@/store/CartContext';
import {
  applyItemDiscount,
  applyTotalDiscount,
  ItemDiscountResult,
  TotalDiscountResult,
} from '@/usecase/applyDiscount';
import { calculateBonusPoints } from '@/usecase/calculateBonusPoints';

import { useCartWithProduct } from './useCartWithProducts';

export default () => {
  const { cartItems } = useCartWithProduct();
  const { cartTotalCount } = useCartContext();

  const itemDiscount: ItemDiscountResult = applyItemDiscount(cartItems);
  const totalDiscount: TotalDiscountResult = applyTotalDiscount(itemDiscount, cartTotalCount);
  const bonusPoints = calculateBonusPoints(cartItems, totalDiscount.finalTotal);

  const isAppliedItemDiscount = !!totalDiscount.itemDiscounts.length;
  const isAppliedTotalDiscount = cartTotalCount >= CART_TOTAL_DISCOUNT_THRESHOLD;
  const isAppliedDiscount = isAppliedItemDiscount || isAppliedTotalDiscount;

  return {
    subTotal: itemDiscount.subTotal,
    totalAfterItemDiscount: itemDiscount.totalAfterItemDiscount,
    finalTotal: totalDiscount.finalTotal,
    finalDiscountRate: totalDiscount.finalDiscountRate,
    appliedItemDiscountList: totalDiscount.itemDiscounts,
    isAppliedItemDiscount,
    isAppliedTotalDiscount,
    isAppliedDiscount,
    bonusPoints,
  };
};
