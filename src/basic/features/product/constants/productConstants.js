// Product related constants
export const PRODUCT_CONSTANTS = {
  STOCK: {
    LOW_STOCK_THRESHOLD: 5,
    STOCK_WARNING_THRESHOLD: 50,
    STOCK_SHORTAGE_THRESHOLD: 30,
  },
};

// Product related DOM element IDs
export const PRODUCT_ELEMENT_IDS = {
  PRODUCT_SELECT: 'product-select',
  ADD_TO_CART: 'add-to-cart',
  STOCK_STATUS: 'stock-status',
};

// Product data
export const PRODUCTS = {
  KEYBOARD: 'p1',
  MOUSE: 'p2',
  MONITOR_ARM: 'p3',
  LAPTOP_POUCH: 'p4',
  SPEAKER: 'p5',
};

export const initialProducts = [
  {
    id: PRODUCTS.KEYBOARD,
    name: '버그 없애는 키보드',
    val: 10000,
    originalVal: 10000,
    q: 50,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCTS.MOUSE,
    name: '생산성 폭발 마우스',
    val: 20000,
    originalVal: 20000,
    q: 30,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCTS.MONITOR_ARM,
    name: '거북목 탈출 모니터암',
    val: 30000,
    originalVal: 30000,
    q: 20,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCTS.LAPTOP_POUCH,
    name: '에러 방지 노트북 파우치',
    val: 15000,
    originalVal: 15000,
    q: 0,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCTS.SPEAKER,
    name: `코딩할 때 듣는 Lo-Fi 스피커`,
    val: 25000,
    originalVal: 25000,
    q: 10,
    onSale: false,
    suggestSale: false,
  },
];
