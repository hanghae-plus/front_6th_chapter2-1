import { PRODUCT_IDS } from './products';

/**
 * 개별 상품 할인
 * 모두 퍼센트 단위 (0.1 === 10%)
 */
export const DISCOUNT_RATES = {
  [PRODUCT_IDS.KEYBOARD]: 0.1,
  [PRODUCT_IDS.MOUSE]: 0.15,
  [PRODUCT_IDS.MONITOR_ARM]: 0.2,
  [PRODUCT_IDS.LAPTOP_POUCH]: 0.05,
  [PRODUCT_IDS.SPEAKER]: 0.25,
};

/**
 * 30개 이상 주문 시 25퍼센트 할인
 * 화요일 10퍼센트 할인 추가
 * 번개 세일 20퍼센트 할인
 * 추천 할인 5퍼센트 할인
 */

export const DISCOUNT_RULES = {
  BULK_DISCOUNT_RATE: 0.25,
  TUESDAY_DISCOUNT_RATE: 0.1,
  LIGHTNING_SALE_RATE: 0.2,
  SUGGEST_SALE_RATE: 0.05,
};
