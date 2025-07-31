import type { Product } from './product';

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface ItemDiscount {
  name: string;
  discount: number;
}

export interface OrderSummaryResult {
  itemCnt: number;
  subTot: number;
  totalAmt: number;
  discRate: number;
  savedAmount: number;
  itemDiscounts: ItemDiscount[];
  isTuesday: boolean;
  stockMsg: string;
  points: number;
  pointDetails: string;
}

export interface OrderSummaryProps {
  summary: OrderSummaryResult & {
    products: Product[];
    cartItems: CartItem[];
  };
}
