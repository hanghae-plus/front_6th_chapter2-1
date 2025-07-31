export interface Product {
  id: string;
  name: string;
  val: number;
  originalVal: number;
  q: number;
  onSale: boolean;
  suggestSale: boolean;
}

export interface CartItem {
  id: string;
  quantity: number;
}

export interface DiscountInfo {
  name: string;
  discount: number;
}

export interface LoyaltyPoints {
  basePoints: number;
  finalPoints: number;
  pointsDetail: string[];
} 