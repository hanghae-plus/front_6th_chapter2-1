/** 장바구니 아이템 */
export const CartItemState = {
  productId: '',
  productName: '',
  quantity: 0,
  price: 0,
};

/** 장바구니 전체 상태 */
export const CartState = {
  items: [],
  totalAmount: 0,
  totalItemCount: 0,
  discountAmount: 0,
};

/** 상품 관련 상태 */
export const ProductState = {
  selected: null,
  list: [],
  stockInfo: null,
};

/** 앱 전체 상태 */
export const AppState = {
  cart: CartState,
  product: ProductState,
};
