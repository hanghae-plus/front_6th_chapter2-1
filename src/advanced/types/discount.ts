// ============== 할인 관련 타입 ==============

export interface DiscountInfo {
  rate: number;
  amount: number;
  type: 'individual' | 'bulk' | 'tuesday' | 'lightning' | 'suggested' | 'super';
  description: string;
}

export interface DiscountPolicy {
  BULK_PURCHASE_THRESHOLD: number;
  BULK_PURCHASE_RATE: number;
  INDIVIDUAL_DISCOUNT_THRESHOLD: number;
  TUESDAY_DISCOUNT_RATE: number;
  LIGHTNING_SALE_RATE: number;
  SUGGESTED_SALE_RATE: number;
  SUPER_SALE_RATE: number;
}

export interface ProductDiscountRate {
  [productId: string]: number;
} 