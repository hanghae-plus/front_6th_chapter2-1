import { KEYBOARD, MOUSE, MONITOR_ARM, NOTEBOOK_CASE, SPEAKER } from '../constants.js';

/**
 * 상품 목록 데이터
 * @type {Array<Object>}
 */
export const productList = [
  {
    id: KEYBOARD,
    name: '버그 없애는 키보드',
    val: 10000,
    originalVal: 10000,
    quantity: 50,
    onSale: false,
    suggestSale: false,
  },
  {
    id: MOUSE,
    name: '생산성 폭발 마우스',
    val: 20000,
    originalVal: 20000,
    quantity: 30,
    onSale: false,
    suggestSale: false,
  },
  {
    id: MONITOR_ARM,
    name: '거북목 탈출 모니터암',
    val: 30000,
    originalVal: 30000,
    quantity: 20,
    onSale: false,
    suggestSale: false,
  },
  {
    id: NOTEBOOK_CASE,
    name: '에러 방지 노트북 파우치',
    val: 15000,
    originalVal: 15000,
    quantity: 0,
    onSale: false,
    suggestSale: false,
  },
  {
    id: SPEAKER,
    name: `코딩할 때 듣는 Lo-Fi 스피커`,
    val: 25000,
    originalVal: 25000,
    quantity: 10,
    onSale: false,
    suggestSale: false,
  },
];
