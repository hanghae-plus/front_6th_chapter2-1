import { useState, useCallback } from 'react';
import { Product } from '../types';
import { 
  INITIAL_PRODUCTS, 
  DISCOUNT_RATES, 
  TIMER_CONFIG 
} from '../constants';
import { getAvailableForLightningSale, getAvailableForRecommendationSale } from '../utils';

// 전역 변수로 알럿 중복 방지
let lastLightningAlertTime = 0;
let lastRecommendationAlertTime = 0;
let lightningAlertShown = false;
let recommendationAlertShown = false;
let lightningAlertMessage = '';
let recommendationAlertMessage = '';

export const useProductManagement = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<string>('');

  const updateProductPrices = useCallback(() => {
    setProducts(prevProducts => [...prevProducts]);
  }, []);

  const handleLightningSale = useCallback(() => {
    const now = Date.now();
    // 이미 알럿이 표시되었거나 2초 내에 같은 알럿이 표시되지 않도록 방지
    if (lightningAlertShown || now - lastLightningAlertTime < 2000) return;
    
    setProducts(prevProducts => {
      // 재고가 있고, 아직 번개세일이 적용되지 않은 상품만 필터링
      const availableProducts = getAvailableForLightningSale(prevProducts);
      if (availableProducts.length === 0) return prevProducts;

      const luckyProduct = availableProducts[Math.floor(Math.random() * availableProducts.length)];
      const alertMessage = `⚡번개세일! ${luckyProduct.name}이(가) 20% 할인 중입니다!`;
      
      // 같은 메시지가 이미 표시되었는지 확인
      if (lightningAlertMessage === alertMessage) return prevProducts;
      
          const updatedProducts = prevProducts.map(product =>
      product.id === luckyProduct.id
        ? { ...product, price: Math.round(product.originalPrice * (1 - DISCOUNT_RATES.LIGHTNING_SALE)), hasLightningDiscount: true }
        : product
    );

      lastLightningAlertTime = now;
      lightningAlertShown = true;
      lightningAlertMessage = alertMessage;
      alert(alertMessage);
      
      // 5초 후 알럿 플래그 리셋
      setTimeout(() => {
        lightningAlertShown = false;
        lightningAlertMessage = '';
      }, 5000);
      
      return updatedProducts;
    });
  }, []); // 빈 의존성 배열

  const handleRecommendationSale = useCallback((currentProductId: string) => {
    const now = Date.now();
    // 이미 알럿이 표시되었거나 2초 내에 같은 알럿이 표시되지 않도록 방지
    if (recommendationAlertShown || now - lastRecommendationAlertTime < 2000) return;
    
    setProducts(prevProducts => {
            const availableProducts = getAvailableForRecommendationSale(prevProducts, currentProductId);
      
      if (availableProducts.length === 0) return prevProducts;

      const suggestProduct = availableProducts[0];
      const alertMessage = `💝 ${suggestProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`;
      
      // 같은 메시지가 이미 표시되었는지 확인
      if (recommendationAlertMessage === alertMessage) return prevProducts;
      
      const updatedProducts = prevProducts.map(product => {
        if (product.id === suggestProduct.id) {
          // 이미 번개세일이 적용된 경우 SUPER SALE (25%) 적용
          if (product.hasLightningDiscount) {
            return { 
              ...product, 
              price: Math.round(product.originalPrice * 0.75), // 25% 할인
              hasRecommendationDiscount: true 
            };
          } else {
            // 일반 추천할인 (5%) 적용
            return { 
              ...product, 
              price: Math.round(product.originalPrice * (1 - DISCOUNT_RATES.RECOMMENDATION)), 
              hasRecommendationDiscount: true 
            };
          }
        }
        return product;
      });

      lastRecommendationAlertTime = now;
      recommendationAlertShown = true;
      recommendationAlertMessage = alertMessage;
      alert(alertMessage);
      
      // 5초 후 알럿 플래그 리셋
      setTimeout(() => {
        recommendationAlertShown = false;
        recommendationAlertMessage = '';
      }, 5000);
      
      return updatedProducts;
    });
  }, []); // 빈 의존성 배열

  return {
    products,
    setProducts,
    selectedProduct,
    setSelectedProduct,
    updateProductPrices,
    handleLightningSale,
    handleRecommendationSale
  };
}; 