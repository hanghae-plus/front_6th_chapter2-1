/**
 * 프로모션 상태 관리를 위한 Context Provider
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PromotionContextType, Product } from '../../shared/types';
import { PROMOTION_TIMERS, BUSINESS_CONSTANTS } from '../../shared/constants';
import { usePromotionTimer } from '../../shared/hooks/usePromotionTimer';
import { useCart } from './CartProvider';

// 번개세일 적용 로직 (순수 함수)
const applyLightningSaleToProducts = (products: Product[]): { updatedProducts: Product[]; selectedProductId: string | null } => {
  if (products.length === 0) {
    return { updatedProducts: products, selectedProductId: null };
  }

  // 기존 번개세일 해제
  const resetProducts = products.map(p => ({
    ...p,
    onSale: false,
    val: p.originalVal,
  }));

  // 랜덤 상품 선택 (재고가 있는 상품만)
  const availableProducts = resetProducts.filter(p => p.q > 0);
  if (availableProducts.length === 0) {
    return { updatedProducts: resetProducts, selectedProductId: null };
  }

  const randomProduct = availableProducts[Math.floor(Math.random() * availableProducts.length)];
  const updatedProducts = resetProducts.map(p =>
    p.id === randomProduct.id
      ? {
          ...p,
          onSale: true,
          val: Math.round(p.originalVal * (1 - BUSINESS_CONSTANTS.LIGHTNING_SALE_DISCOUNT_RATE)),
        }
      : p
  );

  return { updatedProducts, selectedProductId: randomProduct.id };
};

// 추천할인 적용 로직 (순수 함수)
const applySuggestedSaleToProducts = (products: Product[], lastSelectedProduct: string | null): { updatedProducts: Product[]; discountedProductIds: string[] } => {
  if (products.length === 0 || !lastSelectedProduct) {
    return { updatedProducts: products, discountedProductIds: [] };
  }

  // 기존 추천할인 해제
  const resetProducts = products.map(p => ({
    ...p,
    suggestSale: false,
    val: p.onSale ? Math.round(p.originalVal * (1 - BUSINESS_CONSTANTS.LIGHTNING_SALE_DISCOUNT_RATE)) : p.originalVal,
  }));

  // 마지막 선택 상품 제외한 나머지 상품에 5% 할인 적용
  const updatedProducts = resetProducts.map(p =>
    p.id !== lastSelectedProduct && p.q > 0
      ? {
          ...p,
          suggestSale: true,
          val: p.onSale 
            ? Math.round(p.originalVal * (1 - BUSINESS_CONSTANTS.LIGHTNING_SALE_DISCOUNT_RATE) * (1 - BUSINESS_CONSTANTS.SUGGESTED_SALE_DISCOUNT_RATE))
            : Math.round(p.originalVal * (1 - BUSINESS_CONSTANTS.SUGGESTED_SALE_DISCOUNT_RATE)),
        }
      : p
  );

  const discountedProductIds = updatedProducts
    .filter(p => p.suggestSale)
    .map(p => p.id);

  return { updatedProducts, discountedProductIds };
};

const PromotionContext = createContext<PromotionContextType | null>(null);

interface PromotionProviderProps {
  children: ReactNode;
}

export const PromotionProvider: React.FC<PromotionProviderProps> = ({ children }) => {
  const { products, updateProducts } = useCart();
  const [lightningProducts, setLightningProducts] = useState<string[]>([]);
  const [suggestedProducts, setSuggestedProducts] = useState<string[]>([]);
  const [lastSelectedProduct, setLastSelectedProduct] = useState<string | null>(null);

  // 번개세일 타이머
  const applyLightningSale = () => {
    const { updatedProducts, selectedProductId } = applyLightningSaleToProducts(products);
    
    if (selectedProductId) {
      const selectedProduct = updatedProducts.find(p => p.id === selectedProductId);
      setLightningProducts([selectedProductId]);
      updateProducts(updatedProducts);
      console.log(`⚡ 번개세일! ${selectedProduct?.name}이(가) 20% 할인 중입니다!`);
    }
  };

  usePromotionTimer({
    callback: applyLightningSale,
    interval: PROMOTION_TIMERS.LIGHTNING_SALE.INTERVAL,
    delay: PROMOTION_TIMERS.LIGHTNING_SALE.DELAY,
    dependencies: [products, updateProducts],
  });

  // 추천할인 타이머
  const applySuggestedSale = () => {
    const { updatedProducts, discountedProductIds } = applySuggestedSaleToProducts(products, lastSelectedProduct);
    
    setSuggestedProducts(discountedProductIds);
    updateProducts(updatedProducts);

    if (discountedProductIds.length > 0) {
      console.log('💡 다른 상품은 어떠세요? 추천 상품들이 5% 할인 중입니다!');
    }
  };

  usePromotionTimer({
    callback: applySuggestedSale,
    interval: PROMOTION_TIMERS.SUGGESTED_SALE.INTERVAL,
    delay: PROMOTION_TIMERS.SUGGESTED_SALE.DELAY,
    dependencies: [products, lastSelectedProduct, updateProducts],
  });

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