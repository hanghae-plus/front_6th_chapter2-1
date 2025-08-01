// ==================== 상품 ID 상수 ====================
export const KEYBOARD_ID = 'p1';
export const MOUSE_ID = 'p2';
export const MONITOR_ID = 'p3';
export const HEADPHONE_ID = 'p4';
export const SPEAKER_ID = 'p5';

// ==================== 비즈니스 정책 상수 ====================

// 수량 기준값
export const QUANTITY_THRESHOLDS = {
  INDIVIDUAL_DISCOUNT: 10, // 개별 상품 할인 기준
  BONUS_SMALL: 10, // 할인+포인트 보너스 소량 기준
  BONUS_MEDIUM: 20, // 할인+포인트 보너스 중량 기준
  BONUS_LARGE: 30, // 할인+포인트 보너스 대량 기준
};

// 할인 정책
export const DISCOUNT_RATES = {
  // 개별 상품 할인율 (10개↑)
  PRODUCT: {
    KEYBOARD: 0.1,
    MOUSE: 0.15,
    MONITOR_ARM: 0.2,
    LAPTOP_POUCH: 0.05,
    SPEAKER: 0.25,
  },
  // 대량구매 할인율 (30개↑)
  BULK: 0.25,
  // 특별 할인
  TUESDAY: 0.1,
  LIGHTNING: 0.2,
  SUGGEST: 0.05,
};

// 포인트 적립 정책
export const POINT_RATES = {
  BASE_RATE: 0.001, // 기본 0.1%
  TUESDAY_MULTIPLIER: 2, // 화요일 2배
  // 세트 구매 보너스
  SETS: {
    KEYBOARD_MOUSE: 50, // 키보드+마우스
    FULL_SET: 100, // 풀세트
  },
  // 대량구매 보너스
  BULK_BONUS: {
    SMALL: 20, // 10개↑
    MEDIUM: 50, // 20개↑
    LARGE: 100, // 30개↑
  },
};

// ==================== 시스템 설정 상수 ====================

// 재고 관리
export const STOCK_THRESHOLDS = {
  LOW: 5, // 재고 부족 기준
  WARNING: 50, // 재고 경고 기준
};

// 타이머 설정
export const TIMER_DELAYS = {
  LIGHTNING: {
    DELAY_MAX: 10000, // 최대 지연 (ms)
    INTERVAL: 30000, // 간격 (30초)
  },
  SUGGEST: {
    DELAY_MAX: 20000, // 최대 지연 (ms)
    INTERVAL: 60000, // 간격 (60초)
  },
};

// 시스템 상수
export const TUESDAY = 2;

// 통화 및 포맷
export const CURRENCY_SYMBOL = '₩';

// 기본 메시지
export const DEFAULT_MESSAGES = {
  EMPTY_CART: '🛍️ 0 items in cart',
  STOCK_SHORTAGE: '재고가 부족합니다.',
  LIGHTNING_SALE: '⚡번개세일!',
  SUGGEST_SALE: '💝 추천할인',
};
