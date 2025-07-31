/**
 * 상수 정의
 * React 마이그레이션을 위한 상수 시스템
 */
import type { CalculationOptions, DiscountRates, Product } from "../types/index";

// 상품 ID 상수
export const PRODUCT_ONE = "p1";
export const PRODUCT_TWO = "p2";
export const PRODUCT_THREE = "p3";
export const PRODUCT_FOUR = "p4";
export const PRODUCT_FIVE = "p5";

// 상품 정보 상수
export const PRODUCT_DATA: Record<string, Product> = {
  [PRODUCT_ONE]: {
    id: PRODUCT_ONE,
    name: "버그 없애는 키보드",
    val: 10000,
    originalVal: 10000,
    q: 50,
    onSale: false,
    suggestSale: false,
  },
  [PRODUCT_TWO]: {
    id: PRODUCT_TWO,
    name: "생산성 폭발 마우스",
    val: 20000,
    originalVal: 20000,
    q: 30,
    onSale: false,
    suggestSale: false,
  },
  [PRODUCT_THREE]: {
    id: PRODUCT_THREE,
    name: "거북목 탈출 모니터암",
    val: 30000,
    originalVal: 30000,
    q: 20,
    onSale: false,
    suggestSale: false,
  },
  [PRODUCT_FOUR]: {
    id: PRODUCT_FOUR,
    name: "에러 방지 노트북 파우치",
    val: 15000,
    originalVal: 15000,
    q: 0,
    onSale: false,
    suggestSale: false,
  },
  [PRODUCT_FIVE]: {
    id: PRODUCT_FIVE,
    name: "코딩할 때 듣는 Lo-Fi 스피커",
    val: 25000,
    originalVal: 25000,
    q: 10,
    onSale: false,
    suggestSale: false,
  },
};

// 할인율 상수
export const DISCOUNT_RATES: DiscountRates = {
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
export const QUANTITY_BONUS_POINTS: Record<number, number> = {
  10: 20,
  20: 50,
  30: 100,
};

// 재고 관련 상수
export const LOW_STOCK_THRESHOLD = 5;
export const TOTAL_STOCK_WARNING = 50;
export const OUT_OF_STOCK = 0;

// 프로모션 간격 (밀리초)
export const LIGHTNING_SALE_INTERVAL = 30000;
export const SUGGEST_SALE_INTERVAL = 60000;

// UI 관련 상수
export const UI_CLASSES = {
  HIDDEN: "hidden",
  DISABLED: "disabled",
  FIRST_ITEM: "first:pt-0",
  LAST_ITEM: "last:border-b-0",
  QUANTITY_CHANGE: "quantity-change",
  REMOVE_ITEM: "remove-item",
  QUANTITY_NUMBER: "quantity-number",
  ITEM_COUNT: "item-count",
  CART_TOTAL: "cart-total",
  LOYALTY_POINTS: "loyalty-points",
  DISCOUNT_INFO: "discount-info",
  TUESDAY_SPECIAL: "tuesday-special",
  STOCK_STATUS: "stock-status",
  SUMMARY_DETAILS: "summary-details",
} as const;

// 메시지 상수
export const MESSAGES = {
  INSUFFICIENT_STOCK: "재고가 부족합니다.",
  OUT_OF_STOCK: "품절",
  LOW_STOCK_WARNING: "재고 부족",
  TUESDAY_SPECIAL: "화요일 특별 할인",
  TUESDAY_DISCOUNT: "화요일 2배",
  KEYBOARD_MOUSE_SET: "키보드+마우스 세트",
  FULL_SET: "풀세트 구매",
  BULK_PURCHASE_10: "대량구매(10개+)",
  BULK_PURCHASE_20: "대량구매(20개+)",
  BULK_PURCHASE_30: "대량구매(30개+)",
  LIGHTNING_SALE: "⚡번개세일!",
  SUGGEST_SALE: "💝 추천할인",
  SUPER_SALE: "25% SUPER SALE!",
  FREE_SHIPPING: "Free shipping on all orders.",
  LOYALTY_POINTS_NOTICE: "Earn loyalty points with purchase.",
} as const;

// 아이콘 상수
export const ICONS = {
  LIGHTNING: "⚡",
  SUGGEST: "💝",
  SUPER_SALE: "⚡💝",
  SHOPPING_CART: "🛒",
  ITEMS_IN_CART: "🛍️",
  CELEBRATION: "🎉",
  STAR: "🌟",
  HEART: "💝",
} as const;

// 날짜 관련 상수
export const DAYS_OF_WEEK = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 0,
} as const;

// 계산 관련 상수
export const CALCULATION_CONSTANTS = {
  PERCENTAGE_MULTIPLIER: 100,
  DECIMAL_PLACES: 1,
  CURRENCY_SYMBOL: "₩",
  POINTS_SUFFIX: "p",
  ITEMS_SUFFIX: " items in cart",
} as const;

// CSS 클래스 상수
export const CSS_CLASSES = {
  GRID_CONTAINER: "grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden",
  LEFT_COLUMN: "bg-white border border-gray-200 p-8 overflow-y-auto",
  RIGHT_COLUMN: "bg-black text-white p-8 flex flex-col",
  SELECTOR_CONTAINER: "mb-6 pb-6 border-b border-gray-200",
  PRODUCT_SELECT: "w-full p-3 border border-gray-300 rounded-lg text-base mb-3",
  ADD_BUTTON:
    "w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all",
  STOCK_INFO: "text-xs text-red-500 mt-3 whitespace-pre-line",
  CART_ITEMS: "cart-items",
  CART_ITEM:
    "grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0",
  PRODUCT_IMAGE: "w-20 h-20 bg-gradient-black relative overflow-hidden",
  QUANTITY_BUTTON:
    "quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white",
  REMOVE_BUTTON:
    "remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black",
  MANUAL_TOGGLE:
    "fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50",
  MANUAL_OVERLAY: "fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300",
  MANUAL_COLUMN:
    "fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300",
} as const;

// 계산 옵션 상수
export const CALCULATION_OPTIONS: CalculationOptions = {
  discountRates: DISCOUNT_RATES,
  bulkThreshold: BULK_DISCOUNT_THRESHOLD,
  bulkDiscountRate: BULK_DISCOUNT_RATE,
  tuesdayDiscountRate: TUESDAY_DISCOUNT_RATE,
  basePointsRate: BASE_POINTS_RATE,
  tuesdayMultiplier: TUESDAY_POINTS_MULTIPLIER,
  setBonuses: {
    "keyboard-mouse": SET_BONUS_POINTS,
    "full-set": FULL_SET_BONUS_POINTS,
  },
  quantityBonuses: QUANTITY_BONUS_POINTS,
};
