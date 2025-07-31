import {
  DISCOUNT_RATES,
  PRODUCT_FIVE,
  PRODUCT_FOUR,
  PRODUCT_ONE,
  PRODUCT_THREE,
  PRODUCT_TWO,
} from '../constants';

let products = [
  {
    id: PRODUCT_ONE,
    name: '버그 없애는 키보드',
    val: 10000,
    originalVal: 10000,
    q: 50,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_TWO,
    name: '생산성 폭발 마우스',
    val: 20000,
    originalVal: 20000,
    q: 30,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_THREE,
    name: '거북목 탈출 모니터암',
    val: 30000,
    originalVal: 30000,
    q: 20,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_FOUR,
    name: '에러 방지 노트북 파우치',
    val: 15000,
    originalVal: 15000,
    q: 0,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_FIVE,
    name: `코딩할 때 듣는 Lo-Fi 스피커`,
    val: 25000,
    originalVal: 25000,
    q: 10,
    onSale: false,
    suggestSale: false,
  },
];

// 모든 상품 목록을 가져옵니다.
export const getProducts = () => products;

// ID로 특정 상품을 찾습니다.
export const getProductById = (id) => products.find((p) => p.id === id);

// 상품 재고를 업데이트합니다. (change는 양수 또는 음수가 될 수 있음)
export const updateProductQuantity = (productId, change) => {
  const product = getProductById(productId);
  if (product) {
    product.q += change;
    return true; // 성공
  }
  return false; // 실패 (상품을 찾을 수 없음)
};

// 번개 세일 적용
export const applyLightningSale = (productId) => {
  const product = getProductById(productId);
  if (product && product.q > 0 && !product.onSale) {
    product.val = Math.round(product.originalVal * (1 - DISCOUNT_RATES.LIGHTNING_SALE_RATE));
    product.onSale = true;
    return product; // 업데이트된 상품 반환
  }
  return null;
};

// 추천 할인 적용
export const applySuggestionSale = (productId) => {
  const product = getProductById(productId);
  if (product && product.q > 0 && !product.suggestSale) {
    product.val = Math.round(product.val * (1 - DISCOUNT_RATES.SUGGESTION_SALE_RATE));
    product.suggestSale = true;
    return product; // 업데이트된 상품 반환
  }
  return null;
};

// 상품 원래 가격 및 할인 상태 초기화 (필요에 따라)
export const resetProductValues = () => {
  products = products.map((p) => ({
    ...p,
    val: p.originalVal,
    onSale: false,
    suggestSale: false,
  }));
};
