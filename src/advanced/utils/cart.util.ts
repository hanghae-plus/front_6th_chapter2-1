import { CartItem } from "@/advanced/types";

export function getCartTotalCount(cartItems: CartItem[]): number {
  return cartItems.reduce((acc, item) => acc + item.quantity, 0);
}
