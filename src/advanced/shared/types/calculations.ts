/**
 * 계산 관련 타입 정의
 * 장바구니 계산, 할인, 포인트 계산 등
 */
import type { DiscountInfo } from './entities';

// 장바구니 요약 정보
export interface CartSummary {
  subtotal: number;
  totalQuantity: number;
  discountedTotal: number;
  individualDiscountInfo: DiscountInfo[];
}

// 장바구니 전체 계산 결과
export interface CartCalculation {
  subtotal: number;
  finalAmount: number;
  totalQuantity: number;
  totalDiscountRate: number;
  isTuesdayToday: boolean;
  individualDiscountInfo: DiscountInfo[];
}

// 대량 할인 결과
export interface BulkDiscountResult {
  finalAmount: number;
  totalDiscountRate: number;
  isTuesdayToday: boolean;
}

// 통합 계산 결과 (서비스용)
export interface CalculatedTotals {
  itemCount: number;
  totalAmount: number;
  subtotal: number;
  discountInfo: DiscountInfo[];
  isTuesdaySpecial: boolean;
  bonusPoints: number;
  pointsDetails: string[];
}
