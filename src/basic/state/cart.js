/**
 * 장바구니 상태 관리
 * - 불변성 보장
 * - 순수 함수 중심
 * - 부수 효과 최소화
 */

// ===== 초기 상태 생성 =====
export const createInitialCartState = () => ({
  productInventory: [],
  cartTotalAmount: 0,
  cartItemCount: 0,
  lastSelectedProduct: null,
});

// ===== 순수 함수들 (상태 조회) =====
export const getProductInventory = state => [...state.productInventory];

export const getProduct = (state, productId) =>
  state.productInventory.find(p => p.id === productId) || null;

export const hasProduct = (state, productId) =>
  state.productInventory.some(p => p.id === productId);

export const hasStock = (state, productId) => {
  const product = getProduct(state, productId);
  return product ? product.q > 0 : false;
};

export const getCartTotalAmount = state => state.cartTotalAmount;

export const getCartItemCount = state => state.cartItemCount;

export const getLastSelectedProduct = state => state.lastSelectedProduct;

export const getTotalStock = state =>
  state.productInventory.reduce((total, product) => total + product.q, 0);

// ===== 순수 함수들 (상태 변환) =====
export const initializeCart = (state, productData) => ({
  ...state,
  productInventory: [...productData],
  cartTotalAmount: 0,
  cartItemCount: 0,
  lastSelectedProduct: null,
});

export const updateCartTotals = (state, totalAmount, itemCount) => ({
  ...state,
  cartTotalAmount: totalAmount,
  cartItemCount: itemCount,
});

export const setLastSelectedProduct = (state, productId) => ({
  ...state,
  lastSelectedProduct: productId,
});

export const updateProductQuantity = (state, productId, quantity) => ({
  ...state,
  productInventory: state.productInventory.map(product =>
    product.id === productId ? { ...product, q: quantity } : product
  ),
});

export const decreaseProductQuantity = (state, productId, amount = 1) => ({
  ...state,
  productInventory: state.productInventory.map(product =>
    product.id === productId
      ? { ...product, q: Math.max(0, product.q - amount) }
      : product
  ),
});

export const increaseProductQuantity = (state, productId, amount = 1) => ({
  ...state,
  productInventory: state.productInventory.map(product =>
    product.id === productId ? { ...product, q: product.q + amount } : product
  ),
});
export const updateProductSaleStatus = (state, productId, saleInfo) => ({
  ...state,
  productInventory: state.productInventory.map(product =>
    product.id === productId
      ? {
          ...product,
          ...(saleInfo.onSale !== undefined && { onSale: saleInfo.onSale }),
          ...(saleInfo.suggestSale !== undefined && {
            suggestSale: saleInfo.suggestSale,
          }),
          ...(saleInfo.val !== undefined && { val: saleInfo.val }),
        }
      : product
  ),
});

export const setProductInventory = (state, newInventory) => ({
  ...state,
  productInventory: [...newInventory],
});

// ===== 유틸리티 함수들 =====
export const canAddToCart = (state, productId, quantity = 1) => {
  const product = getProduct(state, productId);
  return product && product.q >= quantity;
};

export const resetCartState = state => createInitialCartState();
