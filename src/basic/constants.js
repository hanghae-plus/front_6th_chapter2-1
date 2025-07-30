// ================================================
// 상품 ID 상수
// ================================================
export const KEYBOARD = 'p1';
export const MOUSE = 'p2';
export const MONITOR_ARM = 'p3';
export const NOTEBOOK_CASE = 'p4';
export const SPEAKER = 'p5';

// ================================================
// 할인 관련 상수
// ================================================
export const LIGHTNING_SALE_DISCOUNT = 20; // 번개세일 할인율 (%)
export const SUGGEST_SALE_DISCOUNT = 5; // 추천세일 할인율 (%)
export const TUESDAY_SPECIAL_DISCOUNT = 10; // 화요일 특별 할인율 (%)
export const BULK_PURCHASE_DISCOUNT = 25; // 대량구매 할인율 (%)

// 개별 상품 할인율
export const PRODUCT_DISCOUNTS = {
  [KEYBOARD]: 10, // 키보드
  [MOUSE]: 15, // 마우스
  [MONITOR_ARM]: 20, // 모니터암
  [NOTEBOOK_CASE]: 5, // 노트북 파우치
  [SPEAKER]: 25, // 스피커
};

// ================================================
// 수량 기준 상수
// ================================================
export const INDIVIDUAL_PRODUCT_DISCOUNT_THRESHOLD = 10; // 개별 상품 할인 시작 기준
export const BULK_PURCHASE_THRESHOLD = 30; // 대량구매 할인 시작 기준
export const LOW_STOCK_THRESHOLD = 5; // 재고 부족 경고 기준
export const TOTAL_STOCK_WARNING_THRESHOLD = 50; // 전체 재고 부족 경고 기준

// 포인트 적립 기준 수량
export const BONUS_POINTS_THRESHOLDS = {
  SMALL: 10, // 10개+ = +20p
  MEDIUM: 20, // 20개+ = +50p
  LARGE: 30, // 30개+ = +100p
};

// ================================================
// 포인트 관련 상수
// ================================================
export const BASE_POINTS_RATE = 1000; // 기본 포인트 적립 기준 (원)
export const TUESDAY_POINTS_MULTIPLIER = 2; // 화요일 포인트 배수
export const BONUS_POINTS = {
  KEYBOARD_MOUSE_SET: 50, // 키보드+마우스 세트
  FULL_SET: 100, // 풀세트
  BULK_PURCHASE: {
    SMALL: 20, // 10개+ = +20p
    MEDIUM: 50, // 20개+ = +50p
    LARGE: 100, // 30개+ = +100p
  },
};

// ================================================
// 기타 상수
// ================================================
export const SUGGEST_SALE_INTERVAL = 3000; // 추천 상품 변경 간격 (ms)
