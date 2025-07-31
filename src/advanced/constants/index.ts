import { 
  Product, 
  ProductDiscountRate, 
  DiscountPolicy, 
  PointsPolicy, 
  AutoEventConfig 
} from '../types';

// 이벤트 관련 상수 export
export { EVENT_CONSTANTS } from './events';

// 장바구니 관련 상수 export
export { CART_CONSTANTS } from './cart';

// UI 관련 상수 export
export { UI_CONSTANTS } from './ui';

// ===== 상품 아이디 상수 =====
export const PRODUCT_IDS = {
  KEYBOARD: 'p1',
  MOUSE: 'p2',
  MONITOR_ARM: 'p3',
  LAPTOP_POUCH: 'p4',
  SPEAKER: 'p5',
} as const;

// ===== 상품 목록 =====
export const PRODUCT_LIST: Product[] = [
  {
    id: PRODUCT_IDS.KEYBOARD,
    name: '버그 없애는 키보드',
    price: 10000,
    originalPrice: 10000,
    stock: 50,
    isOnSale: false,
    isSuggestedSale: false,
  },
  {
    id: PRODUCT_IDS.MOUSE,
    name: '생산성 폭발 마우스',
    price: 20000,
    originalPrice: 20000,
    stock: 30,
    isOnSale: false,
    isSuggestedSale: false,
  },
  {
    id: PRODUCT_IDS.MONITOR_ARM,
    name: '거북목 탈출 모니터암',
    price: 30000,
    originalPrice: 30000,
    stock: 20,
    isOnSale: false,
    isSuggestedSale: false,
  },
  {
    id: PRODUCT_IDS.LAPTOP_POUCH,
    name: '에러 방지 노트북 파우치',
    price: 15000,
    originalPrice: 15000,
    stock: 0,
    isOnSale: false,
    isSuggestedSale: false,
  },
  {
    id: PRODUCT_IDS.SPEAKER,
    name: '코딩할 때 듣는 Lo-Fi 스피커',
    price: 25000,
    originalPrice: 25000,
    stock: 10,
    isOnSale: false,
    isSuggestedSale: false,
  },
];

// ===== 상품별 할인율 (10개 이상 구매 시 적용) =====
export const PRODUCT_DISCOUNT_RATE: ProductDiscountRate = {
  [PRODUCT_IDS.KEYBOARD]: 0.10,      // 10%
  [PRODUCT_IDS.MOUSE]: 0.15,         // 15%
  [PRODUCT_IDS.MONITOR_ARM]: 0.20,   // 20%
  [PRODUCT_IDS.LAPTOP_POUCH]: 0.05,  // 5%
  [PRODUCT_IDS.SPEAKER]: 0.25,       // 25%
};

// ===== 할인 정책 상수 =====
export const DISCOUNT_POLICY: DiscountPolicy = {
  // 수량별 할인
  BULK_PURCHASE_THRESHOLD: 30,        // 대량구매 기준 (30개 이상)
  BULK_PURCHASE_RATE: 0.25,           // 대량구매 할인율 (25%)
  INDIVIDUAL_DISCOUNT_THRESHOLD: 10,  // 개별 상품 할인 기준 (10개 이상)
  
  // 시간별 할인
  TUESDAY_DISCOUNT_RATE: 0.10,        // 화요일 할인율 (10%)
  
  // 자동 이벤트 할인
  LIGHTNING_SALE_RATE: 0.20,          // 번개세일 할인율 (20%)
  SUGGESTED_SALE_RATE: 0.05,          // 추천할인 할인율 (5%)
  
  // 중복 할인 (번개세일 + 추천할인)
  SUPER_SALE_RATE: 0.25,              // 슈퍼세일 할인율 (25%)
};

// ===== 자동 이벤트 설정 =====
export const AUTO_EVENT_CONFIG: AutoEventConfig = {
  LIGHTNING_SALE_INTERVAL: 30000,     // 번개세일 간격 (30초)
  SUGGESTED_SALE_INTERVAL: 60000,     // 추천할인 간격 (60초)
  LIGHTNING_SALE_DELAY: 30000,        // 번개세일 시작 지연 (30초)
  SUGGESTED_SALE_DELAY: 60000,        // 추천할인 시작 지연 (60초)
};

// ===== 포인트 적립 정책 =====
export const POINTS_POLICY: PointsPolicy = {
  BASE_RATE: 0.001,                   // 기본 적립율 (구매액의 0.1%)
  TUESDAY_MULTIPLIER: 2,              // 화요일 포인트 배수
  KEYBOARD_MOUSE_BONUS: 50,           // 키보드+마우스 세트 보너스
  FULL_SET_BONUS: 100,                // 풀세트 구매 보너스
  BULK_PURCHASE_BONUS: {
    10: 20,                           // 10개 이상 +20p
    20: 50,                           // 20개 이상 +50p
    30: 100,                          // 30개 이상 +100p
  },
};

// ===== 유틸리티 상수 =====
export const DAYS_OF_WEEK = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
} as const;

export const LOW_STOCK_THRESHOLD = 5;