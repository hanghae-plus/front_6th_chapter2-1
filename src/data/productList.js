// 상품 목록 데이터 (products)

export const PRODUCT_IDS = {
  KEYBOARD: 'p1',
  MOUSE: 'p2',
  MONITOR_ARM: 'p3',
  NOTEBOOK_POUCH: 'p4',
  LO_FI_SPEAKER: 'p5',
};

export const products = [
  {
    id: PRODUCT_IDS.KEYBOARD,
    name: '버그 없애는 키보드',
    discountPrice: 10000,
    price: 10000,
    quantity: 50,
    onSale: false,
    suggestSale: false,
    discountRate: 0.1,
  },
  {
    id: PRODUCT_IDS.MOUSE,
    name: '생산성 폭발 마우스',
    discountPrice: 20000,
    price: 20000,
    quantity: 30,
    onSale: false,
    suggestSale: false,
    discountRate: 0.15,
  },
  {
    id: PRODUCT_IDS.MONITOR_ARM,
    name: '거북목 탈출 모니터암',
    discountPrice: 30000,
    price: 30000,
    quantity: 20,
    onSale: false,
    suggestSale: false,
    discountRate: 0.2,
  },
  {
    id: PRODUCT_IDS.NOTEBOOK_POUCH,
    name: '에러 방지 노트북 파우치',
    discountPrice: 15000,
    price: 15000,
    quantity: 0,
    onSale: false,
    suggestSale: false,
    discountRate: 0.05,
  },
  {
    id: PRODUCT_IDS.LO_FI_SPEAKER,
    name: '코딩할 때 듣는 Lo-Fi 스피커',
    discountPrice: 25000,
    price: 25000,
    quantity: 10,
    onSale: false,
    suggestSale: false,
    discountRate: 0.25,
  },
];
