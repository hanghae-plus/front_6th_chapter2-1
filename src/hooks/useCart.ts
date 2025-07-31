import { useState, useCallback, useMemo } from 'react';
import { Product, CartItem } from '../types';
import { calculateCartItems, calculateFinalAmount } from '../services/cartService';
import { PRODUCT_CONSTANTS } from '../constants';

export const useCart = (products: Product[]) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  // 장바구니에 상품 추가
  const addToCart = useCallback(
    (productId: string) => {
      const product = products.find((p) => p.id === productId);

      if (!product || product.quantity <= PRODUCT_CONSTANTS.OUT_OF_STOCK) {
        return;
      }

      setCartItems((prevItems) => {
        const existingItem = prevItems.find((item) => item.productId === productId);

        if (existingItem) {
          return updateExistingItem(prevItems, productId);
        }

        return addNewItem(prevItems, productId, product.price);
      });

      setSelectedProductId(productId);
    },
    [products]
  );

  // 기존 아이템 수량 증가
  const updateExistingItem = useCallback((prevItems: CartItem[], productId: string) => {
    return prevItems.map((item) => (item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item));
  }, []);

  // 새 아이템 추가
  const addNewItem = useCallback((prevItems: CartItem[], productId: string, price: number) => {
    return [
      ...prevItems,
      {
        productId,
        quantity: 1,
        price,
      },
    ];
  }, []);

  // 수량 변경
  const changeQuantity = useCallback((productId: string, change: number) => {
    setCartItems((prevItems) => {
      const item = prevItems.find((item) => item.productId === productId);
      if (!item) return prevItems;

      const newQuantity = item.quantity + change;

      if (newQuantity <= 0) {
        // 아이템 제거
        return prevItems.filter((item) => item.productId !== productId);
      }

      // 수량 업데이트
      return prevItems.map((item) => (item.productId === productId ? { ...item, quantity: newQuantity } : item));
    });
  }, []);

  // 아이템 제거
  const removeItem = useCallback((productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
  }, []);

  // 장바구니 계산
  const cartSummary = useMemo(() => {
    const {
      subtotal,
      totalAmount: calculatedTotal,
      itemCount,
      itemDiscounts,
    } = calculateCartItems(cartItems, products);

    const finalAmount = calculateFinalAmount(subtotal, calculatedTotal, itemCount);

    return {
      subtotal,
      totalDiscount: subtotal - finalAmount,
      finalAmount,
      itemCount,
      itemDiscounts,
      cartItems,
    };
  }, [cartItems, products]);

  return {
    addToCart,
    changeQuantity,
    cartItems,
    cartSummary,
    removeItem,
    setSelectedProductId,
    selectedProductId,
  };
};
