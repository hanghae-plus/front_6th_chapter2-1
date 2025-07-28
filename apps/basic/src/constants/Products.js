/**
 * 상품 정보 상수 정의
 * 모든 상품 관련 정보를 중앙집중적으로 관리합니다.
 */

/**
 * @typedef {Object} Product
 * @property {string} id - 상품 고유 ID
 * @property {string} name - 상품명
 * @property {number} price - 기본 가격 (원)
 * @property {number} stock - 초기 재고
 * @property {number} discountRate - 할인율 (0.1 = 10%)
 * @property {number} discountThreshold - 할인 적용 최소 수량
 */

/**
 * 상품 ID 상수
 */
export const PRODUCT_IDS = {
  KEYBOARD: 'p1',
  MOUSE: 'p2',
  MONITOR_ARM: 'p3',
  LAPTOP_POUCH: 'p4',
  LOFI_SPEAKER: 'p5'
};

/**
 * 할인 적용 최소 수량 상수
 */
export const DISCOUNT_THRESHOLDS = {
  INDIVIDUAL_DISCOUNT_MIN: 10, // 개별 상품 할인 최소 수량
  BULK_DISCOUNT_MIN: 30 // 전체 수량 할인 최소 수량
};

/**
 * 상품 정보 상수 객체
 * @type {Object.<string, Product>}
 */
export const PRODUCTS = {
  KEYBOARD: {
    id: PRODUCT_IDS.KEYBOARD,
    name: '버그 없애는 키보드',
    price: 10000,
    stock: 50,
    discountRate: 0.1,
    discountThreshold: DISCOUNT_THRESHOLDS.INDIVIDUAL_DISCOUNT_MIN
  },
  MOUSE: {
    id: PRODUCT_IDS.MOUSE,
    name: '생산성 폭발 마우스',
    price: 20000,
    stock: 30,
    discountRate: 0.15,
    discountThreshold: DISCOUNT_THRESHOLDS.INDIVIDUAL_DISCOUNT_MIN
  },
  MONITOR_ARM: {
    id: PRODUCT_IDS.MONITOR_ARM,
    name: '거북목 탈출 모니터암',
    price: 30000,
    stock: 20,
    discountRate: 0.2,
    discountThreshold: DISCOUNT_THRESHOLDS.INDIVIDUAL_DISCOUNT_MIN
  },
  LAPTOP_POUCH: {
    id: PRODUCT_IDS.LAPTOP_POUCH,
    name: '에러 방지 노트북 파우치',
    price: 15000,
    stock: 0, // 품절
    discountRate: 0.05,
    discountThreshold: DISCOUNT_THRESHOLDS.INDIVIDUAL_DISCOUNT_MIN
  },
  LOFI_SPEAKER: {
    id: PRODUCT_IDS.LOFI_SPEAKER,
    name: '코딩할 때 듣는 Lo-Fi 스피커',
    price: 25000,
    stock: 10,
    discountRate: 0.25,
    discountThreshold: DISCOUNT_THRESHOLDS.INDIVIDUAL_DISCOUNT_MIN
  }
};

/**
 * 상품 목록을 배열 형태로 반환
 * @returns {Product[]} 상품 배열
 */
export function getProductList() {
  return Object.values(PRODUCTS);
}

/**
 * 상품 ID로 상품 정보 조회
 * @param {string} productId - 상품 ID
 * @returns {Product|undefined} 상품 정보 또는 undefined
 */
export function getProductById(productId) {
  return Object.values(PRODUCTS).find(product => product.id === productId);
}

/**
 * 레거시 호환성을 위한 상품 ID 매핑
 * @deprecated 새로운 코드에서는 PRODUCT_IDS 사용 권장
 */
export const LEGACY_PRODUCT_IDS = {
  PRODUCT_ONE: PRODUCT_IDS.KEYBOARD,
  p2: PRODUCT_IDS.MOUSE,
  product_3: PRODUCT_IDS.MONITOR_ARM,
  p4: PRODUCT_IDS.LAPTOP_POUCH,
  PRODUCT_5: PRODUCT_IDS.LOFI_SPEAKER
};
