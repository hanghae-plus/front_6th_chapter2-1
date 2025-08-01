// constants/index.ts
export const PRODUCT_IDS = {
  KEYBOARD: 'p1',
  MOUSE: 'p2',
  MONITOR_ARM: 'p3',
  LAPTOP_POUCH: 'p4',
  SPEAKER: 'p5',
} as const;

export const DISCOUNT_RATES = {
  KEYBOARD: 0.1,
  MOUSE: 0.15,
  MONITOR_ARM: 0.2,
  LAPTOP_POUCH: 0.05,
  SPEAKER: 0.25,
  BULK: 0.25,
  TUESDAY: 0.1,
  LIGHTNING: 0.2,
  RECOMMEND: 0.05,
} as const;

export const THRESHOLDS = {
  MIN_QUANTITY_FOR_DISCOUNT: 10,
  MIN_QUANTITY_FOR_BULK: 30,
  LOW_STOCK: 5,
  TOTAL_STOCK_WARNING: 50,
} as const;

export const POINTS = {
  RATE: 0.001,
  BONUS: {
    SET: 50,
    FULL_SET: 100,
    BULK_10: 20,
    BULK_20: 50,
    BULK_30: 100,
  },
} as const;

export const TIMERS = {
  LIGHTNING_SALE_INTERVAL: 30000,
  RECOMMEND_SALE_INTERVAL: 60000,
  LIGHTNING_SALE_MAX_DELAY: 10000,
  RECOMMEND_SALE_MAX_DELAY: 20000,
} as const;