import { useReducer } from 'react';
import { CartItem, CartState } from '../types/cart.types';
import { Product } from '../types/product.types';
import {
  calculateItemDiscount,
  calculateItemPoints,
  calculateItemSubtotal
} from '../utils/calculations';

// 초기 상태
const initialState: CartState = {
  items: [],
  totalPrice: 0,
  totalDiscount: 0,
  totalPoints: 0,
  itemCount: 0
};

// 액션 타입 정의
export type CartAction =
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { productId: string } }
  | {
      type: 'UPDATE_QUANTITY';
      payload: { productId: string; quantity: number };
    }
  | { type: 'CLEAR_CART' }
  | { type: 'RECALCULATE_TOTALS' };

// 액션 생성자들 (Action Creators)
export const cartActions = {
  addToCart: (product: Product, quantity: number): CartAction => ({
    type: 'ADD_TO_CART',
    payload: { product, quantity }
  }),

  removeFromCart: (productId: string): CartAction => ({
    type: 'REMOVE_FROM_CART',
    payload: { productId }
  }),

  updateQuantity: (productId: string, quantity: number): CartAction => ({
    type: 'UPDATE_QUANTITY',
    payload: { productId, quantity }
  }),

  clearCart: (): CartAction => ({
    type: 'CLEAR_CART'
  }),

  recalculateTotals: (): CartAction => ({
    type: 'RECALCULATE_TOTALS'
  })
};

// 선언적 헬퍼 함수들
const createCartItem = (product: Product, quantity: number): CartItem => {
  const item: CartItem = {
    product,
    quantity,
    subtotal: 0,
    discount: 0,
    points: 0
  };

  return {
    ...item,
    subtotal: calculateItemSubtotal(item),
    discount: calculateItemDiscount(item),
    points: calculateItemPoints(item)
  };
};

const updateCartItem = (item: CartItem, newQuantity: number): CartItem => {
  const updatedItem: CartItem = {
    ...item,
    quantity: newQuantity
  };

  return {
    ...updatedItem,
    subtotal: calculateItemSubtotal(updatedItem),
    discount: calculateItemDiscount(updatedItem),
    points: calculateItemPoints(updatedItem)
  };
};

const findExistingItem = (items: CartItem[], productId: string) =>
  items.find(item => item.product.id === productId);

const updateExistingItem = (
  items: CartItem[],
  productId: string,
  quantity: number
) =>
  items.map(item =>
    item.product.id === productId
      ? updateCartItem(item, item.quantity + quantity)
      : item
  );

const addNewItem = (items: CartItem[], product: Product, quantity: number) => [
  ...items,
  createCartItem(product, quantity)
];

const removeItem = (items: CartItem[], productId: string) =>
  items.filter(item => item.product.id !== productId);

const updateItemQuantity = (
  items: CartItem[],
  productId: string,
  quantity: number
) => {
  if (quantity <= 0) {
    return items.filter(item => item.product.id !== productId);
  }

  return items.map(item =>
    item.product.id === productId ? updateCartItem(item, quantity) : item
  );
};

// 총계 계산 함수
const calculateCartTotals = (items: CartItem[]): CartState => {
  const totalPrice = items.reduce((sum, item) => sum + item.subtotal, 0);
  const totalDiscount = items.reduce((sum, item) => sum + item.discount, 0);
  const totalPoints = items.reduce((sum, item) => sum + item.points, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    totalPrice,
    totalDiscount,
    totalPoints,
    itemCount
  };
};

// 리듀서 구현
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, quantity } = action.payload;
      const existingItem = findExistingItem(state.items, product.id);

      const newItems = existingItem
        ? updateExistingItem(state.items, product.id, quantity)
        : addNewItem(state.items, product, quantity);

      return calculateCartTotals(newItems);
    }

    case 'REMOVE_FROM_CART': {
      const newItems = removeItem(state.items, action.payload.productId);
      return calculateCartTotals(newItems);
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      const newItems = updateItemQuantity(state.items, productId, quantity);
      return calculateCartTotals(newItems);
    }

    case 'CLEAR_CART':
      return initialState;

    case 'RECALCULATE_TOTALS':
      return calculateCartTotals(state.items);

    default:
      return state;
  }
};

// ViewModel Hook
export const useCartViewModel = () => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // 액션 디스패치 함수들
  const addToCart = (product: Product, quantity: number) => {
    dispatch(cartActions.addToCart(product, quantity));
  };

  const removeFromCart = (productId: string) => {
    dispatch(cartActions.removeFromCart(productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch(cartActions.updateQuantity(productId, quantity));
  };

  const clearCart = () => {
    dispatch(cartActions.clearCart());
  };

  const recalculateTotals = () => {
    dispatch(cartActions.recalculateTotals());
  };

  // 계산된 값들
  const cartSummary = {
    totalItems: state.itemCount,
    totalPrice: state.totalPrice,
    totalDiscount: state.totalDiscount,
    totalPoints: state.totalPoints,
    finalPrice: state.totalPrice - state.totalDiscount
  };

  const cartItems = state.items;

  const isEmpty = state.items.length === 0;

  return {
    // 상태
    cartItems,
    cartSummary,
    isEmpty,

    // 액션들
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    recalculateTotals
  };
};
