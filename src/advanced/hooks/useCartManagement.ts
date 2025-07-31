import { useState, useCallback, useMemo } from 'react';
import { Product, CartItem } from '../types';

export const useCartManagement = (products: Product[], setProducts: React.Dispatch<React.SetStateAction<Product[]>>) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product || product.q <= 0) return;

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === productId);
      if (existingItem) {
        // Increase quantity if item already exists
        return prevItems.map(item => 
          item.id === productId 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item
        return [...prevItems, { id: productId, quantity: 1 }];
      }
    });

    // Update product stock
    setProducts(prevProducts => 
      prevProducts.map(p => 
        p.id === productId ? { ...p, q: p.q - 1 } : p
      )
    );
  }, [products]);

  const updateQuantity = useCallback((productId: string, change: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === productId);
      if (!existingItem) return prevItems;

      const newQuantity = existingItem.quantity + change;
      
      if (newQuantity <= 0) {
        // Remove item if quantity becomes 0 or negative
        return prevItems.filter(item => item.id !== productId);
      }

      if (change > 0 && product.q < change) {
        alert('재고가 부족합니다.');
        return prevItems;
      }

      return prevItems.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      );
    });

    // Update product stock
    setProducts(prevProducts => 
      prevProducts.map(p => 
        p.id === productId ? { ...p, q: p.q - change } : p
      )
    );
  }, [products]);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === productId);
      if (!itemToRemove) return prevItems;

      return prevItems.filter(item => item.id !== productId);
    });

    // Restore product stock
    const itemToRemove = cartItems.find(item => item.id === productId);
    if (itemToRemove) {
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === productId ? { ...p, q: p.q + itemToRemove.quantity } : p
        )
      );
    }
  }, [products, cartItems]);

  const totalAmount = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const product = products.find(p => p.id === item.id);
      return total + (product ? product.val * item.quantity : 0);
    }, 0);
  }, [cartItems, products]);

  const itemCount = useMemo(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  return {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    totalAmount,
    itemCount
  };
}; 