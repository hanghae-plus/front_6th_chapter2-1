// Cart related constants
export const CART_CONSTANTS = {
  DISCOUNT: {
    ITEM_DISCOUNT_MIN_QUANTITY: 10,
    BULK_DISCOUNT_THRESHOLD: 30,
    BULK_DISCOUNT_RATE: 0.25,
    TUESDAY_DISCOUNT_RATE: 0.1,
    SUGGEST_DISCOUNT_RATE: 0.05,
    FLASH_SALE_DISCOUNT_RATE: 0.2,
  },

  TIMERS: {
    FLASH_SALE_INTERVAL: 30000,
    SUGGEST_SALE_INTERVAL: 60000,
    MAX_DELAY: 20000,
    RANDOM_DELAY: 10000,
  },
};

// Cart related DOM element IDs
export const CART_ELEMENT_IDS = {
  CART_ITEMS: "cart-items",
  CART_TOTAL: "cart-total",
  DISCOUNT_INFO: "discount-info",
  TUESDAY_SPECIAL: "tuesday-special",
};
