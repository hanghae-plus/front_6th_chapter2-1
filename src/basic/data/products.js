/**상품 ID */
export const PRODUCT_IDS = {
  KEYBOARD: 'p1',
  MOUSE: 'p2',
  MONITOR_ARM: 'p3',
  POUCH: 'p4',
  SPEAKER: 'p5',
};

/**상품 목록 */
export const PRODUCT_LIST = [
  {
    productId: PRODUCT_IDS.KEYBOARD,
    name: '버그 없애는 키보드',
    price: 10000,
    originalPrice: 10000,
    stock: 50,
    isOnSale: false,
    isRecommended: false,
  },
  {
    productId: PRODUCT_IDS.MOUSE,
    name: '생산성 폭발 마우스',
    price: 20000,
    originalPrice: 20000,
    stock: 30,
    isOnSale: false,
    isRecommended: false,
  },
  {
    productId: PRODUCT_IDS.MONITOR_ARM,
    name: '거북목 탈출 모니터암',
    price: 30000,
    originalPrice: 30000,
    stock: 20,
    isOnSale: false,
    isRecommended: false,
  },
  {
    productId: PRODUCT_IDS.POUCH,
    name: '에러 방지 노트북 파우치',
    price: 15000,
    originalPrice: 15000,
    stock: 0,
    isOnSale: false,
    isRecommended: false,
  },
  {
    productId: PRODUCT_IDS.SPEAKER,
    name: `코딩할 때 듣는 Lo-Fi 스피커`,
    price: 25000,
    originalPrice: 25000,
    stock: 10,
    isOnSale: false,
    isRecommended: false,
  },
];
