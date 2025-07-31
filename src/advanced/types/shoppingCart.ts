import type { CartItem } from './orderSummary';
import type { Product } from './product';

export interface ShoppingCartProps {
  products: Product[];
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}
