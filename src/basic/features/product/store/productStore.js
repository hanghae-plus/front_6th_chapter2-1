import { initialProducts } from '../constants/index.js';

/**
 * 상품 상태 관리 함수들
 */

// 상태
let productState = {
  products: initialProducts,
  amount: 0,
  itemCount: 0,
  lastSelectedProduct: null,
};

// 리스너들
const listeners = [];

/**
 * 상태 가져오기
 */
export const getProductState = () => ({ ...productState });

/**
 * 상태 설정
 */
export const setProductState = updates => {
  productState = { ...productState, ...updates };
  notifyListeners();
};

/**
 * 리스너 등록
 */
export const subscribeToProductState = listener => {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
};

/**
 * 리스너들에게 변경 알림
 */
const notifyListeners = () => {
  listeners.forEach(listener => listener(productState));
};

/**
 * 선택된 상품 설정
 */
export const setSelectedProduct = productId => {
  setProductState({
    lastSelectedProduct: productId,
  });
};

/**
 * 상품 목록 업데이트
 */
export const updateProducts = products => {
  setProductState({
    products,
  });
};

/**
 * 상품 수량 업데이트
 */
export const updateItemCount = count => {
  setProductState({
    itemCount: count,
  });
};

/**
 * 상품 금액 업데이트
 */
export const updateAmount = amount => {
  setProductState({
    amount,
  });
};

/**
 * 스토어 초기화
 */
export const initializeProductStore = initialState => {
  productState = {
    products: initialProducts,
    amount: 0,
    itemCount: 0,
    lastSelectedProduct: null,
    ...initialState,
  };
  listeners.length = 0; // 리스너 초기화
};

/**
 * 스토어 리셋
 */
export const resetProductStore = () => {
  initializeProductStore();
};

// 현재 상태를 외부에서 접근할 수 있도록 export (하위 호환성)
export { productState };
