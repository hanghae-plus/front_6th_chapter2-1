/**
 * 상품 관련 상수 정의
 * 원본 파일의 상수들을 모듈화하여 관리
 */

// 상품 ID 상수
export const PRODUCT_ONE = "p1";
export const PRODUCT_TWO = "p2";
export const PRODUCT_THREE = "p3";
export const PRODUCT_FOUR = "p4";
export const PRODUCT_FIVE = "p5";

// 할인율 상수
export const DISCOUNT_RATES = {
  [PRODUCT_ONE]: 0.1, // 키보드 10%
  [PRODUCT_TWO]: 0.15, // 마우스 15%
  [PRODUCT_THREE]: 0.2, // 모니터암 20%
  [PRODUCT_FOUR]: 0.05, // 노트북 파우치 5%
  [PRODUCT_FIVE]: 0.25, // 스피커 25%
};

// 대량구매 할인 임계값
export const BULK_DISCOUNT_THRESHOLD = 30;
export const BULK_DISCOUNT_RATE = 0.25;

// 특별 할인율
export const TUESDAY_DISCOUNT_RATE = 0.1;
export const LIGHTNING_SALE_RATE = 0.2;
export const SUGGEST_SALE_RATE = 0.05;

// 포인트 관련 상수
export const BASE_POINTS_RATE = 0.001; // 0.1%
export const TUESDAY_POINTS_MULTIPLIER = 2;
export const SET_BONUS_POINTS = 50; // 키보드+마우스 세트
export const FULL_SET_BONUS_POINTS = 100; // 풀세트

// 수량별 보너스 포인트
export const QUANTITY_BONUS_POINTS = {
  10: 20,
  20: 50,
  30: 100,
};

// 프로모션 간격 (밀리초)
export const LIGHTNING_SALE_INTERVAL = 30000;
export const SUGGEST_SALE_INTERVAL = 60000;

// 계산 관련 상수
export const CALCULATION_CONSTANTS = {
  BASE_POINTS_RATE: 0.001,
  TUESDAY_POINTS_MULTIPLIER: 2,
  SET_BONUS_POINTS: 50,
  FULL_SET_BONUS_POINTS: 100,
  QUANTITY_BONUS_POINTS: {
    10: 20,
    20: 50,
    30: 100,
  },
};

// 요일 상수
export const DAYS_OF_WEEK = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 0,
};

// UI 관련 상수
export const UI_CONSTANTS = {
  LOYALTY_POINTS: "loyalty-points",
  CART_ITEMS: "cart-items",
  PRODUCT_SELECT: "product-select",
  ADD_TO_CART: "add-to-cart",
  STOCK_STATUS: "stock-status",
  CART_TOTAL: "cart-total",
  SUMMARY_DETAILS: "summary-details",
  DISCOUNT_INFO: "discount-info",
  TUESDAY_SPECIAL: "tuesday-special",
  ITEM_COUNT: "item-count",
  POINTS_NOTICE: "points-notice",
};
