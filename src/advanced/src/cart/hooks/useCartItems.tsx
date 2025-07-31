import { useState } from 'react';
import { Product, CartItem } from 'types';
import { findProductById } from 'product/utils';

interface CartItemData {
  [productId: string]: number;
}

export const useCartItems = (products: Product[]) => {
  const [cartItemsData, setCartItemsData] = useState<CartItemData>({});

  const cartItems: CartItem[] = Object.entries(cartItemsData)
    .filter(([, quantity]) => quantity > 0)
    .map(([productId, quantity]) => {
      const product = findProductById(products, productId);
      if (!product) {
        console.warn(`Product not found: ${productId}`);
        return null;
      }
      return { product, quantity };
    })
    .filter((item): item is CartItem => item !== null);

  const updateItemQuantity = (productId: string, quantity: number) => {
    setCartItemsData((prev) => ({
      ...prev,
      [productId]: Math.max(0, quantity),
    }));
  };

  const addItem = (productId: string, quantity: number = 1) => {
    setCartItemsData((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + quantity,
    }));
  };

  const removeItem = (productId: string) => {
    setCartItemsData((prev) => ({
      ...prev,
      [productId]: 0,
    }));
  };

  const clearCart = () => {
    setCartItemsData({});
  };

  const getItemQuantity = (productId: string): number => {
    return cartItemsData[productId] || 0;
  };

  return {
    cartItems,
    cartItemsData,
    updateItemQuantity,
    addItem,
    removeItem,
    clearCart,
    getItemQuantity,
  };
};
