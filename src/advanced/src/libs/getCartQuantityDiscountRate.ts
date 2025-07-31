import { DISCOUNT_RATE, DISCOUNT_THRESHOLD } from '../constants';

export const getCartQuantityDiscountRate = (quantity: number) => {
  return quantity >= DISCOUNT_THRESHOLD.TOTAL ? DISCOUNT_RATE.TOTAL : 0;
};
