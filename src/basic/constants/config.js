// ==========================================
// 애플리케이션 설정 상수들
// ==========================================

// 타이머 관련 상수
export const TIMER_CONFIG = {
  LIGHTNING_SALE_MAX_DELAY: 10000, // 번개세일 최대 지연시간 (10초)
  LIGHTNING_SALE_INTERVAL: 30000, // 번개세일 반복 간격 (30초)
  SUGGESTION_INTERVAL: 60000, // 추천상품 반복 간격 (60초)
  SUGGESTION_MAX_DELAY: 20000, // 추천상품 최대 지연시간 (20초)
};

// 할인율 상수
export const DISCOUNT_RATES = {
  LIGHTNING_SALE: 0.2, // 번개세일 20% 할인
  SUGGESTION: 0.05, // 추천상품 5% 할인
  TUESDAY_SPECIAL: 0.1, // 화요일 특별할인 10%
  BULK_DISCOUNT_30_PLUS: 0.25, // 30개 이상 대량할인 25%

  // 조합 할인율 (번개세일 + 추천할인)
  SUPER_SALE_COMBO: 0.25, // 25% SUPER SALE

  // 개별 상품 대량구매 할인
  PRODUCT_BULK_DISCOUNTS: {
    KEYBOARD: 0.1, // 키보드 10개 이상 10%
    MOUSE: 0.15, // 마우스 10개 이상 15%
    MONITOR_ARM: 0.2, // 모니터암 10개 이상 20%
    LAPTOP_POUCH: 0.05, // 노트북파우치 10개 이상 5%
    SPEAKER: 0.25, // 스피커 10개 이상 25%
  },
};

// 수량 임계값 상수
export const QUANTITY_THRESHOLDS = {
  BULK_DISCOUNT_MINIMUM: 30, // 대량구매 할인 최소 수량
  INDIVIDUAL_DISCOUNT_MINIMUM: 10, // 개별상품 할인 최소 수량
  MEDIUM_BULK_MINIMUM: 20, // 중간 대량구매 기준
  LOW_STOCK_WARNING: 5, // 재고 부족 경고 기준
  STOCK_BORDER_WARNING: 50, // 재고 부족 시 테두리 변경 기준
  STOCK_WARNING_THRESHOLD: 30, // 전체 재고 경고 기준
  DEFAULT_QUANTITY_INCREMENT: 1, // 기본 수량 증가값
  INITIAL_CART_QUANTITY: 1, // 장바구니 초기 수량
};

// 포인트 관련 상수
export const POINTS_CONFIG = {
  BASE_POINT_RATE: 1000, // 기본 포인트 적립률 (1000원당 1포인트)
  TUESDAY_MULTIPLIER: 2, // 화요일 포인트 배수

  // 조합 보너스 포인트
  COMBO_BONUS: {
    KEYBOARD_MOUSE: 50, // 키보드+마우스 세트
    FULL_SET: 100, // 풀세트 (키보드+마우스+모니터암)
  },

  // 대량구매 보너스 포인트
  BULK_BONUS: {
    TEN_PLUS: 20, // 10개 이상
    TWENTY_PLUS: 50, // 20개 이상
    THIRTY_PLUS: 100, // 30개 이상
  },
};

// 요일 상수
export const WEEKDAYS = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

// 가격 계산 관련 상수
export const PRICE_CONFIG = {
  LIGHTNING_SALE_MULTIPLIER: 0.8, // 번개세일 가격 배수 (80%)
  SUGGESTION_SALE_MULTIPLIER: 0.95, // 추천세일 가격 배수 (95%)
  TUESDAY_MULTIPLIER: 0.9, // 화요일 할인 배수 (90%)
  BULK_DISCOUNT_MULTIPLIER: 0.75, // 대량할인 배수 (75%)
};
