import React, { useEffect, useRef, useState } from 'react';

import { Product } from '@/types/product';

import ShoppingCart from './components/cart/ShoppingCart';
import GuideToggle from './components/guide/GuideToggle';
import Header from './components/layout/Header';
import OrderSummary from './components/order/OrderSummary';
import { useOrderSummary } from './hooks/useOrderSummary';
import { PRODUCTS } from './lib/product';

const initialCartItems: { productId: string; quantity: number }[] = [];

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const lastSelRef = useRef<string | null>(null);
  const [cartItems, setCartItems] = useState<{ productId: string; quantity: number }[]>(initialCartItems);

  // 장바구니에 담긴 상품의 총 수량 계산
  const cartTotalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const orderSummary = useOrderSummary(products, cartItems);

  // 번개세일/추천세일 타이머 로직(basic과 동일)
  useEffect(() => {
    // 번개세일(⚡) - 20% 할인
    const lightningDelay = Math.random() * 10000;
    const lightningInterval = setTimeout(() => {
      const interval = setInterval(() => {
        setProducts((prev) => {
          const candidates = prev.filter((p) => p.quantity > 0 && !p.onSale);
          if (candidates.length === 0) return prev;
          const luckyIdx = Math.floor(Math.random() * candidates.length);
          const luckyId = candidates[luckyIdx].id;
          return prev.map((p) => {
            if (p.id === luckyId) {
              alert(`⚡번개세일! ${p.name}이(가) 20% 할인 중입니다!`);
              return {
                ...p,
                discountPrice: Math.round(p.price * 0.8),
                onSale: true,
              };
            }
            return p;
          });
        });
      }, 30000);
      return () => clearInterval(interval);
    }, lightningDelay);
    // 추천세일(💝) - 5% 할인
    const suggestDelay = Math.random() * 20000;
    const suggestInterval = setTimeout(() => {
      const interval = setInterval(() => {
        setProducts((prev) => {
          const lastSel = lastSelRef.current;
          const candidates = prev.filter((p) => p.quantity > 0 && !p.suggestSale && p.id !== lastSel);
          if (candidates.length === 0) return prev;
          const idx = Math.floor(Math.random() * candidates.length);
          const suggest = candidates[idx];
          alert(`💝 ${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          return prev.map((p) =>
            p.id === suggest.id ? { ...p, discountPrice: Math.round(p.discountPrice * 0.95), suggestSale: true } : p
          );
        });
      }, 60000);
      return () => clearInterval(interval);
    }, suggestDelay);
    return () => {
      clearTimeout(lightningInterval);
      clearTimeout(suggestInterval);
    };
  }, []);

  // 상품 선택 추적(추천세일 제외용)
  useEffect(() => {
    if (cartItems.length > 0) {
      lastSelRef.current = cartItems[cartItems.length - 1].productId;
    }
  }, [cartItems]);

  return (
    <>
      <Header itemCount={cartTotalCount} />
      <div id="app" className="max-w-screen-xl h-screen max-h-800 p-0 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
          <div className="flex-1 min-w-0 flex flex-col h-full min-h-0 bg-white border border-gray-200 p-8 overflow-y-auto">
            <GuideToggle />
            <ShoppingCart products={products} cartItems={cartItems} setCartItems={setCartItems} />
          </div>
          <OrderSummary summary={{ ...orderSummary, products, cartItems }} />
        </div>
      </div>
    </>
  );
};

export default App;
