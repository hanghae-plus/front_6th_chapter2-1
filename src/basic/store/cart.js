import { createStore } from ".";
import { products } from "./products";

export const cartState = {
  selectedProductId: null,
  items: [],
  totalAmount: 0,
  itemCount: 0,
  products, // 단순 참조용 (products는 불변하니까..?)
};

const cartActions = {
  setSelectedProduct: (state, productId) => ({
    ...state,
    selectedProductId: productId,
  }),

  updateItems: (state, cartData) => ({
    ...state,
    items: [...cartData],
    itemCount: cartData.reduce((total, item) => total + item.quantity, 0),
  }),

  setTotalAmount: (state, amount) => ({
    ...state,
    totalAmount: amount,
  }),

  reset: (state) => ({
    ...state,
    selectedProductId: null,
    items: [],
    totalAmount: 0,
    itemCount: 0,
  }),
};

const cartStore = createStore(cartState, cartActions);

export default cartStore;
