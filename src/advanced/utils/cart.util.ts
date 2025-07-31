import { CartItem } from '@/advanced/types/cart.type';

export function getCartTotalCount(cartItems: CartItem[]): number {
  return cartItems.reduce((acc, item) => acc + item.quantity, 0);
}
