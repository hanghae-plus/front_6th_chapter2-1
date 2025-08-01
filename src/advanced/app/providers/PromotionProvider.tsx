/**
 * 프로모션 상태 관리를 위한 Context Provider
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PromotionContextType, Product } from '../../shared/types';
import { PROMOTION_TIMERS, BUSINESS_CONSTANTS } from '../../shared/constants';
// import { useCart } from './CartProvider'; // 순환 의존성 방지

const PromotionContext = createContext<PromotionContextType | null>(null);

interface PromotionProviderProps {
  children: ReactNode;
}

interface PromotionProviderExtendedProps extends PromotionProviderProps {
  products: Product[];
  onProductsUpdate: (products: Product[]) => void;
}

export const PromotionProvider: React.FC<PromotionProviderExtendedProps> = ({ 
  children, 
  products, 
  onProductsUpdate 
}) => {
  const [lightningProducts, setLightningProducts] = useState<string[]>([]);
  const [suggestedProducts, setSuggestedProducts] = useState<string[]>([]);
  const [lastSelectedProduct, setLastSelectedProduct] = useState<string | null>(null);

  // 번개세일 타이머
  useEffect(() => {
    const applyLightningSale = () => {
      if (products.length === 0) return;

      // 기존 번개세일 해제
      const resetProducts = products.map(p => ({
        ...p,
        onSale: false,
        val: p.originalVal,
      }));

      // 랜덤 상품 선택 (재고가 있는 상품만)
      const availableProducts = resetProducts.filter(p => p.q > 0);
      if (availableProducts.length === 0) return;

      const randomProduct = availableProducts[Math.floor(Math.random() * availableProducts.length)];
      const updatedProducts = resetProducts.map(p =>
        p.id === randomProduct.id
          ? {
              ...p,
              onSale: true,
              val: Math.round(p.originalVal * (1 - BUSINESS_CONSTANTS.LIGHTNING_SALE_DISCOUNT_RATE)), // 20% 할인
            }
          : p
      );

      setLightningProducts([randomProduct.id]);
      onProductsUpdate(updatedProducts);

      console.log(`⚡ 번개세일! ${randomProduct.name}이(가) 20% 할인 중입니다!`);
    };

    // 초기 딜레이 후 번개세일 시작
    const initialTimer = setTimeout(() => {
      applyLightningSale();
      
      // 주기적으로 번개세일 실행
      const intervalTimer = setInterval(applyLightningSale, PROMOTION_TIMERS.LIGHTNING_SALE.INTERVAL);
      
      return () => clearInterval(intervalTimer);
    }, PROMOTION_TIMERS.LIGHTNING_SALE.DELAY);

    return () => {
      clearTimeout(initialTimer);
    };
  }, [products, onProductsUpdate]);

  // 추천할인 타이머
  useEffect(() => {
    const applySuggestedSale = () => {
      if (products.length === 0 || !lastSelectedProduct) return;

      // 기존 추천할인 해제
      const resetProducts = products.map(p => ({
        ...p,
        suggestSale: false,
        val: p.onSale ? Math.round(p.originalVal * (1 - BUSINESS_CONSTANTS.LIGHTNING_SALE_DISCOUNT_RATE)) : p.originalVal, // 번개세일은 유지
      }));

      // 마지막 선택 상품 제외한 나머지 상품에 5% 할인 적용
      const updatedProducts = resetProducts.map(p =>
        p.id !== lastSelectedProduct && p.q > 0
          ? {
              ...p,
              suggestSale: true,
              val: p.onSale 
                ? Math.round(p.originalVal * (1 - BUSINESS_CONSTANTS.LIGHTNING_SALE_DISCOUNT_RATE) * (1 - BUSINESS_CONSTANTS.SUGGESTED_SALE_DISCOUNT_RATE)) // 번개세일 + 추천할인
                : Math.round(p.originalVal * (1 - BUSINESS_CONSTANTS.SUGGESTED_SALE_DISCOUNT_RATE)), // 추천할인만
            }
          : p
      );

      const discountedProductIds = updatedProducts
        .filter(p => p.suggestSale)
        .map(p => p.id);

      setSuggestedProducts(discountedProductIds);
      onProductsUpdate(updatedProducts);

      if (discountedProductIds.length > 0) {
        console.log('💡 다른 상품은 어떠세요? 추천 상품들이 5% 할인 중입니다!');
      }
    };

    // 초기 딜레이 후 추천할인 시작
    const initialTimer = setTimeout(() => {
      applySuggestedSale();
      
      // 주기적으로 추천할인 실행
      const intervalTimer = setInterval(applySuggestedSale, PROMOTION_TIMERS.SUGGESTED_SALE.INTERVAL);
      
      return () => clearInterval(intervalTimer);
    }, PROMOTION_TIMERS.SUGGESTED_SALE.DELAY);

    return () => {
      clearTimeout(initialTimer);
    };
  }, [products, lastSelectedProduct, onProductsUpdate]);

  const contextValue: PromotionContextType = {
    lightningProducts,
    suggestedProducts,
    lastSelectedProduct,
    setLastSelectedProduct,
  };

  return (
    <PromotionContext.Provider value={contextValue}>
      {children}
    </PromotionContext.Provider>
  );
};

// Custom Hook for using Promotion Context
export const usePromotion = (): PromotionContextType => {
  const context = useContext(PromotionContext);
  if (!context) {
    throw new Error('usePromotion must be used within a PromotionProvider');
  }
  return context;
};