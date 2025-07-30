const productState = {
  selectedProduct: null, // 선택된 상품 ID
};

/**
 * 상품 선택 상태 업데이트 함수들
 */
const productStateUpdaters = {
  /**
   * 선택된 상품 업데이트
   */
  updateSelectedProduct(productId) {
    productState.selectedProduct = productId;
  },

  /**
   * 선택된 상품 초기화
   */
  clearSelectedProduct() {
    productState.selectedProduct = null;
  },

  /**
   * 상품 선택 상태 초기화
   */
  reset() {
    productState.selectedProduct = null;
  },
};

/**
 * 상품 선택 상태 구독자들
 */
const productStateSubscribers = [];

/**
 * 상품 선택 상태 변경을 구독하는 함수 등록
 */
function subscribeToProductState(callback) {
  productStateSubscribers.push(callback);
}

/**
 * 상품 선택 상태 변경 시 모든 구독자들에게 알림
 */
function notifyProductStateChange() {
  productStateSubscribers.forEach((callback) => callback(productState));
}

/**
 * 상품 선택 상태 업데이트 래퍼 함수
 */
function updateProductState(updater, ...args) {
  updater(...args);
  notifyProductStateChange();
}

// 상품 선택 상태 업데이트 함수들을 래핑
const productActions = {
  updateSelectedProduct: (productId) =>
    updateProductState(productStateUpdaters.updateSelectedProduct, productId),
  clearSelectedProduct: () => updateProductState(productStateUpdaters.clearSelectedProduct),
  reset: () => updateProductState(productStateUpdaters.reset),
};

// 외부에서 사용할 수 있도록 export
export { productState, productActions, subscribeToProductState };
