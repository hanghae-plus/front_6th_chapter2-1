import {
  KEYBOARD_ID,
  MOUSE_ID,
  MONITOR_ID,
  HEADPHONE_ID,
  SPEAKER_ID,
} from '../constants/index.js';

/** 비즈니스 상태 저장소 */
export const businessState = {
  products: [],
  bonusPoints: 0,
  itemCount: 0,
  totalAmount: 0,
  lastSelectedProductId: null,
};

/** 상품 데이터 초기화 */
function initializeProductData() {
  return [
    {
      id: KEYBOARD_ID,
      name: '버그 없애는 키보드',
      price: 10000,
      originalPrice: 10000,
      stock: 50,
      isOnSale: false,
      isSuggestedSale: false,
    },
    {
      id: MOUSE_ID,
      name: '생산성 폭발 마우스',
      price: 20000,
      originalPrice: 20000,
      stock: 30,
      isOnSale: false,
      isSuggestedSale: false,
    },
    {
      id: MONITOR_ID,
      name: '거북목 탈출 모니터암',
      price: 30000,
      originalPrice: 30000,
      stock: 20,
      isOnSale: false,
      isSuggestedSale: false,
    },
    {
      id: HEADPHONE_ID,
      name: '에러 방지 노트북 파우치',
      price: 15000,
      originalPrice: 15000,
      stock: 0,
      isOnSale: false,
      isSuggestedSale: false,
    },
    {
      id: SPEAKER_ID,
      name: '코딩할 때 듣는 Lo-Fi 스피커',
      price: 25000,
      originalPrice: 25000,
      stock: 10,
      isOnSale: false,
      isSuggestedSale: false,
    },
  ];
}

/** 비즈니스 상태 초기화 */
export function initializeBusinessState() {
  businessState.totalAmount = 0;
  businessState.itemCount = 0;
  businessState.lastSelectedProductId = null;
  businessState.bonusPoints = 0;
  businessState.products = initializeProductData();
}

/** 상태 접근자 함수들 */
export function getProducts() {
  return businessState.products;
}

export function getProductById(id) {
  return businessState.products.find((product) => product.id === id);
}

export function getBonusPoints() {
  return businessState.bonusPoints;
}

export function setBonusPoints(points) {
  businessState.bonusPoints = points;
}

export function getItemCount() {
  return businessState.itemCount;
}

export function setItemCount(count) {
  businessState.itemCount = count;
}

export function getTotalAmount() {
  return businessState.totalAmount;
}

export function setTotalAmount(amount) {
  businessState.totalAmount = amount;
}

export function getLastSelectedProductId() {
  return businessState.lastSelectedProductId;
}

export function setLastSelectedProductId(id) {
  businessState.lastSelectedProductId = id;
}
