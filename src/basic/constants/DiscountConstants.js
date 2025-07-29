import { PRODUCT_IDS } from './ProductConstants.js';

// 할인 기준 수량
export const DISCOUNT_THRESHOLDS = {
  INDIVIDUAL_ITEM: 10,
  BULK_PURCHASE: 30,
};

// 할인율 상수
export const DISCOUNT_RATES = {
  // 개별 상품 할인율
  [PRODUCT_IDS.KEYBOARD]: 0.1,
  [PRODUCT_IDS.MOUSE]: 0.15,
  [PRODUCT_IDS.MONITOR_ARM]: 0.2,
  [PRODUCT_IDS.LAPTOP_CASE]: 0.05,
  [PRODUCT_IDS.SPEAKER]: 0.25,

  // 특별 할인율
  BULK_PURCHASE: 0.25,
  TUESDAY: 0.1,
  LIGHTNING_SALE: 0.2,
  RECOMMENDATION: 0.05,
};

// 할인 타입
export const DISCOUNT_TYPES = {
  INDIVIDUAL: 'individual',
  BULK: 'bulk',
  TUESDAY: 'tuesday',
  LIGHTNING: 'lightning',
  RECOMMENDATION: 'recommendation',
  SUPER: 'super', // 번개 + 추천 중복
};
