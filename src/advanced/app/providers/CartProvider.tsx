/**
 * 장바구니 상태 관리를 위한 Context Provider
 */

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { CartContextType, CartItem, Product, Discount } from '../../shared/types';
import { INITIAL_PRODUCTS } from '../../shared/constants';
import { cartReducer, initialCartState } from '../store/cartReducer';
import { usePricing } from '../../shared/hooks/usePricing';
import { usePoints } from '../../shared/hooks/usePoints';

const CartContext = createContext<CartContextType | null>(null);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);
  
  // 가격 계산 및 포인트 계산 Hook 사용
  const { subtotal, totalAmount, discounts, totalDiscount } = usePricing(state.cartItems, state.products);
  const { bonusPoints, pointsDetails } = usePoints(state.cartItems, totalAmount);

  // 상품 데이터 초기화
  useEffect(() => {
    dispatch({ type: 'INITIALIZE_PRODUCTS', payload: INITIAL_PRODUCTS });
  }, []);

  // 장바구니 아이템 추가
  const addToCart = (productId: string) => {
    const product = state.products.find(p => p.id === productId);
    if (!product || product.q <= 0) return;

    dispatch({ type: 'ADD_TO_CART', payload: { productId } });
  };

  // 수량 변경
  const updateQuantity = (productId: string, change: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, change } });
  };

  // 아이템 제거
  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
  };

  // 장바구니 초기화
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // 상품 업데이트 (프로모션 적용 등)
  const updateProducts = (products: Product[]) => {
    dispatch({ type: 'UPDATE_PRODUCTS', payload: products });
  };

  // 아이템 총 개수 계산
  const itemCount = state.cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const contextValue: CartContextType = {
    // 상품 관련
    products: state.products,
    updateProducts,
    
    // 장바구니 관련
    cartItems: state.cartItems,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    
    // 계산된 값들
    itemCount,
    subtotal,
    totalAmount,
    discounts,
    
    // 포인트
    bonusPoints,
    pointsDetails,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Custom Hook for using Cart Context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};