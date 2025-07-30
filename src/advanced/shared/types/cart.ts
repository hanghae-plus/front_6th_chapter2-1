/**
 * 장바구니 관련 타입 정의
 */

import { Product } from './product';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  totalAmount: number;
  discounts: Discount[];
}

export interface Discount {
  type: 'individual' | 'bulk' | 'tuesday' | 'lightning' | 'suggested';
  name: string;
  rate: number;
  amount: number;
  description?: string;
}

export interface CartSummary {
  subtotal: number;
  totalAmount: number;
  totalDiscount: number;
  itemCount: number;
  discounts: Discount[];
}