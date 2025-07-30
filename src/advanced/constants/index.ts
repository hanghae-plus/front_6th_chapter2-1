import { Product } from "../types";

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
    val: 10000,
    originalVal: 10000,
    q: 50,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_IDS.MOUSE,
    name: "생산성 폭발 마우스",
    val: 20000,
    originalVal: 20000,
    q: 30,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_IDS.MONITOR_ARM,
    name: "거북목 탈출 모니터암",
    val: 30000,
    originalVal: 30000,
    q: 20,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_IDS.LAPTOP_POUCH,
    name: "에러 방지 노트북 파우치",
    val: 15000,
    originalVal: 15000,
    q: 0,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_IDS.SPEAKER,
    name: "코딩할 때 듣는 Lo-Fi 스피커",
    val: 25000,
    originalVal: 25000,
    q: 10,
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
  LIGHTNING_SALE_INTERVAL: 30000, // 30초
  SUGGEST_SALE_INTERVAL: 60000, // 60초
  LIGHTNING_DELAY_RANGE: 10000, // 0-10초
  SUGGEST_DELAY_RANGE: 20000, // 0-20초
} as const;

export const STOCK_WARNINGS = {
  LOW_STOCK_THRESHOLD: 5,
  TOTAL_STOCK_WARNING: 30,
} as const;
