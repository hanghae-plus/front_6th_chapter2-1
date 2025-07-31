// 할인 관련 타입
export interface DiscountInfo {
  name: string;
  discount: number;
}

// 포인트 관련 타입
export interface PointInfo {
  basePoints: number;
  finalPoints: number;
  details: string[];
}

// 주문 요약 타입
export interface OrderSummary {
  subtotal: number;
  totalAmount: number;
  itemCount: number;
  discountRate: number;
  savedAmount: number;
  itemDiscounts: DiscountInfo[];
  points: PointInfo;
}

export type Nullable<T> = T | null;
