import { useState, useCallback } from 'react';
import { Product, UseProductsReturn } from '../types';
import { PRODUCT_LIST, LOW_STOCK_THRESHOLD } from '../constants';

/**
 * 상품 관리를 위한 커스텀 훅
 */
export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>(() => 
    PRODUCT_LIST.map(product => ({ ...product }))
  );

  const getProductById = useCallback((id: string): Product | undefined => {
    return products.find(product => product.id === id);
  }, [products]);

  const updateStock = useCallback((productId: string, quantity: number) => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === productId 
          ? { ...product, stock: Math.max(0, product.stock - quantity) }
          : product
      )
    );
  }, []);

  const getLowStockItems = useCallback((): Product[] => {
    return products.filter(product => 
      product.stock < LOW_STOCK_THRESHOLD && product.stock > 0
    );
  }, [products]);

  const getOutOfStockItems = useCallback((): Product[] => {
    return products.filter(product => product.stock === 0);
  }, [products]);

  // 번개세일 시작
  const startLightningSale = useCallback((productId: string) => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === productId 
          ? { 
              ...product, 
              isOnSale: true, 
              price: Math.round(product.originalPrice * 0.8) // 20% 할인
            }
          : product
      )
    );
  }, []);

  // 추천할인 시작
  const startSuggestedSale = useCallback((productId: string) => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === productId 
          ? { 
              ...product, 
              isSuggestedSale: true, 
              price: Math.round(product.originalPrice * 0.95) // 5% 할인
            }
          : product
      )
    );
  }, []);

  // 세일 상태 초기화
  const resetSaleStatus = useCallback((productId: string) => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === productId 
          ? { 
              ...product, 
              isOnSale: false, 
              isSuggestedSale: false, 
              price: product.originalPrice
            }
          : product
      )
    );
  }, []);

  return {
    products,
    getProductById,
    updateStock,
    getLowStockItems,
    getOutOfStockItems,
    startLightningSale,
    startSuggestedSale,
    resetSaleStatus,
  };
};