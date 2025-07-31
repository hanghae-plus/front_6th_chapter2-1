// src/advanced/App.tsx
import React, { useState } from 'react';
import { useCart } from './hooks/useCart';
import { useSpecialSales } from './hooks/useSpecialSales';
import { ProductSelector } from './components/ProductSelector';
import { CartList } from './components/CartList';
import { OrderSummary } from './components/OrderSummary';
import { HelpModal } from './components/HelpModal';

export function App() {
  const { state, dispatch } = useCart();
  const { cart } = state;
  const [isHelpOpen, setHelpOpen] = useState(false);

  // Special sales timer hook
  useSpecialSales(state, dispatch);

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <div className="font-sans bg-gray-50 text-gray-800 flex flex-col min-h-screen">
        <header className="p-8">
          <h1 className="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
          <div className="text-5xl tracking-tight leading-none">Shopping Cart</div>
          <p id="item-count" className="text-sm text-gray-500 font-normal mt-3">🛍️ {totalQuantity} items in cart</p>
        </header>
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 p-8 pt-0">
          <section className="bg-white border border-gray-200 p-8 overflow-y-auto">
            <ProductSelector />
            <CartList />
          </section>
          <aside>
            <OrderSummary />
          </aside>
        </main>
      </div>
      <button 
        onClick={() => setHelpOpen(true)}
        className="fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50"
        aria-label="도움말 열기"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </button>
      <HelpModal isOpen={isHelpOpen} onClose={() => setHelpOpen(false)} />
    </>
  );
}
