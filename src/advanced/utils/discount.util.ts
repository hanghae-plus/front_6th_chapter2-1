import { DISCOUNT_RATE_LIST } from '@/advanced/data/discount.data';
import { MIN_QUANTITY_FOR_DISCOUNT } from '@/advanced/data/quantity.data';
import { CartItem } from '@/advanced/types/cart.type';

export function getBasicDiscountRate(cartItem: CartItem): number {
  return cartItem.quantity >= MIN_QUANTITY_FOR_DISCOUNT ? DISCOUNT_RATE_LIST[cartItem.id] : 0;
}

export function getDiscountedPrice(originalPrice: number, discountRate: number): number {
  return Math.round((originalPrice * (100 - discountRate)) / 100);
}
