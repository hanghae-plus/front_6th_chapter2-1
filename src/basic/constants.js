// 상품 ID
export const PRODUCT_ID = {
  P1: 'p1',
  P2: 'p2',
  P3: 'p3',
  P4: 'p4',
  P5: 'p5',
};

// 할인 관련 상수
export const DISCOUNT = {
  KEYBOARD_DISCOUNT_RATE: 0.1,
  MOUSE_DISCOUNT_RATE: 0.15,
  MONITOR_ARM_DISCOUNT_RATE: 0.2,
  SPEAKER_DISCOUNT_RATE: 0.25,
  BULK_DISCOUNT_THRESHOLD: 30,
  BULK_DISCOUNT_RATE: 0.25,
  TUESDAY_DISCOUNT_RATE: 0.1,
  LIGHTNING_SALE_RATE: 0.2,
  RECOMMEND_SALE_RATE: 0.05,
  SUPER_SALE_RATE: 0.25,
};

// 포인트 관련 상수
export const POINTS = {
  BASE_POINT_RATE: 0.001,
  TUESDAY_BONUS_RATE: 2,
  KEYBOARD_MOUSE_SET_BONUS: 50,
  FULL_SET_BONUS: 100,
  BULK_PURCHASE_BONUS: {
    LEVEL_1: { threshold: 10, points: 20 },
    LEVEL_2: { threshold: 20, points: 50 },
    LEVEL_3: { threshold: 30, points: 100 },
  },
};

// 재고 관련 상수
export const STOCK = {
  LOW_STOCK_THRESHOLD: 5,
  TOTAL_STOCK_WARNING_THRESHOLD: 50,
};

// 타이머 관련 상수
export const TIMER = {
  LIGHTNING_SALE_INTERVAL: 30000, // 30초
  RECOMMEND_SALE_INTERVAL: 60000, // 60초
};
