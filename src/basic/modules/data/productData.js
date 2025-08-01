// Product data and constants
export const PRODUCT_CONSTANTS = {
  PRODUCT_ONE: 'p1',
  PRODUCT_TWO: 'p2',
  PRODUCT_THREE: 'p3',
  PRODUCT_FOUR: 'p4',
  PRODUCT_FIVE: 'p5',
};

export const DISCOUNT_RATES = {
  BULK_PURCHASE_THRESHOLD: 30,
  BULK_PURCHASE_DISCOUNT: 25,
  TUESDAY_DISCOUNT: 10,
  LIGHTNING_SALE_DISCOUNT: 20,
  RECOMMENDATION_DISCOUNT: 5,
  INDIVIDUAL_PRODUCT_DISCOUNTS: {
    [PRODUCT_CONSTANTS.PRODUCT_ONE]: 10,
    [PRODUCT_CONSTANTS.PRODUCT_TWO]: 15,
    [PRODUCT_CONSTANTS.PRODUCT_THREE]: 20,
    [PRODUCT_CONSTANTS.PRODUCT_FOUR]: 5,
    [PRODUCT_CONSTANTS.PRODUCT_FIVE]: 25,
  },
  INDIVIDUAL_DISCOUNT_THRESHOLD: 10,
};

export const POINTS_CONFIG = {
  BASE_RATE: 0.001, // 0.1%
  TUESDAY_MULTIPLIER: 2,
  KEYBOARD_MOUSE_BONUS: 50,
  FULL_SET_BONUS: 100,
  BULK_PURCHASE_BONUSES: {
    10: 20,
    20: 50,
    30: 100,
  },
};

export const TIMING_CONFIG = {
  LIGHTNING_SALE_INTERVAL: 30000,
  LIGHTNING_SALE_DELAY: 10000,
  RECOMMENDATION_INTERVAL: 60000,
  RECOMMENDATION_DELAY: 20000,
};

export const STOCK_WARNING_THRESHOLD = 5;
export const LOW_STOCK_THRESHOLD = 50;

// Product data
export const productList = [
  {
    id: PRODUCT_CONSTANTS.PRODUCT_ONE,
    name: '버그 없애는 키보드',
    price: 10000,
    originalPrice: 10000,
    stockQuantity: 50,
    isFlashSale: false,
    isRecommended: false,
  },
  {
    id: PRODUCT_CONSTANTS.PRODUCT_TWO,
    name: '생산성 폭발 마우스',
    price: 20000,
    originalPrice: 20000,
    stockQuantity: 30,
    isFlashSale: false,
    isRecommended: false,
  },
  {
    id: PRODUCT_CONSTANTS.PRODUCT_THREE,
    name: '거북목 탈출 모니터암',
    price: 30000,
    originalPrice: 30000,
    stockQuantity: 20,
    isFlashSale: false,
    isRecommended: false,
  },
  {
    id: PRODUCT_CONSTANTS.PRODUCT_FOUR,
    name: '에러 방지 노트북 파우치',
    price: 15000,
    originalPrice: 15000,
    stockQuantity: 0,
    isFlashSale: false,
    isRecommended: false,
  },
  {
    id: PRODUCT_CONSTANTS.PRODUCT_FIVE,
    name: '코딩할 때 듣는 Lo-Fi 스피커',
    price: 25000,
    originalPrice: 25000,
    stockQuantity: 10,
    isFlashSale: false,
    isRecommended: false,
  },
];

// Utility functions for product data
export function findProductById(productId) {
  return productList.find((product) => product.id === productId);
}

export function getTotalStock() {
  return productList.reduce(
    (total, product) => total + product.stockQuantity,
    0
  );
}

export function getLowStockProducts() {
  return productList.filter(
    (product) =>
      product.stockQuantity < STOCK_WARNING_THRESHOLD &&
      product.stockQuantity > 0
  );
}

export function getOutOfStockProducts() {
  return productList.filter((product) => product.stockQuantity === 0);
}
