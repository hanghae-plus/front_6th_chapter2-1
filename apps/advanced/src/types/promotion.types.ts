/**
 * 프로모션 관련 타입 정의
 */

export interface DiscountPolicy {
  id: string;
  type: "percentage" | "fixed";
  value: number;
  minAmount?: number;
  maxDiscount?: number;
  description: string;
}

export interface PointsPolicy {
  id: string;
  earnRate: number;
  minPurchase: number;
  maxPoints?: number;
  description: string;
}

export interface SpecialDiscount {
  rate: number;
  threshold?: number;
  description: string;
}

export interface DiscountRules {
  bulkOverridesIndividual: boolean;
  minQuantityForIndividualDiscount: number;
  tuesdayAppliesAfterOtherDiscounts: boolean;
}

export interface PointsCalculation {
  basePoints: number;
  finalPoints: number;
  details: string[];
}

export interface BonusCondition {
  threshold: number;
  points: number;
  description: string;
}

export interface DiscountInfo {
  rate: number;
  type: string;
  description: string;
  baseDiscount: number;
  tuesdayDiscount: number;
  isBulkOverride: boolean;
  isSpecial?: boolean;
}

export interface DiscountUIInfo {
  percentage: number;
  displayText: string;
  type: string;
  isSpecial: boolean;
}
