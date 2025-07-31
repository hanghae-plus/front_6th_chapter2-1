import { useState, useCallback, useMemo } from 'react';
import { Product, CartItem, CartState, UseCartReturn } from '../types/index.js';
import { usePoints } from './usePoints.js';
import {
  calculateItemTotal,
  shouldApplyBulkDiscount,
  calculateBulkDiscountTotal,
  applyTuesdayDiscount,
  createDiscountInfo
} from '../utils';

// 장바구니 관리를 위한 커스텀 훅
export const useCart = (): UseCartReturn => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { calculatePoints } = usePoints();

  // 장바구니 상태 계산 함수
  const calculateCartState = useCallback((items: CartItem[]): CartState => {
    const totalItemCount = items.reduce((acc, item) => acc + item.quantity, 0);
    
    // 기본 계산 (할인 전) - 항상 originalPrice 기준
    const subtotal = items.reduce((acc, item) => 
      acc + (item.originalPrice * item.quantity), 0
    );

    // 할인 계산
    let totalAmount = 0;

    // 대량구매 할인 적용 여부 확인
    if (shouldApplyBulkDiscount(totalItemCount)) {
      totalAmount = calculateBulkDiscountTotal(items);
    } else {
      // 개별 상품별 할인 계산
      totalAmount = items.reduce((acc, item) => 
        acc + calculateItemTotal(item), 0
      );
    }

    // 화요일 할인 적용
    totalAmount = applyTuesdayDiscount(totalAmount);
    totalAmount = Math.round(totalAmount);

    // 할인 정보 생성
    const discountInfo = createDiscountInfo(subtotal, totalAmount, totalItemCount);

    // 포인트 계산
    const pointsInfo = calculatePoints({
      items,
      totalAmount,
      totalItemCount,
      discountInfo,
      pointsInfo: { base: 0, bonus: 0, total: 0, description: [], isTuesdayDouble: false }
    });

    return {
      items,
      totalAmount,
      totalItemCount,
      discountInfo,
      pointsInfo,
    };
  }, [calculatePoints]);

  const cartState: CartState = useMemo(() => {
    return calculateCartState(cartItems);
  }, [cartItems, calculateCartState]);

  // 장바구니에 상품 추가
  const addToCart = useCallback((product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  }, []);

  // 장바구니에서 상품 제거
  const removeFromCart = useCallback((productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  }, []);

  // 상품 수량 업데이트
  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeFromCart]);

  // 장바구니 비우기
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // 장바구니 상품 가격 업데이트 (할인 적용 시)
  const updateCartItemPrices = useCallback((updatedProducts: Product[]) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        const updatedProduct = updatedProducts.find(p => p.id === item.id);
        if (updatedProduct) {
          return {
            ...item,
            price: updatedProduct.price,
            originalPrice: updatedProduct.originalPrice,
            isOnSale: updatedProduct.isOnSale,
            isSuggestedSale: updatedProduct.isSuggestedSale,
          };
        }
        return item;
      })
    );
  }, []);

  return {
    cartState,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    updateCartItemPrices,
  };
};