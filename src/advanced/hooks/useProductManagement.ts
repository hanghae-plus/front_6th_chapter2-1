import { useState, useCallback } from 'react';
import { Product } from '../types';
import { 
  INITIAL_PRODUCTS, 
  DISCOUNT_RATES, 
  TIMER_CONFIG 
} from '../constants';

export const useProductManagement = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<string>('');

  const updateProductPrices = useCallback(() => {
    setProducts(prevProducts => [...prevProducts]);
  }, []);

  const triggerLightningSale = useCallback(() => {
    setProducts(prevProducts => {
      const availableProducts = prevProducts.filter(p => p.q > 0 && !p.onSale);
      if (availableProducts.length === 0) return prevProducts;

      const luckyProduct = availableProducts[Math.floor(Math.random() * availableProducts.length)];
      const updatedProducts = prevProducts.map(p => 
        p.id === luckyProduct.id 
          ? { ...p, val: Math.round(p.originalVal * (1 - DISCOUNT_RATES.LIGHTNING_SALE)), onSale: true }
          : p
      );

      alert(`⚡번개세일! ${luckyProduct.name}이(가) 20% 할인 중입니다!`);
      return updatedProducts;
    });
  }, []);

  const triggerRecommendationSale = useCallback((currentProductId: string) => {
    setProducts(prevProducts => {
      const availableProducts = prevProducts.filter(p => 
        p.id !== currentProductId && p.q > 0 && !p.suggestSale
      );
      
      if (availableProducts.length === 0) return prevProducts;

      const suggestProduct = availableProducts[0];
      const updatedProducts = prevProducts.map(p => 
        p.id === suggestProduct.id 
          ? { ...p, val: Math.round(p.val * (1 - DISCOUNT_RATES.RECOMMENDATION)), suggestSale: true }
          : p
      );

      alert(`💝 ${suggestProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
      return updatedProducts;
    });
  }, []);

  return {
    products,
    setProducts,
    selectedProduct,
    setSelectedProduct,
    updateProductPrices,
    triggerLightningSale,
    triggerRecommendationSale
  };
}; 