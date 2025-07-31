import { ProductId } from '../product/types';

// 할인 도메인 타입
export interface DiscountId {
  readonly value: string;
}

export interface DiscountRate {
  readonly percentage: number; // 0-100
}

export interface DiscountPeriod {
  readonly startTime: Date;
  readonly endTime?: Date;
}

export enum DiscountType {
  LIGHTNING_SALE = 'LIGHTNING_SALE',
  SUGGESTION = 'SUGGESTION',
  TUESDAY_SPECIAL = 'TUESDAY_SPECIAL',
  BULK_PURCHASE = 'BULK_PURCHASE',
}

export interface Discount {
  readonly id: DiscountId;
  readonly type: DiscountType;
  readonly rate: DiscountRate;
  readonly period: DiscountPeriod;
  readonly targetProductId?: ProductId;
  readonly minimumQuantity?: number;
}

export interface DiscountResult {
  readonly originalAmount: number;
  readonly discountedAmount: number;
  readonly savedAmount: number;
  readonly appliedDiscounts: readonly Discount[];
}

// Value Objects 생성 함수
export const createDiscountId = (value: string): DiscountId => ({ value });
export const createDiscountRate = (percentage: number): DiscountRate => {
  if (percentage < 0 || percentage > 100) {
    throw new Error('Discount rate must be between 0 and 100');
  }
  return { percentage };
};

export const createDiscountPeriod = (
  startTime: Date,
  endTime?: Date
): DiscountPeriod => ({
  startTime,
  endTime,
});
