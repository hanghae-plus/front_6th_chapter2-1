import React, { useEffect } from 'react';

import { CartDisplay } from './components/CartDisplay';
import { ManualOverlay } from './components/ManualOverlay';
import { OrderSummary } from './components/OrderSummary';
import { ProductSelector } from './components/ProductSelector';
import { TIMER_CONFIG } from './constants';
import { useCartManagement } from './hooks/useCartManagement';
import { useDiscountCalculation } from './hooks/useDiscountCalculation';
import { useProductManagement } from './hooks/useProductManagement';

// 전역 타이머 변수들
let lightningTimerId: number | null = null;
let lightningIntervalId: number | null = null;
let recommendationTimerId: number | null = null;
let recommendationIntervalId: number | null = null;

const App: React.FC = () => {
  const {
    products,
    setProducts,
    selectedProduct,
    setSelectedProduct,
    updateProductPrices,
    handleLightningSale,
    handleRecommendationSale
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
    pointsDetail,
    itemDiscounts
  } = useDiscountCalculation(cartItems, products, totalAmount, itemCount);



  // Lightning sale effect
  useEffect(() => {
    // 이미 타이머가 실행 중이면 중단
    if (lightningTimerId || lightningIntervalId) {
      return;
    }
    
    // 원본과 동일: 0~10초 랜덤 지연
    const lightningDelay = Math.random() * TIMER_CONFIG.LIGHTNING_SALE_DELAY;
    
    lightningTimerId = setTimeout(() => {
      lightningIntervalId = setInterval(() => {
        handleLightningSale();
      }, TIMER_CONFIG.LIGHTNING_SALE_INTERVAL);
    }, lightningDelay);

    // eslint-disable-next-line consistent-return
    return () => {
      // cleanup 함수는 컴포넌트 언마운트 시에만 실행
      if (lightningTimerId) {
        clearTimeout(lightningTimerId);
        lightningTimerId = null;
      }
      if (lightningIntervalId) {
        clearInterval(lightningIntervalId);
        lightningIntervalId = null;
      }
    };
  }, []); // 빈 의존성 배열로 한 번만 실행

  // Recommendation sale effect
  useEffect(() => {
    // 이미 타이머가 실행 중이면 중단
    if (recommendationTimerId || recommendationIntervalId) {
      return;
    }
    
    // 원본과 동일: 0~20초 랜덤 지연
    const recommendationDelay = Math.random() * TIMER_CONFIG.RECOMMENDATION_DELAY;
    
    recommendationTimerId = setTimeout(() => {
      recommendationIntervalId = setInterval(() => {
        // 원본과 동일: 마지막 선택한 상품이 있을 때만 추천할인
        if (selectedProduct) {
          handleRecommendationSale(selectedProduct);
        }
      }, TIMER_CONFIG.RECOMMENDATION_INTERVAL);
    }, recommendationDelay);

    // eslint-disable-next-line consistent-return
    return () => {
      // cleanup 함수는 컴포넌트 언마운트 시에만 실행
      if (recommendationTimerId) {
        clearTimeout(recommendationTimerId);
        recommendationTimerId = null;
      }
      if (recommendationIntervalId) {
        clearInterval(recommendationIntervalId);
        recommendationIntervalId = null;
      }
    };
  }, [selectedProduct]); // selectedProduct만 의존성으로 설정

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xs font-medium tracking-extra-wide uppercase mb-2">
          🛒 Hanghae Online Store
        </h1>
        <div className="text-5xl tracking-tight leading-none">Shopping Cart</div>
        <p id="item-count" data-testid="item-count" className="text-sm text-gray-500 font-normal mt-3">
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
            handleProductSelect={setSelectedProduct}
            handleAddToCart={addToCart}
          />
          <CartDisplay
            cartItems={cartItems}
            products={products}
            handleQuantityUpdate={updateQuantity}
            handleItemRemove={removeFromCart}
            handlePriceUpdate={updateProductPrices}
          />
        </div>

        {/* Right Column */}
        <div className="bg-black text-white p-8 flex flex-col">
          <OrderSummary
            cartItems={cartItems}
            products={products}
            totalAmount={totalAmount}
            finalTotal={finalTotal}
            discountRate={discountRate}
            savedAmount={savedAmount}
            loyaltyPoints={loyaltyPoints}
            pointsDetail={pointsDetail}
            itemDiscounts={itemDiscounts}
          />
        </div>
      </div>

      {/* Manual Toggle Button */}
      <ManualOverlay />
    </>
  );
};

export default App; 