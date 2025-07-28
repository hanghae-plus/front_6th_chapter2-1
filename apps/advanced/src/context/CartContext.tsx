/**
 * 장바구니 Context API 구현
 * React Context API를 활용한 전역 상태 관리
 */

import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useReducer
} from 'react';
import {
  CartActions,
  CartContextType,
  CartItem,
  CartState
} from '../types/cart.types';
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
type CartAction =
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { productId: string } }
  | {
      type: 'UPDATE_QUANTITY';
      payload: { productId: string; quantity: number };
    }
  | { type: 'CLEAR_CART' }
  | { type: 'RECALCULATE_TOTALS' };

// Context 생성
const CartContext = createContext<CartContextType | undefined>(undefined);

// 선언적 헬퍼 함수들
const createCartItem = (product: Product, quantity: number): CartItem => {
  const item: CartItem = {
    product,
    quantity,
    subtotal: 0, // 임시값, 아래에서 계산
    discount: 0, // 임시값, 아래에서 계산
    points: 0 // 임시값, 아래에서 계산
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
) =>
  items
    .map(item =>
      item.product.id === productId
        ? updateCartItem(item, Math.max(0, quantity))
        : item
    )
    .filter(item => item.quantity > 0);

// 총계 계산 함수 (이미 선언적)
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

// 리듀서 구현 (선언적으로 개선)
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

// Provider 컴포넌트
export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // 액션 함수들 - useCallback으로 메모이제이션
  const addToCart = useCallback((product: Product, quantity: number) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { productId } });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  // Context 값 메모이제이션
  const value: CartContextType = useMemo(
    () => ({
      ...state,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart
    }),
    [state, addToCart, removeFromCart, updateQuantity, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Hook 구현
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// 성능 최적화를 위한 분리된 Hook들
export const useCartState = (): CartState => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartState must be used within a CartProvider');
  }
  const { items, totalPrice, totalDiscount, totalPoints, itemCount } = context;
  return { items, totalPrice, totalDiscount, totalPoints, itemCount };
};

export const useCartActions = (): CartActions => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartActions must be used within a CartProvider');
  }
  const { addToCart, removeFromCart, updateQuantity, clearCart } = context;
  return { addToCart, removeFromCart, updateQuantity, clearCart };
};
