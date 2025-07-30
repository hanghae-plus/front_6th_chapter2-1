/**
 * 상품 관련 타입 정의
 */

export interface Product {
  id: string;
  name: string;
  val: number;
  originalVal: number;
  q: number;
  onSale: boolean;
  suggestSale: boolean;
}

export interface ProductOption {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  stock: number;
  isOnSale: boolean;
  isSuggestedSale: boolean;
  isOutOfStock: boolean;
  isLowStock: boolean;
}

export interface StockStatus {
  totalStock: number;
  lowStockProducts: Product[];
  outOfStockProducts: Product[];
  hasStockWarning: boolean;
}