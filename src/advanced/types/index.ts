export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number;
  isOnSale: boolean;
  isRecommended: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface CartTotals {
  totalItemCount: number;
  subTotalBeforeDiscount: number;
  subTotalAfterDiscount: number;
  itemDiscounts: Array<{ name: string; discount: number }>;
}

export interface BonusPoints {
  finalPoints: number;
  pointsDetail: string[];
}

export interface CartUIProps {
  cartItems: CartItem[];
  productList: Product[];
  itemDiscounts: Array<{ name: string; discount: number }>;
  totalItemCount: number;
  subTotalBeforeDiscount: number;
  subTotalAfterDiscount: number;
  discountRate: number;
  isTuesday: boolean;
}

export interface IntervalEventConfig {
  action: () => void;
  delay?: number;
  interval?: number;
}
