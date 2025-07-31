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

  const itemDiscount: ItemDiscountResult = applyItemDiscount(cartItems);
  const totalDiscount: TotalDiscountResult = applyTotalDiscount(itemDiscount, cartItems.length);
  const bonusPoints = calculateBonusPoints(cartItems, totalDiscount.finalTotal);

  return {
    itemDiscount,
    totalDiscount,
    bonusPoints,
  };
};
