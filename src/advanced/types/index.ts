export interface Product {
  id: string;
  name: string;
  val: number;
  originalVal: number;
  availableStock: number;
  onSale: boolean;
  suggestSale: boolean;
}

export interface CartItem {
  id: string;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
  bonusPoints: number;
  lastSelected: string | null;
}

export interface DiscountInfo {
  rate: number;
  savedAmount: number;
  details: Array<{
    name: string;
    discount: number;
  }>;
}

export interface StockWarning {
  productName: string;
  stock: number;
  isOutOfStock: boolean;
}
