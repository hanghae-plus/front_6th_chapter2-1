// Product IDs
export const PRODUCT_IDS = {
  KEYBOARD: 'p1',
  MOUSE: 'p2',
  MONITOR: 'p3',
  HEADPHONE: 'p4',
  SPEAKER: 'p5',
} as const;

// Business Policy Constants
export const QUANTITY_THRESHOLDS = {
  INDIVIDUAL_DISCOUNT: 10,
  BONUS_SMALL: 10,
  BONUS_MEDIUM: 20,
  BONUS_LARGE: 30,
} as const;

export const DISCOUNT_RATES = {
  PRODUCT: {
    KEYBOARD: 0.1,
    MOUSE: 0.15,
    MONITOR_ARM: 0.2,
    LAPTOP_POUCH: 0.05,
    SPEAKER: 0.25,
  },
  BULK: 0.25,
  TUESDAY: 0.1,
  LIGHTNING: 0.2,
  SUGGEST: 0.05,
} as const;

export const POINT_RATES = {
  BASE_RATE: 0.001,
  TUESDAY_MULTIPLIER: 2,
  SETS: {
    KEYBOARD_MOUSE: 50,
    FULL_SET: 100,
  },
  BULK_BONUS: {
    SMALL: 20,
    MEDIUM: 50,
    LARGE: 100,
  },
} as const;

// System Settings
export const STOCK_THRESHOLDS = {
  LOW: 5,
  WARNING: 50,
} as const;

export const TIMER_DELAYS = {
  LIGHTNING: {
    DELAY_MAX: 10000,
    INTERVAL: 30000,
  },
  SUGGEST: {
    DELAY_MAX: 20000,
    INTERVAL: 60000,
  },
} as const;

export const TUESDAY = 2;
export const CURRENCY_SYMBOL = '₩';

export const DEFAULT_MESSAGES = {
  EMPTY_CART: '🛍️ 0 items in cart',
  STOCK_SHORTAGE: '재고가 부족합니다.',
  LIGHTNING_SALE: '⚡번개세일!',
  SUGGEST_SALE: '💝 추천할인',
} as const;
