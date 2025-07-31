import { Product } from '../types';

// ==========================================
// 상품 ID 상수들
// ==========================================

export const PRODUCT_ONE = 'p1';
export const PRODUCT_TWO = 'p2';
export const PRODUCT_THREE = 'p3';
export const PRODUCT_FOUR = 'p4';
export const PRODUCT_FIVE = 'p5';

export const PRODUCT_LIST: Product[] = [
  {
    id: PRODUCT_ONE,
    name: '버그 없애는 키보드',
    price: 8000,
    originalPrice: 10000,
    quantity: 50,
    onSale: true,
    suggestSale: false,
  },
  {
    id: PRODUCT_TWO,
    name: '생산성 폭발 마우스',
    price: 19000,
    originalPrice: 20000,
    quantity: 30,
    onSale: false,
    suggestSale: true,
  },
  {
    id: PRODUCT_THREE,
    name: '거북목 탈출 모니터암',
    price: 30000,
    originalPrice: 30000,
    quantity: 20,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_FOUR,
    name: '에러 방지 노트북 파우치',
    price: 15000,
    originalPrice: 15000,
    quantity: 0,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_FIVE,
    name: `코딩할 때 듣는 Lo-Fi 스피커`,
    price: 18750,
    originalPrice: 25000,
    quantity: 10,
    onSale: true,
    suggestSale: true,
  },
];
