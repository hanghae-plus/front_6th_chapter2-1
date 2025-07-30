import { DISCOUNT_RATE_LIST } from '@/advanced/data/discount.data';
import { MIN_QUANTITY_FOR_DISCOUNT } from '@/advanced/data/quantity.data';
import { CartItem } from '@/advanced/types/cart.type';

export function getSuperSaleRate(): number {
  return 50;
}

export function getDiscountRateLightning(): number {
  return 20;
}

export function getDiscountRateSuggestion(): number {
  return 10;
}

export function getBasicDiscountRate(cartItem: CartItem): number {
  return cartItem.quantity >= MIN_QUANTITY_FOR_DISCOUNT ? DISCOUNT_RATE_LIST[cartItem.id] : 0;
}
