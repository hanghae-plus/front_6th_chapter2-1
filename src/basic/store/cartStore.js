import Store from '../lib/Store';

/**
 * cartItem
 *
 * {
 * product...
 * quantity
 * }
 */
const cartState = {
  cartItems: [],
  lastSelect: null,
  selectedProductId: null, // 선택된 상품 ID 추가
};

const cartStore = new Store(cartState);

export default cartStore;
