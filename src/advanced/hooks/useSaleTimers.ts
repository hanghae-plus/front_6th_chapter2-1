// ==========================================
// 세일 타이머 훅
// ==========================================

import { useEffect } from 'react';
import { DISCOUNT_RATES, TIMERS } from '../constant/index';
import type { Product } from '../types';

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  val: number;
  originalVal: number;
  onSale: boolean;
  suggestSale: boolean;
}

export function useSaleTimers(
  products: Product[],
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>,
  cartItems: CartItem[],
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>
) {
  // 🔥 번개세일 타이머 (기존 로직 복원)
  useEffect(() => {
    const lightningDelay = Math.random() * TIMERS.MAX_LIGHTNING_DELAY;
    
    const lightningTimer = setTimeout(() => {
      const interval = setInterval(() => {
        setProducts(prevProducts => {
          const availableProducts = prevProducts.filter(p => p.quantity > 0 && !p.onSale);
          if (availableProducts.length === 0) return prevProducts;
          
          const luckyIdx = Math.floor(Math.random() * availableProducts.length);
          const luckyItem = availableProducts[luckyIdx];
          
          alert(`⚡번개세일! ${luckyItem.name}이(가) ${DISCOUNT_RATES.LIGHTNING_SALE * 100}% 할인 중입니다!`);
          
          return prevProducts.map(product => 
            product.id === luckyItem.id 
              ? { 
                  ...product, 
                  val: Math.round(product.originalVal * (1 - DISCOUNT_RATES.LIGHTNING_SALE)),
                  onSale: true 
                }
              : product
          );
        });
        
        // 장바구니 아이템들도 할인 가격으로 업데이트
        setCartItems(prevItems => 
          prevItems.map(item => {
            const updatedProduct = products.find(p => p.id === item.id);
            return updatedProduct && updatedProduct.onSale
              ? { ...item, val: updatedProduct.val, onSale: true }
              : item;
          })
        );
      }, TIMERS.LIGHTNING_SALE_INTERVAL);
      
      return () => clearInterval(interval);
    }, lightningDelay);
    
    return () => clearTimeout(lightningTimer);
  }, [products, setProducts, setCartItems]);

  // 💝 추천할인 타이머 (기존 로직 복원)
  useEffect(() => {
    const suggestDelay = Math.random() * TIMERS.MAX_INITIAL_DELAY;
    
    const suggestTimer = setTimeout(() => {
      const interval = setInterval(() => {
        if (cartItems.length === 0) return;
        
        setProducts(prevProducts => {
          const availableProducts = prevProducts.filter(p => p.quantity > 0 && !p.suggestSale);
          if (availableProducts.length === 0) return prevProducts;
          
          const suggest = availableProducts[Math.floor(Math.random() * availableProducts.length)];
          
          alert(`💝 ${suggest.name}은(는) 어떠세요? 지금 구매하시면 ${DISCOUNT_RATES.SUGGEST_SALE * 100}% 추가 할인!`);
          
          return prevProducts.map(product => 
            product.id === suggest.id 
              ? { 
                  ...product, 
                  val: Math.round(product.val * (1 - DISCOUNT_RATES.SUGGEST_SALE)),
                  suggestSale: true 
                }
              : product
          );
        });
        
        // 장바구니 아이템들도 할인 가격으로 업데이트
        setCartItems(prevItems => 
          prevItems.map(item => {
            const updatedProduct = products.find(p => p.id === item.id);
            return updatedProduct && updatedProduct.suggestSale
              ? { ...item, val: updatedProduct.val, suggestSale: true }
              : item;
          })
        );
      }, TIMERS.SUGGEST_SALE_INTERVAL);
      
      return () => clearInterval(interval);
    }, suggestDelay);
    
    return () => clearTimeout(suggestTimer);
  }, [cartItems.length, products, setProducts, setCartItems]);
}