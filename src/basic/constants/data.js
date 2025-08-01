import {
  PRODUCT_KEYBOARD,
  PRODUCT_MOUSE,
  PRODUCT_MONITOR_ARM,
  PRODUCT_LAPTOP_POUCH,
  PRODUCT_SPEAKER,
} from './constants';
function initProductList() {
  return [
    {
      id: PRODUCT_KEYBOARD,
      name: '버그 없애는 키보드',
      val: 10000,
      originalVal: 10000,
      availableStock: 50,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_MOUSE,
      name: '생산성 폭발 마우스',
      val: 20000,
      originalVal: 20000,
      availableStock: 30,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_MONITOR_ARM,
      name: '거북목 탈출 모니터암',
      val: 30000,
      originalVal: 30000,
      availableStock: 20,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_LAPTOP_POUCH,
      name: '에러 방지 노트북 파우치',
      val: 15000,
      originalVal: 15000,
      availableStock: 0,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_SPEAKER,
      name: `코딩할 때 듣는 Lo-Fi 스피커`,
      val: 25000,
      originalVal: 25000,
      availableStock: 10,
      onSale: false,
      suggestSale: false,
    },
  ];
}

export { initProductList };
