import { ACTION_TYPE, createStore } from ".";
import { calculateItemDiscount } from "../utils/cart/calculateItemDiscount";

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

    // 없는 상품이면 새로 추가
    return {
      ...state,
      items: [...state.items, { ...productItem, quantity: 1 }],
    };
  },

  getItemQuantity: (state, productId) => {
    const item = state.items.find((item) => item.id === productId);
    return {
      type: ACTION_TYPE.QUERY,
      data: item ? item.quantity : 0,
    };
  },

  getCartItemByProductId: (state, productId) => {
    const item = state.items.find((item) => item.id === productId);
    return {
      type: ACTION_TYPE.QUERY,
      data: item,
    };
  },

  isExistInCart: (state, productId) => {
    const item = state.items.find((item) => item.id === productId);
    return {
      type: ACTION_TYPE.QUERY,
      data: item ? true : false,
    };
  },

  getCartTotalItemCount: (state) => {
    return {
      type: ACTION_TYPE.QUERY,
      data: state.items.reduce((total, item) => total + item.quantity, 0),
    };
  },
  getCartOriginalTotalAmount: (state) => {
    return {
      type: ACTION_TYPE.QUERY,
      data: state.items.reduce(
        (total, item) => total + item.quantity * item.val,
        0
      ),
    };
  },

  getCartTotalAmountWithDiscount: (state) => {
    return {
      type: ACTION_TYPE.QUERY,
      data: state.items.reduce((total, item) => {
        const discountPercent = calculateItemDiscount(item.id, item.quantity);
        return total + item.quantity * item.val * (1 - discountPercent);
      }, 0),
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
