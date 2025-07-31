import type { Product, CartProduct, AppState } from '../type';
import { PRODUCT, DISCOUNT_RATE, MESSAGE } from '../constants';
import { findProductById } from '../lib/findProductById';
import { calculateCartSummary } from '../services/calculateCartSummary';
import { calculateBonusPoint } from '../services/calculateBonusPoint';

export type State = {
  productList: Product[];
  cartList: CartProduct[];
  appState: AppState;
};

export type Action =
  | { type: 'CHANGE_QUANTITY'; productId: string; delta: number }
  | { type: 'REMOVE_FROM_CART'; productId: string }
  | { type: 'APPLY_FLASH_SALE'; productId: string }
  | { type: 'APPLY_SUGGEST_SALE'; productId: string };

export const initialState: State = {
  productList: [
    {
      id: PRODUCT.ID[1],
      name: PRODUCT.NAME.KEYBOARD,
      changedPrice: 10000,
      originalPrice: 10000,
      quantity: 50,
      flashSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT.ID[2],
      name: PRODUCT.NAME.MOUSE,
      changedPrice: 20000,
      originalPrice: 20000,
      quantity: 30,
      flashSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT.ID[3],
      name: PRODUCT.NAME.MONITOR,
      changedPrice: 30000,
      originalPrice: 30000,
      quantity: 20,
      flashSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT.ID[4],
      name: PRODUCT.NAME.POUCH,
      changedPrice: 15000,
      originalPrice: 15000,
      quantity: 0,
      flashSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT.ID[5],
      name: PRODUCT.NAME.SPEACKER,
      changedPrice: 25000,
      originalPrice: 25000,
      quantity: 10,
      flashSale: false,
      suggestSale: false,
    },
  ],
  cartList: [],
  appState: {
    totalPoints: 0,
    pointsDetail: [],
    totalProductCount: 0,
    totalBeforeDiscount: 0,
    totalAfterDiscount: 0,
    totalDiscountedRate: 0,
    discountedProductList: [],
    lastSelectedProductId: null,
  },
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'CHANGE_QUANTITY': {
      const { productId, delta } = action;

      const product = findProductById(state.productList, productId);
      if (!product) return state;

      // 재고 부족 시
      if (delta > 0 && product.quantity <= 0) {
        alert(MESSAGE.NO_STOCK);
        return state;
      }

      let newCartList = [...state.cartList];
      let newProductList = [...state.productList];

      const productIndex = newProductList.findIndex((item) => item.id === productId);
      const cartIndex = newCartList.findIndex((item) => item.id === productId);

      // 상품 추가
      if (cartIndex === -1 && delta > 0) {
        newCartList.push({ id: productId, count: 1 });
        newProductList[productIndex] = {
          ...newProductList[productIndex],
          quantity: product.quantity - 1,
        };
      }
      // 상품 제거
      else if (cartIndex !== -1 && newCartList[cartIndex].count === 1 && delta < 0) {
        newCartList.splice(cartIndex, 1);
        newProductList[productIndex] = {
          ...newProductList[productIndex],
          quantity: product.quantity + 1,
        };
      }
      // 정상 증감
      else if (cartIndex !== -1) {
        newCartList[cartIndex] = {
          ...newCartList[cartIndex],
          count: newCartList[cartIndex].count + delta,
        };
        newProductList[productIndex] = {
          ...newProductList[productIndex],
          quantity: product.quantity - delta,
        };
      }

      const tempState = {
        cartState: newCartList,
        productState: newProductList,
      };

      const summary = calculateCartSummary(tempState);
      const bonus = calculateBonusPoint({ state: tempState, appState: summary });

      return {
        cartList: newCartList,
        productList: newProductList,
        appState: {
          ...state.appState,
          ...summary,
          ...bonus,
          lastSelectedProductId: productId,
        },
      };
    }

    case 'REMOVE_FROM_CART': {
      const { productId } = action;

      const cartItem = state.cartList.find((item) => item.id === productId);
      if (!cartItem) return state;

      const newCartList = state.cartList.filter((item) => item.id !== productId);
      const newProductList = state.productList.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + cartItem.count, onSale: true } : item
      );

      const tempState = {
        cartState: newCartList,
        productState: newProductList,
      };

      const summary = calculateCartSummary(tempState);
      const bonus = calculateBonusPoint({ state: tempState, appState: summary });

      return {
        cartList: newCartList,
        productList: newProductList,
        appState: {
          ...state.appState,
          ...summary,
          ...bonus,
          lastSelectedProductId: productId,
        },
      };
    }

    case 'APPLY_FLASH_SALE': {
      const { productId } = action;

      const product = findProductById(state.productList, productId);
      if (!product) return state;

      const newProductList = state.productList.map((item) =>
        item.id === productId
          ? { ...item, changedPrice: Math.round(product.originalPrice * (1 - DISCOUNT_RATE.FLASH)), flashSale: true }
          : item
      );

      const tempState = {
        cartState: state.cartList,
        productState: newProductList,
      };

      const summary = calculateCartSummary(tempState);
      const bonus = calculateBonusPoint({ state: tempState, appState: summary });

      return {
        ...state,
        productList: newProductList,
        appState: {
          ...state.appState,
          ...summary,
          ...bonus,
          lastSelectedProductId: productId,
        },
      };
    }

    case 'APPLY_SUGGEST_SALE': {
      const { productId } = action;

      const product = findProductById(state.productList, productId);
      if (!product) return state;

      const newProductList = state.productList.map((item) =>
        item.id === productId
          ? {
              ...item,
              changedPrice: Math.round(product.originalPrice * (1 - DISCOUNT_RATE.SUGGEST)),
              suggestSale: true,
            }
          : item
      );

      const tempState = {
        cartState: state.cartList,
        productState: newProductList,
      };

      const summary = calculateCartSummary(tempState);
      const bonus = calculateBonusPoint({ state: tempState, appState: summary });

      return {
        ...state,
        productList: newProductList,
        appState: {
          ...state.appState,
          ...summary,
          ...bonus,
          lastSelectedProductId: productId,
        },
      };
    }

    default:
      return state;
  }
};
