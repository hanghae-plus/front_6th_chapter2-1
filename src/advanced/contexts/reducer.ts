import { INITIAL_PRODUCTS, PRODUCT_IDS } from '../constant';
import { State, Action } from '../types';

export const initialState = {
  products: INITIAL_PRODUCTS,
  cartList: [],
  notifications: [],
  lastSelectedId: null,
  selectedProductId: PRODUCT_IDS.P1,
};

export function reducer(state: State, action: Action): State {
  const { type, payload } = action;

  switch (type) {
    case 'ADD_ITEM': {
      const { productId } = payload;
      const product = state.products.find((p) => p.id === productId);

      if (product && product.quantity <= 0) {
        return {
          ...state,
          notifications: [
            ...state.notifications,
            { id: new Date(), message: '재고가 부족합니다.' },
          ],
        };
      }

      const existingItemIndex = state.cartList.findIndex((item) => item.productId === productId);

      const newCartList =
        existingItemIndex > -1
          ? state.cartList.map((item, index) =>
              index === existingItemIndex ? { ...item, quantity: item.quantity + 1 } : item,
            )
          : [...state.cartList, { productId, quantity: 1 }];

      const newProducts = state.products.map((p) =>
        p.id === productId ? { ...p, quantity: p.quantity - 1 } : p,
      );

      return { ...state, products: newProducts, cartList: newCartList };
    }

    case 'REMOVE_ITEM': {
      const { productId } = payload;
      const itemInCart = state.cartList.find((item) => item.productId === productId);
      if (!itemInCart) return state;

      const newProducts = state.products.map((p) =>
        p.id === productId ? { ...p, quantity: p.quantity + itemInCart.quantity } : p,
      );
      const newCartList = state.cartList.filter((item) => item.productId !== productId);

      return { ...state, products: newProducts, cartList: newCartList };
    }

    case 'INCREASE_QUANTITY': {
      const { productId } = payload;
      const product = state.products.find((p) => p.id === productId);

      if (product && product.quantity <= 0) {
        return {
          ...state,
          notifications: [
            ...state.notifications,
            { id: new Date(), message: '재고가 부족합니다.' },
          ],
        };
      }

      const newCartList = state.cartList.map((item) =>
        item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
      );
      const newProducts = state.products.map((p) =>
        p.id === productId ? { ...p, quantity: p.quantity - 1 } : p,
      );

      return { ...state, products: newProducts, cartList: newCartList };
    }

    case 'DECREASE_QUANTITY': {
      const { productId } = payload;
      let newCartList = state.cartList.map((item) =>
        item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item,
      );

      newCartList = newCartList.filter((item) => item.quantity > 0);

      const newProducts = state.products.map((p) =>
        p.id === productId ? { ...p, quantity: p.quantity + 1 } : p,
      );

      return { ...state, products: newProducts, cartList: newCartList };
    }

    case 'START_LIGHTNING_SALE': {
      const luckyIdx = Math.floor(Math.random() * state.products.length);
      const luckyItem = state.products[luckyIdx];

      const newProducts = state.products.map((p) =>
        p.id === luckyItem.id
          ? { ...p, price: Math.round((p.originalPrice * 80) / 100), onSale: true }
          : p,
      );
      const product = newProducts.find((p) => p.id === luckyItem.id);

      if (!product) return state;

      return {
        ...state,
        products: newProducts,
        notifications: [
          ...state.notifications,
          { id: new Date(), message: `⚡번개세일! ${product.name}이(가) 20% 할인 중입니다!` },
        ],
      };
    }

    case 'START_SUGGEST_SALE': {
      if (!state.lastSelectedId) return state;

      const luckyItem = state.products.find(
        (p) => p.id !== state.lastSelectedId && p.quantity > 0 && !p.suggestSale,
      );

      if (!luckyItem) return state;

      const newProducts = state.products.map((p) =>
        p.id === luckyItem.id ? { ...p, price: Math.round(p.price * 0.95), suggestSale: true } : p,
      );

      return {
        ...state,
        products: newProducts,
        notifications: [
          ...state.notifications,
          {
            id: new Date(),
            message: `💝 ${luckyItem.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`,
          },
        ],
      };
    }

    case 'SET_SELECTED_PRODUCT': {
      return { ...state, selectedProductId: payload.productId };
    }

    case 'SET_LAST_SELECTED': {
      return { ...state, lastSelectedId: payload.productId };
    }

    case 'REMOVE_NOTIFICATION': {
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== payload.notificationId),
      };
    }

    default:
      return state;
  }
}
