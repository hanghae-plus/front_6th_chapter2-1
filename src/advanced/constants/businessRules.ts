// 비즈니스 규칙 상수
// 할인 관련 임계값
export const DISCOUNT_THRESHOLDS = {
  INDIVIDUAL_DISCOUNT_MIN_QUANTITY: 10,
  BULK_DISCOUNT_MIN_QUANTITY: 30,
} as const;

// 상품별 할인율 (개별 상품 할인)
export const PRODUCT_DISCOUNT_RATES = {
  KEYBOARD: 0.1, // 10%
  MOUSE: 0.15, // 15%
  MONITOR_ARM: 0.2, // 20%
  LAPTOP_POUCH: 0.05, // 5%
  SPEAKER: 0.25, // 25%
} as const;

// 포인트 관련 임계값
export const POINTS_THRESHOLDS = {
  BULK_BONUS_QUANTITY_1: 10, // 10개 이상
  BULK_BONUS_QUANTITY_2: 20, // 20개 이상
  BULK_BONUS_QUANTITY_3: 30, // 30개 이상
} as const;

// 포인트 보너스 값
export const POINTS_BONUS = {
  BULK_BONUS_1: 20, // 10개 이상 보너스
  BULK_BONUS_2: 50, // 20개 이상 보너스
  BULK_BONUS_3: 100, // 30개 이상 보너스
  KEYBOARD_MOUSE_SET: 50, // 키보드+마우스 세트
  FULL_SET: 100, // 풀세트
} as const;

// 요일 상수
export const DAYS_OF_WEEK = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
} as const;

// 상품 ID 매핑 (가독성을 위한 상수)
export const PRODUCT_IDS = {
  KEYBOARD: 'product1',
  MOUSE: 'product2',
  MONITOR_ARM: 'product3',
  LAPTOP_POUCH: 'product4',
  SPEAKER: 'product5',
} as const;

// 상품 ID별 할인율 매핑
export const PRODUCT_DISCOUNT_MAP = {
  [PRODUCT_IDS.KEYBOARD]: PRODUCT_DISCOUNT_RATES.KEYBOARD,
  [PRODUCT_IDS.MOUSE]: PRODUCT_DISCOUNT_RATES.MOUSE,
  [PRODUCT_IDS.MONITOR_ARM]: PRODUCT_DISCOUNT_RATES.MONITOR_ARM,
  [PRODUCT_IDS.LAPTOP_POUCH]: PRODUCT_DISCOUNT_RATES.LAPTOP_POUCH,
  [PRODUCT_IDS.SPEAKER]: PRODUCT_DISCOUNT_RATES.SPEAKER,
} as const;
