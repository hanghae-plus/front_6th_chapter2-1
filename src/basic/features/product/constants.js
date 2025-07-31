export const PRODUCT_ID = {
  KEYBOARD: 'p1',
  MOUSE: 'p2',
  MONITOR_ARM: 'p3',
  POUCH: 'p4',
  SPEAKER: 'p5',
};

export const DISCOUNT_RATE = {
  [PRODUCT_ID.KEYBOARD]: 0.1,
  [PRODUCT_ID.MOUSE]: 0.15,
  [PRODUCT_ID.MONITOR_ARM]: 0.2,
  [PRODUCT_ID.POUCH]: 0.05,
  [PRODUCT_ID.SPEAKER]: 0.25,
};

export const productList = [
  {
    id: PRODUCT_ID.KEYBOARD,
    name: '버그 없애는 키보드',
    value: 10000,
    originalValue: 10000,
    quantity: 50,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_ID.MOUSE,
    name: '생산성 폭발 마우스',
    value: 20000,
    originalValue: 20000,
    quantity: 30,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_ID.MONITOR_ARM,
    name: '거북목 탈출 모니터암',
    value: 30000,
    originalValue: 30000,
    quantity: 20,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_ID.POUCH,
    name: '에러 방지 노트북 파우치',
    value: 15000,
    originalValue: 15000,
    quantity: 0,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_ID.SPEAKER,
    name: `코딩할 때 듣는 Lo-Fi 스피커`,
    value: 25000,
    originalValue: 25000,
    quantity: 10,
    onSale: false,
    suggestSale: false,
  },
];
