/**
 * 메인 App 컴포넌트
 */

import React from 'react';
import { CartProvider, useCart } from './providers/CartProvider';
import { PromotionProvider } from './providers/PromotionProvider';
import { Header } from '../widgets/Header/Header';
import { ProductSelector } from '../widgets/ProductSelector/ProductSelector';
import { CartList } from '../widgets/CartList/CartList';
import { OrderSummary } from '../widgets/OrderSummary/OrderSummary';
import { HelpModal } from '../widgets/HelpModal/HelpModal';

const AppContent: React.FC = () => {
  const { products, updateProducts } = useCart();

  return (
    <PromotionProvider 
      products={products} 
      onProductsUpdate={updateProducts}
    >
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="container mx-auto max-w-7xl">
          <Header />
          
          {/* 메인 그리드 - 기본과제와 동일한 레이아웃 */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
            {/* 왼쪽 컬럼 */}
            <div className="bg-white border border-gray-200 p-8 overflow-y-auto">
              <ProductSelector />
              <CartList />
            </div>
            
            {/* 오른쪽 컬럼 */}
            <OrderSummary />
          </div>
        </div>
        
        {/* 도움말 모달 */}
        <HelpModal />
      </div>
    </PromotionProvider>
  );
};

const App: React.FC = () => {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
};

export default App;