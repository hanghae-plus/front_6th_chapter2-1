import type { Product } from "../types";

export const PRODUCT_IDS = {
  KEYBOARD: "p1",
  MOUSE: "p2",
  MONITOR_ARM: "p3",
  LAPTOP_POUCH: "p4",
  SPEAKER: "p5",
} as const;

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: PRODUCT_IDS.KEYBOARD,
    name: "버그 없애는 키보드",
    price: 10000,
    originalPrice: 10000,
    quantity: 50,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_IDS.MOUSE,
    name: "생산성 폭발 마우스",
    price: 20000,
    originalPrice: 20000,
    quantity: 30,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_IDS.MONITOR_ARM,
    name: "거북목 탈출 모니터암",
    price: 30000,
    originalPrice: 30000,
    quantity: 20,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_IDS.LAPTOP_POUCH,
    name: "에러 방지 노트북 파우치",
    price: 15000,
    originalPrice: 15000,
    quantity: 0,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_IDS.SPEAKER,
    name: "코딩할 때 듣는 Lo-Fi 스피커",
    price: 25000,
    originalPrice: 25000,
    quantity: 10,
    onSale: false,
    suggestSale: false,
  },
];

export const DISCOUNT_RATES = {
  INDIVIDUAL: {
    [PRODUCT_IDS.KEYBOARD]: 10,
    [PRODUCT_IDS.MOUSE]: 15,
    [PRODUCT_IDS.MONITOR_ARM]: 20,
    [PRODUCT_IDS.LAPTOP_POUCH]: 5,
    [PRODUCT_IDS.SPEAKER]: 25,
  },
  BULK_THRESHOLD: 30,
  BULK_DISCOUNT: 25,
  TUESDAY_DISCOUNT: 10,
  LIGHTNING_DISCOUNT: 20,
  SUGGEST_DISCOUNT: 5,
} as const;

export const POINT_RATES = {
  BASE_RATE: 0.001, // 0.1%
  TUESDAY_MULTIPLIER: 2,
  KEYBOARD_MOUSE_BONUS: 50,
  FULL_SET_BONUS: 100,
  QUANTITY_BONUS: {
    10: 20,
    20: 50,
    30: 100,
  },
} as const;

export const SPECIAL_EVENTS = {
  LIGHTNING_SALE_INTERVAL: 120000, // 2분
  SUGGEST_SALE_INTERVAL: 180000, // 3분
  LIGHTNING_DELAY_RANGE: 30000, // 30초
  SUGGEST_DELAY_RANGE: 45000, // 45초
} as const;

export const STOCK_WARNINGS = {
  LOW_STOCK_THRESHOLD: 5,
  TOTAL_STOCK_WARNING: 30,
} as const;
