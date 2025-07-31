import { useState, useCallback } from 'react';
import { CartItem, Product } from '../types';

export function useCart(initialItems: CartItem[] = []) {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialItems);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [lastSelectedProduct, setLastSelectedProduct] = useState<string>('');

  const addToCart = useCallback(
    (product: Product) => {
      setLastSelectedProduct(product.id);

      const existingItem = cartItems.find((item) => item.id === product.id);
      if (existingItem) {
        setCartItems((items) =>
          items.map((item) =>
            item.id === product.id
              ? { ...item, cartQuantity: (item.cartQuantity || 1) + 1 }
              : item
          )
        );
      } else {
        setCartItems((items) => [...items, { ...product, cartQuantity: 1 }]);
      }
    },
    [cartItems]
  );

  const updateQuantity = useCallback((productId: string, change: number) => {
    setCartItems((items) =>
      items
        .map((item) => {
          if (item.id === productId) {
            const newQuantity = (item.cartQuantity || 1) + change;
            return newQuantity <= 0
              ? item
              : { ...item, cartQuantity: newQuantity };
          }
          return item;
        })
        .filter((item) => (item.cartQuantity || 1) > 0)
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    setCartItems((items) => items.filter((item) => item.id !== productId));
  }, []);

  const updateCartItemPrices = useCallback((products: Product[]) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        const updatedProduct = products.find((p) => p.id === item.id);
        return updatedProduct ? { ...item, price: updatedProduct.price } : item;
      })
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setSelectedProductId('');
    setLastSelectedProduct('');
  }, []);

  const getTotalItemCount = useCallback(() => {
    return cartItems.reduce((sum, item) => sum + (item.cartQuantity || 1), 0);
  }, [cartItems]);

  return {
    cartItems,
    selectedProductId,
    lastSelectedProduct,
    setSelectedProductId,
    addToCart,
    updateQuantity,
    removeItem,
    updateCartItemPrices,
    clearCart,
    getTotalItemCount,
  };
}
