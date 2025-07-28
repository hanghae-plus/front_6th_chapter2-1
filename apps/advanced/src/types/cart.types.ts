/**
 * 장바구니 관련 타입 정의
 */

import { Product } from "./product.types";

export interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
  discount: number;
  points: number;
}

export interface CartState {
  items: CartItem[];
  totalPrice: number;
  totalDiscount: number;
  totalPoints: number;
  itemCount: number;
}

export interface CartActions {
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export interface CartContextType extends CartState, CartActions {}

export interface CartItemUpdate {
  productId: string;
  quantity: number;
}

export interface CartSummary {
  subtotal: number;
  discount: number;
  total: number;
  points: number;
  itemCount: number;
}
