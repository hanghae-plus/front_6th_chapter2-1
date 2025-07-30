import { ACTION_TYPE, createStore } from ".";
import { calculateItemDiscount } from "../utils/cart/calculateItemDiscount";

const isTuesday = new Date().getDay() === 2;

const initialCartState = {
  selectedProductId: null,
  items: [],
  totalAmount: 0,
  itemCount: 0,
  totals: {
    subTotal: 0,
    totalAmount: 0,
    totalQty: 0,
    itemDiscounts: [],
    bulkDiscount: 0,
    tuesdayDiscount: 0,
    isTuesday,
    totalDiscountRate: 0,
    savedAmount: 0,
  },
};

const cartActions = {
  // 상품 선택
  setSelectedProduct: (state, productId) => ({
    ...state,
    selectedProductId: productId,
  }),

  // 장바구니 아이템 업데이트
  updateItems: (state, cartData) => ({
    ...state,
    items: [...cartData],
    itemCount: cartData.reduce((total, item) => total + item.quantity, 0),
  }),

  // 총 금액 업데이트
  setTotalAmount: (state, amount) => ({
    ...state,
    totalAmount: amount,
  }),

  // 장바구니 아이템 추가
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

  // 장바구니 아이템 수량 업데이트
  updateItemQuantity: (state, productId, newQuantity) => {
    if (newQuantity <= 0) {
      // 수량이 0 이하면 아이템 제거
      return {
        ...state,
        items: state.items.filter((item) => item.id !== productId),
      };
    }

    // 수량 업데이트
    return {
      ...state,
      items: state.items.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      ),
    };
  },

  // 장바구니 아이템 수량 조회
  getItemQuantity: (state, productId) => {
    const item = state.items.find((item) => item.id === productId);
    return {
      type: ACTION_TYPE.QUERY,
      data: item ? item.quantity : 0,
    };
  },

  // 장바구니 아이템 조회
  getCartItemByProductId: (state, productId) => {
    const item = state.items.find((item) => item.id === productId);
    return {
      type: ACTION_TYPE.QUERY,
      data: item,
    };
  },

  // 장바구니 아이템 존재 체크
  isExistInCart: (state, productId) => {
    const item = state.items.find((item) => item.id === productId);
    return {
      type: ACTION_TYPE.QUERY,
      data: item ? true : false,
    };
  },

  // 장바구니 아이템 수량 조회
  getCartTotalItemCount: (state) => {
    return {
      type: ACTION_TYPE.QUERY,
      data: state.items.reduce((total, item) => total + item.quantity, 0),
    };
  },

  // 장바구니 아이템 총 금액 조회
  getCartOriginalTotalAmount: (state) => {
    return {
      type: ACTION_TYPE.QUERY,
      data: state.items.reduce(
        (total, item) => total + item.quantity * item.val,
        0
      ),
    };
  },

  // 장바구니 아이템 총 금액 조회
  getCartTotalAmountWithDiscount: (state) => {
    return {
      type: ACTION_TYPE.QUERY,
      data: state.items.reduce((total, item) => {
        const discountPercent = calculateItemDiscount(item.id, item.quantity);
        return total + item.quantity * item.val * (1 - discountPercent);
      }, 0),
    };
  },

  // 장바구니 아이템 총 금액 조회
  updateTotals: (state, totals) => ({
    ...state,
    totals: { ...state.totals, ...totals },
  }),

  // 장바구니 초기화
  reset: (state) => ({
    ...state,
    selectedProductId: null,
    items: [],
    totalAmount: 0,
    itemCount: 0,
  }),
};

const cartStore = createStore(initialCartState, cartActions);

export default cartStore;
