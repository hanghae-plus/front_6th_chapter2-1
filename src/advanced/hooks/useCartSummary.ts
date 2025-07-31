// hooks/useCartSummary.ts

import { useCartContext } from '@/store/CartContext';
import {
  applyItemDiscount,
  applyTotalDiscount,
  ItemDiscountResult,
  TotalDiscountResult,
} from '@/usecase/applyDiscount';

import { useCartWithProduct } from './useCartWithProducts';

export const useCartSummary = () => {
  const { cartItems } = useCartWithProduct();
  const { cartTotalCount } = useCartContext();

  const itemDiscountResult: ItemDiscountResult = applyItemDiscount(cartItems);
  const totalDiscountResult: TotalDiscountResult = applyTotalDiscount(itemDiscountResult, cartTotalCount);

  return {
    itemDiscountResult,
    totalDiscountResult,
  };
};
