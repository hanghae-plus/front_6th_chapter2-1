import { PRODUCT_IDS } from './business-rules.js';

export const PRODUCT_DATA = [
  {
    id: PRODUCT_IDS.keyboard,
    name: '버그 없애는 키보드',
    val: 10000,
    originalVal: 10000,
    q: 50,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_IDS.mouse,
    name: '생산성 폭발 마우스',
    val: 20000,
    originalVal: 20000,
    q: 30,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_IDS.monitorArm,
    name: '거북목 탈출 모니터암',
    val: 30000,
    originalVal: 30000,
    q: 20,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_IDS.laptopPouch,
    name: '에러 방지 노트북 파우치',
    val: 15000,
    originalVal: 15000,
    q: 0,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_IDS.speaker,
    name: '코딩할 때 듣는 Lo-Fi 스피커',
    val: 25000,
    originalVal: 25000,
    q: 10,
    onSale: false,
    suggestSale: false,
  },
];

// 상품별 할인율 매핑
export const PRODUCT_DISCOUNT_MAP = {
  [PRODUCT_IDS.keyboard]: 0.1,
  [PRODUCT_IDS.mouse]: 0.15,
  [PRODUCT_IDS.monitorArm]: 0.2,
  [PRODUCT_IDS.laptopPouch]: 0.05,
  [PRODUCT_IDS.speaker]: 0.25,
};
