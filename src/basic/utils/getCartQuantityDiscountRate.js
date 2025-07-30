import { DISCOUNT_RATE, DISCOUNT_THRESHOLD } from '../html/constants/constants';

export const getCartQuantityDiscountRate = (quantity) => {
  return quantity >= DISCOUNT_THRESHOLD.TOTAL ? DISCOUNT_RATE.TOTAL : 0;
};
