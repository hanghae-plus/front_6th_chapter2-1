import { useState, useCallback, useMemo } from 'react';
import { CartItem, Product } from '../types';

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // 상품 추가
  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id);

      if (existingItem) {
        // 이미 있는 상품이면 수량 증가
        return prevItems.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        );
      } else {
        // 새로운 상품이면 추가
        return [...prevItems, { product, quantity }];
      }
    });
  }, []);

  // 상품 제거
  const removeFromCart = useCallback((productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  }, []);

  // 수량 변경
  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.product.id === productId ? { ...item, quantity: newQuantity } : item,
        ),
      );
    },
    [removeFromCart],
  );

  // 수량 증가
  const increaseQuantity = useCallback((productId: string) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  }, []);

  // 수량 감소
  const decreaseQuantity = useCallback((productId: string) => {
    setCartItems(
      (prevItems) =>
        prevItems
          .map((item) => {
            if (item.product.id === productId) {
              const newQuantity = item.quantity - 1;
              return newQuantity <= 0 ? null : { ...item, quantity: newQuantity };
            }
            return item;
          })
          .filter(Boolean) as CartItem[],
    );
  }, []);

  // 장바구니 비우기
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // 계산된 값들
  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  const totalAmount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cartItems],
  );

  const uniqueItems = useMemo(() => cartItems.length, [cartItems]);

  return {
    cartItems,
    totalItems,
    totalAmount,
    uniqueItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  };
};
