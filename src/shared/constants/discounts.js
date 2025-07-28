/**
 * 할인 관련 상수 정의
 * @description 모든 할인 정책과 관련된 상수들을 중앙 관리
 */

// 할인 임계값
export const DISCOUNT_THRESHOLDS = {
  BULK_DISCOUNT_THRESHOLD: 10,        // 개별 상품 대량구매 임계값
  BULK_QUANTITY_THRESHOLD: 30,        // 전체 수량 대량구매 임계값
};

// 할인율
export const DISCOUNT_RATES = {
  BULK_QUANTITY_DISCOUNT_RATE: 0.25,  // 대량구매 할인율
  TUESDAY_DISCOUNT_RATE: 0.10,        // 화요일 할인율
  LIGHTNING_SALE_RATE: 0.20,          // 번개세일 할인율
  SUGGEST_SALE_RATE: 0.05,            // 추천할인 할인율
};

// 개별 상품 할인율
export const PRODUCT_DISCOUNT_RATES = {
  KEYBOARD_DISCOUNT: 0.10,
  MOUSE_DISCOUNT: 0.15,
  MONITOR_ARM_DISCOUNT: 0.20,
  LAPTOP_POUCH_DISCOUNT: 0.05,
  SPEAKER_DISCOUNT: 0.25,
};

// 특별 할인 조합율
export const SPECIAL_DISCOUNT_RATES = {
  LIGHTNING_SUGGEST_COMBINED: 0.25,   // 번개세일 + 추천할인
};