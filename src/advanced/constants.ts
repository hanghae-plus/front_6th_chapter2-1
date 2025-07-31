// React 앱용 상수 정의
export const PRODUCT_IDS = {
  KEYBOARD: 'p1',
  MOUSE: 'p2', 
  MONITOR_ARM: 'p3',
  LAPTOP_POUCH: 'p4',
  SPEAKER: 'p5',
} as const;

export const DISCOUNT_RATES = {
  KEYBOARD: 0.1, // 10%
  MOUSE: 0.15, // 15%
  MONITOR_ARM: 0.2, // 20%
  LAPTOP_POUCH: 0.05, // 5%
  SPEAKER: 0.25, // 25%
  LIGHTNING_SALE: 0.2, // 20% 번개세일
  RECOMMENDATION: 0.05, // 5% 추천할인
  TUESDAY: 0.1, // 10% 화요일 할인
  BULK_PURCHASE: 0.25, // 25% 대량구매
} as const;

export const DISCOUNT_PERCENTAGES = {
  KEYBOARD: 10, // 10%
  MOUSE: 15, // 15%
  MONITOR_ARM: 20, // 20%
  LAPTOP_POUCH: 5, // 5%
  SPEAKER: 25, // 25%
  LIGHTNING_SALE: 20, // 20% 번개세일
  RECOMMENDATION: 5, // 5% 추천할인
  TUESDAY: 10, // 10% 화요일 할인
  BULK_PURCHASE: 25, // 25% 대량구매
  SUPER_SALE: 25, // 25% SUPER SALE (번개세일 + 추천할인)
} as const;

export const QUANTITY_THRESHOLDS = {
  INDIVIDUAL_DISCOUNT: 10,
  BULK_PURCHASE: 30,
  LOW_STOCK: 5,
  POINTS_BONUS_10: 10,
  POINTS_BONUS_20: 20,
} as const;

export const POINTS_CONFIG = {
  POINTS_DIVISOR: 1000,
  TUESDAY_MULTIPLIER: 2,
  KEYBOARD_MOUSE_BONUS: 50,
  FULL_SET_BONUS: 100,
  BONUS_10_ITEMS: 20,
  BONUS_20_ITEMS: 50,
  BONUS_30_ITEMS: 100,
} as const;

export const TIMER_CONFIG = {
  LIGHTNING_SALE_DELAY: 10000,  // 0~10초 랜덤 지연 (원본과 동일)
  LIGHTNING_SALE_INTERVAL: 30000,  // 30초마다 (원본과 동일)
  RECOMMENDATION_DELAY: 20000,  // 0~20초 랜덤 지연 (원본과 동일)
  RECOMMENDATION_INTERVAL: 60000,  // 60초마다 (원본과 동일)
} as const;

export const WEEKDAYS = {
  TUESDAY: 2,
} as const;

export const INITIAL_PRODUCTS = [
  { 
    id: PRODUCT_IDS.KEYBOARD, 
    name: '버그 없애는 키보드', 
    price: 10000, 
    originalPrice: 10000, 
    quantity: 50, 
    hasLightningDiscount: false, 
    hasRecommendationDiscount: false 
  },
  { 
    id: PRODUCT_IDS.MOUSE, 
    name: '생산성 폭발 마우스', 
    price: 20000, 
    originalPrice: 20000, 
    quantity: 30, 
    hasLightningDiscount: false, 
    hasRecommendationDiscount: false 
  },
  { 
    id: PRODUCT_IDS.MONITOR_ARM, 
    name: '거북목 탈출 모니터암', 
    price: 30000, 
    originalPrice: 30000, 
    quantity: 20, 
    hasLightningDiscount: false, 
    hasRecommendationDiscount: false 
  },
  { 
    id: PRODUCT_IDS.LAPTOP_POUCH, 
    name: '에러 방지 노트북 파우치', 
    price: 15000, 
    originalPrice: 15000, 
    quantity: 0, 
    hasLightningDiscount: false, 
    hasRecommendationDiscount: false 
  },
  { 
    id: PRODUCT_IDS.SPEAKER, 
    name: '코딩할 때 듣는 Lo-Fi 스피커', 
    price: 25000, 
    originalPrice: 25000, 
    quantity: 10, 
    hasLightningDiscount: false, 
    hasRecommendationDiscount: false 
  }
] as const; 