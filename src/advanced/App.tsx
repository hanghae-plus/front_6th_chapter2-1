import React, { useState, useEffect } from 'react';
import { Product, CartItem } from './types';
import { ProductSelector } from './components/ProductSelector';
import { CartDisplay } from './components/CartDisplay';
import { OrderSummary } from './components/OrderSummary';
import { ManualOverlay } from './components/ManualOverlay';
import { useProductManagement } from './hooks/useProductManagement';
import { useCartManagement } from './hooks/useCartManagement';
import { useDiscountCalculation } from './hooks/useDiscountCalculation';
import { TIMER_CONFIG } from './constants';

const App: React.FC = () => {
  const {
    products,
    setProducts,
    selectedProduct,
    setSelectedProduct,
    updateProductPrices,
    triggerLightningSale,
    triggerRecommendationSale
  } = useProductManagement();

  const {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    totalAmount,
    itemCount
  } = useCartManagement(products, setProducts);

  const {
    discountRate,
    savedAmount,
    finalTotal,
    loyaltyPoints,
    pointsDetail
  } = useDiscountCalculation(cartItems, products, totalAmount, itemCount);

  // Lightning sale effect
  useEffect(() => {
    const lightningDelay = Math.random() * TIMER_CONFIG.LIGHTNING_SALE_DELAY;
    const lightningTimer = setTimeout(() => {
      const lightningInterval = setInterval(() => {
        triggerLightningSale();
      }, TIMER_CONFIG.LIGHTNING_SALE_INTERVAL);
      return () => clearInterval(lightningInterval);
    }, lightningDelay);

    return () => clearTimeout(lightningTimer);
  }, [triggerLightningSale]);

  // Recommendation sale effect
  useEffect(() => {
    const recommendationDelay = Math.random() * TIMER_CONFIG.RECOMMENDATION_DELAY;
    const recommendationTimer = setTimeout(() => {
      const recommendationInterval = setInterval(() => {
        if (cartItems.length > 0 && selectedProduct) {
          triggerRecommendationSale(selectedProduct);
        }
      }, TIMER_CONFIG.RECOMMENDATION_INTERVAL);
      return () => clearInterval(recommendationInterval);
    }, recommendationDelay);

    return () => clearTimeout(recommendationTimer);
  }, [cartItems.length, selectedProduct, triggerRecommendationSale]);

  return (
    <div className="max-w-screen-xl h-screen max-h-800 mx-auto p-8 flex flex-col">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xs font-medium tracking-extra-wide uppercase mb-2">
          🛒 Hanghae Online Store
        </h1>
        <div className="text-5xl tracking-tight leading-none">Shopping Cart</div>
        <p id="item-count" className="text-sm text-gray-500 font-normal mt-3">
          🛍️ {itemCount} items in cart
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
        {/* Left Column */}
        <div className="bg-white border border-gray-200 p-8 overflow-y-auto">
          <ProductSelector
            products={products}
            selectedProduct={selectedProduct}
            onProductSelect={setSelectedProduct}
            onAddToCart={addToCart}
          />
          <CartDisplay
            cartItems={cartItems}
            products={products}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
            onUpdatePrices={updateProductPrices}
          />
        </div>

        {/* Right Column */}
        <OrderSummary
          cartItems={cartItems}
          products={products}
          totalAmount={totalAmount}
          finalTotal={finalTotal}
          discountRate={discountRate}
          savedAmount={savedAmount}
          loyaltyPoints={loyaltyPoints}
          pointsDetail={pointsDetail}
        />
      </div>

      {/* Manual Toggle Button */}
      <ManualOverlay />

      {/* Manual Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300" id="manual-overlay">
        <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300" id="manual-column">
          <button 
            className="absolute top-4 right-4 text-gray-500 hover:text-black"
            onClick={() => {
              document.getElementById('manual-overlay')?.classList.add('hidden');
              document.getElementById('manual-column')?.classList.add('translate-x-full');
            }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          <h2 className="text-xl font-bold mb-4">📖 이용 안내</h2>
          
          <div className="mb-6">
            <h3 className="text-base font-bold mb-3">💰 할인 정책</h3>
            <div className="space-y-3">
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="font-semibold text-sm mb-1">개별 상품</p>
                <p className="text-gray-700 text-xs pl-2">
                  • 키보드 10개↑: 10%<br/>
                  • 마우스 10개↑: 15%<br/>
                  • 모니터암 10개↑: 20%<br/>
                  • 스피커 10개↑: 25%
                </p>
              </div>
              
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="font-semibold text-sm mb-1">전체 수량</p>
                <p className="text-gray-700 text-xs pl-2">• 30개 이상: 25%</p>
              </div>
              
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="font-semibold text-sm mb-1">특별 할인</p>
                <p className="text-gray-700 text-xs pl-2">
                  • 화요일: +10%<br/>
                  • ⚡번개세일: 20%<br/>
                  • 💝추천할인: 5%
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-base font-bold mb-3">🎁 포인트 적립</h3>
            <div className="space-y-3">
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="font-semibold text-sm mb-1">기본</p>
                <p className="text-gray-700 text-xs pl-2">• 구매액의 0.1%</p>
              </div>
              
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="font-semibold text-sm mb-1">추가</p>
                <p className="text-gray-700 text-xs pl-2">
                  • 화요일: 2배<br/>
                  • 키보드+마우스: +50p<br/>
                  • 풀세트: +100p<br/>
                  • 10개↑: +20p / 20개↑: +50p / 30개↑: +100p
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4 mt-4">
            <p className="text-xs font-bold mb-1">💡 TIP</p>
            <p className="text-2xs text-gray-600 leading-relaxed">
              • 화요일 대량구매 = MAX 혜택<br/>
              • ⚡+💝 중복 가능<br/>
              • 상품4 = 품절
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App; 