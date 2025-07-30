/**
 * 비즈니스 로직 관련 타입 정의
 */

export interface BusinessConstants {
  // 할인 관련
  BULK_DISCOUNT_THRESHOLD: number;
  BULK_QUANTITY_THRESHOLD: number;
  BULK_QUANTITY_DISCOUNT_RATE: number;
  TUESDAY_DISCOUNT_RATE: number;

  // 개별 상품 할인율
  KEYBOARD_DISCOUNT: number;
  MOUSE_DISCOUNT: number;
  MONITOR_ARM_DISCOUNT: number;
  LAPTOP_POUCH_DISCOUNT: number;
  SPEAKER_DISCOUNT: number;

  // 재고 관련
  LOW_STOCK_THRESHOLD: number;
  STOCK_WARNING_THRESHOLD: number;

  // 포인트 관련
  POINTS_RATE: number;
  TUESDAY_POINTS_MULTIPLIER: number;

  // UI 관련
  TUESDAY_DAY_OF_WEEK: number;
}

export interface PricingResult {
  subtotal: number;
  totalAmount: number;
  discounts: import('./cart').Discount[];
  itemCount: number;
  totalDiscount: number;
}

export interface DiscountRule {
  type: string;
  condition: (params: any) => boolean;
  calculate: (params: any) => number;
  description: string;
}