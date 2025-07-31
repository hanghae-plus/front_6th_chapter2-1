import { useState, useCallback, useMemo } from 'react';
import { Product, CartItem } from '../types';
import { findProductById, findProductByCartItem } from '../utils';

// 전역 변수로 재고 알럿 중복 방지
let lastStockAlertTime = 0;

export const useCartManagement = (products: Product[], setProducts: React.Dispatch<React.SetStateAction<Product[]>>) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((productId: string) => {
    const product = findProductById(products, productId);
    if (!product || product.quantity <= 0) {
      const now = Date.now();
      if (now - lastStockAlertTime > 2000) {
        lastStockAlertTime = now;
        alert('재고가 부족합니다.');
      }
      return;
    }

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.productId === productId);
      if (existingItem) {
        // Increase quantity if item already exists
        const newItems = prevItems.map(item => 
          item.productId === productId 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return newItems;
      } else {
        // Add new item
        const newItems = [...prevItems, { productId, quantity: 1 }];
        console.log('Added new item:', newItems);
        return newItems;
      }
    });

    // Update product stock (원본과 동일: 재고가 0이 되면 더 이상 감소하지 않음)
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === productId ? { ...product, quantity: Math.max(0, product.quantity - 1) } : product
      )
    );
  }, [products]);

  const updateQuantity = useCallback((productId: string, change: number) => {
    const product = findProductById(products, productId);
    if (!product) return;

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.productId === productId);
      if (!existingItem) return prevItems;

      const newQuantity = existingItem.quantity + change;
      
      if (newQuantity <= 0) {
        // Remove item if quantity becomes 0 or negative
        return prevItems.filter(item => item.productId !== productId);
      }

      // Check stock availability for increase (원본과 동일)
      if (change > 0 && product.quantity <= 0) {
        const now = Date.now();
        if (now - lastStockAlertTime > 2000) {
          lastStockAlertTime = now;
          alert('재고가 부족합니다.');
        }
        return prevItems;
      }

      return prevItems.map(item => 
        item.productId === productId 
          ? { ...item, quantity: newQuantity }
          : item
      );
    });

    // Update product stock (원본과 동일: 재고가 0이 되면 더 이상 감소하지 않음)
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === productId ? { ...product, quantity: Math.max(0, product.quantity - change) } : product
      )
    );
  }, [products]);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.productId === productId);
      if (!itemToRemove) return prevItems;

      // Restore product stock
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === productId ? { ...product, quantity: product.quantity + itemToRemove.quantity } : product
        )
      );

      return prevItems.filter(item => item.productId !== productId);
    });
  }, []);

  const totalAmount = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const product = findProductByCartItem(products, item);
      return total + (product ? product.price * item.quantity : 0);
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