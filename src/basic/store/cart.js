import { createStore, QUERY } from ".";
import { products } from "./product";

export const cartState = {
  selectedProductId: null,
  items: [],
  totalAmount: 0,
  itemCount: 0,
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

  addCartItem: (state, productItem) => {
    // 장바구니에 이미 있는 상품인지 확인
    const isExistItem = state.items.find((item) => item.id === productItem.id);
    console.log("실행됨", isExistItem);
    // 이미 있는 상품이면 수량 증가
    if (isExistItem) {
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === productItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };
    }
    console.log("추가됨!?");
    // 없는 상품이면 새로 추가
    return {
      ...state,
      items: [...state.items, { ...productItem, quantity: 1 }],
    };
  },

  getItemQuantity: (state, productId) => {
    const item = state.items.find((item) => item.id === productId);
    return {
      type: QUERY,
      data: item ? item.quantity : 0,
    };
  },

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
