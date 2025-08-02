import { useCallback } from 'react';
import type { Product } from '../types';

export function useProductService() {
  const findProductById = useCallback((products: Product[], productId: string) => {
    return products.find(product => product.id === productId);
  }, []);

  const getRandomProduct = useCallback((products: Product[]) => {
    const availableProducts = products.filter(
      product => product.quantity > 0 && !product.isOnLightningSale
    );

    if (availableProducts.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * availableProducts.length);
    return availableProducts[randomIndex];
  }, []);

  const findAvailableProductForSuggestion = useCallback((products: Product[], excludeId: string) => {
    return products.find(
      product =>
        product.id !== excludeId &&
        product.quantity > 0 &&
        !product.isSuggestedSale
    );
  }, []);

  const getLowStockProducts = useCallback((products: Product[], threshold: number) => {
    return products
      .filter(product => product.quantity < threshold && product.quantity > 0)
      .map(product => product.name);
  }, []);

  const getTotalStock = useCallback((products: Product[]) => {
    return products.reduce((total, product) => total + product.quantity, 0);
  }, []);

  return {
    findProductById,
    getRandomProduct,
    findAvailableProductForSuggestion,
    getLowStockProducts,
    getTotalStock,
  };
}