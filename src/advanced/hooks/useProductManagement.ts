import { useState, useCallback } from 'react';
import { Product } from '../types';

const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', name: '버그 없애는 키보드', val: 10000, originalVal: 10000, q: 50, onSale: false, suggestSale: false },
  { id: 'p2', name: '생산성 폭발 마우스', val: 20000, originalVal: 20000, q: 30, onSale: false, suggestSale: false },
  { id: 'p3', name: '거북목 탈출 모니터암', val: 30000, originalVal: 30000, q: 20, onSale: false, suggestSale: false },
  { id: 'p4', name: '에러 방지 노트북 파우치', val: 15000, originalVal: 15000, q: 0, onSale: false, suggestSale: false },
  { id: 'p5', name: '코딩할 때 듣는 Lo-Fi 스피커', val: 25000, originalVal: 25000, q: 10, onSale: false, suggestSale: false }
];

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
          ? { ...p, val: Math.round(p.originalVal * 0.8), onSale: true }
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
          ? { ...p, val: Math.round(p.val * 0.95), suggestSale: true }
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