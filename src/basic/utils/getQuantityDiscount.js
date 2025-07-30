import { DISCOUNT_RATE, DISCOUNT_THRESHOLD } from '../html/constants/constants';

// 10개 이상 구매 시 할인율 적용
export const getQuantityDiscount = (productId, quantity) => {
  if (quantity < DISCOUNT_THRESHOLD.BULK) return 0;
  return DISCOUNT_RATE.BULK[productId] || 0;
};
