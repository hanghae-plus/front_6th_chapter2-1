/**
 * 기본 비즈니스 엔티티 타입 정의
 */

// 상품 엔티티
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  stock: number;
  isOnSale: boolean;
  isSuggestedSale: boolean;
}

// 장바구니 아이템 엔티티
export interface CartItem {
  id: string;
  quantity: number;
}

// 할인 정보 엔티티
export interface DiscountInfo {
  name: string;
  discountPercent: number;
}

// 재고 상태 엔티티
export interface StockStatus {
  isLow: boolean;
  isWarning: boolean;
  message: string;
}
