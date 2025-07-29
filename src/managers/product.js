import {
  KEYBOARD_ID,
  MOUSE_ID,
  MONITOR_ID,
  HEADPHONE_ID,
  SPEAKER_ID,
} from '../constants/productId.js';

/**
 * 전역 상품 데이터
 * 앱 전체에서 공유되는 상품 목록과 상태
 */
let products = [
  {
    id: KEYBOARD_ID,
    name: '버그 없애는 키보드',
    price: 10000,
    originalPrice: 10000,
    quantity: 50,
    isLightningSale: false,
    isSuggestSale: false,
  },
  {
    id: MOUSE_ID,
    name: '생산성 폭발 마우스',
    price: 20000,
    originalPrice: 20000,
    quantity: 30,
    isLightningSale: false,
    isSuggestSale: false,
  },
  {
    id: MONITOR_ID,
    name: '거북목 탈출 모니터암',
    price: 30000,
    originalPrice: 30000,
    quantity: 20,
    isLightningSale: false,
    isSuggestSale: false,
  },
  {
    id: HEADPHONE_ID,
    name: '에러 방지 노트북 파우치',
    price: 15000,
    originalPrice: 15000,
    quantity: 0,
    isLightningSale: false,
    isSuggestSale: false,
  },
  {
    id: SPEAKER_ID,
    name: `코딩할 때 듣는 Lo-Fi 스피커`,
    price: 25000,
    originalPrice: 25000,
    quantity: 10,
    isLightningSale: false,
    isSuggestSale: false,
  },
];

export function getProduct(productId) {
  return products.find((product) => product.id === productId);
}

export function setProduct(productId, updates) {
  const product = getProduct(productId);
  Object.assign(product, { ...product, ...updates });
  return product;
}

// 모든 상품 조회
export function getAllProducts() {
  return products;
}

// === 마지막 선택 상품 관리 ===
let lastSelectedProduct = null;

export function getLastSelectedProduct() {
  return lastSelectedProduct;
}

export function setLastSelectedProduct(productId) {
  lastSelectedProduct = productId;
}
