import {
  DiscountPolicy,
  DiscountRules,
  SpecialDiscount
} from '../types/promotion.types';

export const SPECIAL_DISCOUNTS: Record<string, SpecialDiscount> = {
  BULK_PURCHASE: {
    threshold: 30,
    rate: 0.25,
    description: '대량구매 할인 (30개 이상)'
  },
  TUESDAY_SPECIAL: {
    rate: 0.1,
    description: '화요일 추가 할인'
  },
  FLASH_SALE: {
    rate: 0.2,
    description: '번개세일'
  },
  RECOMMENDATION: {
    rate: 0.05,
    description: '추천할인'
  }
} as const;

export const DISCOUNT_RULES: DiscountRules = {
  bulkOverridesIndividual: true, // 대량구매 할인이 개별 할인을 덮어씀
  minQuantityForIndividualDiscount: 10, // 개별 상품 할인 최소 수량
  tuesdayAppliesAfterOtherDiscounts: true // 화요일 할인은 다른 할인 후에 적용
} as const;

export const DISCOUNT_POLICIES: DiscountPolicy[] = [
  {
    id: 'basic-discount',
    type: 'percentage',
    value: 10,
    minAmount: 100000,
    maxDiscount: 50000,
    description: '기본 할인 (10만원 이상)'
  },
  {
    id: 'bulk-purchase',
    type: 'percentage',
    value: 25,
    minAmount: 1000000,
    maxDiscount: 100000,
    description: '대량구매 할인 (30개 이상)'
  },
  {
    id: 'tuesday-special',
    type: 'percentage',
    value: 10,
    minAmount: 500000,
    maxDiscount: 50000,
    description: '화요일 추가 할인'
  }
];
