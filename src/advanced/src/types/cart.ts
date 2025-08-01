import { Product } from './product';

export interface CartItem extends Product {
  quantity: number;
}

export interface CartState {
  cartItems: CartItem[];
  lastSelectedProduct: Product | null;
  totals: {
    itemCnt: number;
    amount: number;
    discountRate: number;
  };
}
