/**
 * UI 관련 상수 정의
 * @description UI 표시, 스타일링, 레이아웃에 관련된 상수들
 */

// 재고 관리 임계값
export const STOCK_THRESHOLDS = {
  LOW_STOCK_THRESHOLD: 5,             // 재고 부족 경고 임계값
  STOCK_WARNING_THRESHOLD: 50,        // 재고 경고 임계값
};

// 포인트 관련
export const POINTS_CONFIG = {
  POINTS_RATE: 0.001,                 // 기본 포인트 적립률 (0.1%)
  TUESDAY_POINTS_MULTIPLIER: 2,       // 화요일 포인트 배수
};

// 날짜 관련
export const DATE_CONFIG = {
  TUESDAY_DAY_OF_WEEK: 2,            // 화요일 요일 번호
};

// 프로모션 타이머 설정
export const PROMOTION_TIMERS = {
  LIGHTNING_SALE_INTERVAL: 30000,     // 번개세일 주기 (30초)
  SUGGEST_SALE_INTERVAL: 60000,       // 추천세일 주기 (60초)
  LIGHTNING_SALE_MAX_DELAY: 10000,    // 번개세일 최대 지연시간
  SUGGEST_SALE_MAX_DELAY: 20000,      // 추천세일 최대 지연시간
};

// CSS 클래스 상수
export const CSS_CLASSES = {
  SALE_COLORS: {
    LIGHTNING: 'text-red-500',
    SUGGEST: 'text-blue-500',
    COMBINED: 'text-purple-600',
  },
  QUANTITY_HIGHLIGHT: 'font-bold',
  STOCK_WARNING: 'text-red-500',
};