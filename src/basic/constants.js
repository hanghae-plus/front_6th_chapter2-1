// 상품 ID 상수
export const PRODUCT_IDS = {
  KEYBOARD: "p1",
  MOUSE: "p2",
  MONITOR_ARM: "p3",
  LAPTOP_CASE: "p4",
  SPEAKER: "p5",
};

// 할인 정책 상수
export const DISCOUNT_POLICIES = {
  INDIVIDUAL: {
    [PRODUCT_IDS.KEYBOARD]: 10, // 키보드 10개↑: 10%
    [PRODUCT_IDS.MOUSE]: 15, // 마우스 10개↑: 15%
    [PRODUCT_IDS.MONITOR_ARM]: 20, // 모니터암 10개↑: 20%
    [PRODUCT_IDS.LAPTOP_CASE]: 5, // 노트북파우치 10개↑: 5%
    [PRODUCT_IDS.SPEAKER]: 25, // 스피커 10개↑: 25%
  },
  BULK: {
    THRESHOLD: 30,
    DISCOUNT_RATE: 25,
  },
  TUESDAY: {
    DISCOUNT_RATE: 10,
    POINT_MULTIPLIER: 2,
  },
  LIGHTNING_SALE: {
    DISCOUNT_RATE: 20,
  },
  SUGGESTED_SALE: {
    DISCOUNT_RATE: 5,
  },
};

// 포인트 정책 상수
export const POINT_POLICIES = {
  BASE_RATE: 0.001, // 구매액의 0.1%
  BONUS: {
    KEYBOARD_MOUSE_SET: 50,
    FULL_SET: 100,
    QUANTITY_10: 20,
    QUANTITY_20: 50,
    QUANTITY_30: 100,
  },
};

// 재고 관련 상수
export const STOCK_THRESHOLDS = {
  LOW_STOCK: 5,
  WARNING_TOTAL: 50,
};

// 이벤트 간격 상수
export const EVENT_INTERVALS = {
  LIGHTNING_SALE: 30000, // 30초
  SUGGESTED_SALE: 60000, // 60초
};

// CSS 클래스 상수
export const CSS_CLASSES = {
  SALE_INDICATORS: {
    LIGHTNING: "text-red-500 font-bold",
    SUGGESTED: "text-blue-500 font-bold",
    COMBINED: "text-purple-600 font-bold",
    DISABLED: "text-gray-400",
  },
};
