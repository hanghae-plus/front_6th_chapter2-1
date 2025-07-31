import { DISCOUNT_RATE_LIST } from '@/advanced/data/discount.data';

export function getBasicDiscountRate(productId: string): number {
  return DISCOUNT_RATE_LIST[productId];
}

export function getDiscountedPrice(originalPrice: number, discountRate: number): number {
  return Math.round((originalPrice * (100 - discountRate)) / 100);
}
