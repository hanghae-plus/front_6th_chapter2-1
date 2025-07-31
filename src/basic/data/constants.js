// 상품 아이디
export const PRODUCT_KEYBOARD = 'p1';
export const PRODUCT_MOUSE = 'p2';
export const PRODUCT_MONITOR_ARM = 'p3';
export const PRODUCT_LAPTOP_POUCH = 'p4';
export const PRODUCT_SPEAKER = 'p5';

// 상품 목록
export const PRODUCT_LIST = [
  {
    id: PRODUCT_KEYBOARD, 
    name: '버그 없애는 키보드', 
    price: 10000, 
    originalPrice: 10000, 
    stock: 50, 
    isOnSale: false, 
    isSuggestedSale: false
  },
  {
    id: PRODUCT_MOUSE, 
    name: '생산성 폭발 마우스', 
    price: 20000, 
    originalPrice: 20000, 
    stock: 30, 
    isOnSale: false, 
    isSuggestedSale: false
  },
  {
    id: PRODUCT_MONITOR_ARM, 
    name: '거북목 탈출 모니터암', 
    price: 30000, 
    originalPrice: 30000, 
    stock: 20, 
    isOnSale: false, 
    isSuggestedSale: false
  },
  {
    id: PRODUCT_LAPTOP_POUCH, 
    name: '에러 방지 노트북 파우치', 
    price: 15000, 
    originalPrice: 15000, 
    stock: 0, 
    isOnSale: false, 
    isSuggestedSale: false
  },
  {
    id: PRODUCT_SPEAKER,
    name: '코딩할 때 듣는 Lo-Fi 스피커',
    price: 25000,
    originalPrice: 25000,
    stock: 10,
    isOnSale: false,
    isSuggestedSale: false
  }
];

// 상품별 할인율 (10개 이상 구매 시 적용)
export const PRODUCT_DISCOUNT_RATE = {
  [PRODUCT_KEYBOARD]: 0.10,      // 10%
  [PRODUCT_MOUSE]: 0.15,          // 15%
  [PRODUCT_MONITOR_ARM]: 0.20,    // 20%
  [PRODUCT_LAPTOP_POUCH]: 0.05,   // 5%
  [PRODUCT_SPEAKER]: 0.25         // 25%
};

// 할인 정책 상수
export const DISCOUNT_POLICY = {
  // 수량별 할인
  BULK_PURCHASE_THRESHOLD: 30,    // 대량구매 기준 (30개 이상)
  BULK_PURCHASE_RATE: 0.25,       // 대량구매 할인율 (25%)
  INDIVIDUAL_DISCOUNT_THRESHOLD: 10, // 개별 상품 할인 기준 (10개 이상)
  
  // 시간별 할인
  TUESDAY_DISCOUNT_RATE: 0.10,    // 화요일 할인율 (10%)
  
  // 자동 이벤트 할인
  LIGHTNING_SALE_RATE: 0.20,      // 번개세일 할인율 (20%)
  SUGGESTED_SALE_RATE: 0.05,      // 추천할인 할인율 (5%)
  
  // 중복 할인 (번개세일 + 추천할인)
  SUPER_SALE_RATE: 0.25           // 슈퍼세일 할인율 (25%)
};

// 자동 이벤트 설정
export const AUTO_EVENT_CONFIG = {
  LIGHTNING_SALE_INTERVAL: 30000, // 번개세일 간격 (30초)
  SUGGESTED_SALE_INTERVAL: 60000, // 추천할인 간격 (60초)
  LIGHTNING_SALE_DELAY: 10000,    // 번개세일 시작 지연 (10초)
  SUGGESTED_SALE_DELAY: 20000     // 추천할인 시작 지연 (20초)
};

// 포인트 적립 정책
export const POINTS_POLICY = {
  BASE_RATE: 0.001,               // 기본 적립율 (구매액의 0.1%)
  TUESDAY_MULTIPLIER: 2,          // 화요일 포인트 배수
  KEYBOARD_MOUSE_BONUS: 50,       // 키보드+마우스 세트 보너스
  FULL_SET_BONUS: 100,            // 풀세트 구매 보너스
  BULK_PURCHASE_BONUS: {
    10: 20,                       // 10개 이상 +20p
    20: 50,                       // 20개 이상 +50p
    30: 100                       // 30개 이상 +100p
  }
};

