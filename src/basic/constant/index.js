export const LIGHTNING_DELAY = Math.random() * 10000;
export const SUGGEST_DELAY = Math.random() * 20000;

export const LIGHTNING_INTERVAL = 30000;
export const SUGGEST_INTERVAL = 60000;

export const PRODUCT_IDS = {
  P1: 'p1', // 버그 없애는 키보드
  P2: 'p2', // 생산성 폭발 마우스
  P3: 'p3', // 거북목 탈출 모니터암
  P4: 'p4', // 에러 방지 노트북 파우치
  P5: 'p5', // 코딩할 때 듣는 Lo-Fi 스피커
};

export const DISCOUNT_RATES = {
  INDIVIDUAL: {
    [PRODUCT_IDS.P1]: 0.1,
    [PRODUCT_IDS.P2]: 0.15,
    [PRODUCT_IDS.P3]: 0.2,
    [PRODUCT_IDS.P5]: 0.25,
  },
  BULK: 0.25,
  TUESDAY: 0.1,
};

export const INITIAL_PRODUCTS = [
  {
    id: PRODUCT_IDS.P1,
    name: '버그 없애는 키보드',
    price: 10000,
    originalPrice: 10000,
    quantity: 50,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_IDS.P2,
    name: '생산성 폭발 마우스',
    price: 20000,
    originalPrice: 20000,
    quantity: 30,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_IDS.P3,
    name: '거북목 탈출 모니터암',
    price: 30000,
    originalPrice: 30000,
    quantity: 20,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_IDS.P4,
    name: '에러 방지 노트북 파우치',
    price: 15000,
    originalPrice: 15000,
    quantity: 0,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_IDS.P5,
    name: `코딩할 때 듣는 Lo-Fi 스피커`,
    price: 25000,
    originalPrice: 25000,
    quantity: 10,
    onSale: false,
    suggestSale: false,
  },
];

export const POINTS = {
  BASE_RATE: 1000, // 1000원당 1포인트
  COMBO_KEYBOARD_MOUSE: 50,
  FULL_SET: 100,
  BULK_L1: 20, // 10개 이상
  BULK_L2: 50, // 20개 이상
  BULK_L3: 100, // 30개 이상
};
