// src/advanced/types.ts

export interface Product {
  id: string;
  name: string;
  val: number; // 현재 가격
  originalVal: number; // 원래 가격
  q: number; // 재고
  onSale: boolean; // 번개세일 적용 여부
  suggestSale: boolean; // 추천할인 적용 여부
}

export interface CartItem {
  id: string;
  quantity: number;
}

export interface DiscountInfo {
  name: string;
  discount: number; // 할인율 (e.g., 10 for 10%)
}

export interface Discounts {
  totalDiscount: number; // 총 할인 금액
  itemDiscounts: DiscountInfo[];
  bulkDiscountRate: number; // 전체 수량 할인율 (e.g., 0.25 for 25%)
}

export interface Points {
  finalPoints: number;
  pointsDetail: string[];
}
