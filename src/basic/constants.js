// ============================================
// CONSTANTS
// ============================================

// Product IDs
export const PRODUCT_ONE = 'p1';
export const PRODUCT_TWO = 'p2';
export const PRODUCT_THREE = 'p3';
export const PRODUCT_FOUR = 'p4';
export const PRODUCT_FIVE = 'p5';

// Product IDs Object (businessLogic.js에서 사용)
export const PRODUCT_IDS = {
  KEYBOARD: 'p1',
  MOUSE: 'p2',
  MONITOR_ARM: 'p3',
  LAPTOP_POUCH: 'p4',
  SPEAKER: 'p5',
};

// Discount Rates
export const DISCOUNT_RATES = {
  KEYBOARD: 10 / 100,
  MOUSE: 15 / 100,
  MONITOR_ARM: 20 / 100,
  LAPTOP_POUCH: 5 / 100,
  SPEAKER: 25 / 100,
  BULK_PURCHASE: 25 / 100,
  TUESDAY: 10 / 100,
  LIGHTNING_SALE: 20 / 100,
  RECOMMENDATION: 5 / 100,
};

// Quantity Thresholds
export const QUANTITY_THRESHOLDS = {
  INDIVIDUAL_DISCOUNT: 10,
  BULK_PURCHASE: 30,
  LOW_STOCK: 5,
  TOTAL_STOCK_WARNING: 50,
  BONUS_10: 10,
  BONUS_20: 20,
  BONUS_30: 30,
};

// Points Configuration
export const POINTS_CONFIG = {
  POINTS_DIVISOR: 1000,
  TUESDAY_MULTIPLIER: 2,
  KEYBOARD_MOUSE_BONUS: 50,
  FULL_SET_BONUS: 100,
  BONUS_10: 20,
  BONUS_20: 50,
  BONUS_30: 100,
};

// Timer Configuration
export const TIMER_CONFIG = {
  LIGHTNING_DELAY_MAX: 10000,
  LIGHTNING_INTERVAL: 30000,
  RECOMMENDATION_DELAY_MAX: 20000,
  RECOMMENDATION_INTERVAL: 60000,
};
