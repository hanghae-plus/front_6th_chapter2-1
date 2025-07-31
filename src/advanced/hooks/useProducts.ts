import { useState, useCallback } from 'react';
import { Product } from '../types';
import { DISCOUNT_RATES, PRICE_CONFIG } from '../constants/config';

export function useProducts(initialProducts: Product[]) {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const applyLightningSale = useCallback((productId: string) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? {
              ...product,
              price: Math.round(
                product.originalPrice! * PRICE_CONFIG.LIGHTNING_SALE_MULTIPLIER
              ),
              onSale: true,
            }
          : product
      )
    );
  }, []);

  const applySuggestionSale = useCallback((productId: string) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? {
              ...product,
              price: Math.round(
                product.price * PRICE_CONFIG.SUGGESTION_SALE_MULTIPLIER
              ),
              suggestSale: true,
            }
          : product
      )
    );
  }, []);

  const getAvailableProductsForLightning = useCallback(() => {
    return products.filter(
      (product) => product.quantity > 0 && !product.onSale
    );
  }, [products]);

  const getAvailableProductsForSuggestion = useCallback(
    (excludeProductId: string) => {
      return products.find(
        (product) =>
          product.id !== excludeProductId &&
          product.quantity > 0 &&
          !product.suggestSale
      );
    },
    [products]
  );

  return {
    products,
    applyLightningSale,
    applySuggestionSale,
    getAvailableProductsForLightning,
    getAvailableProductsForSuggestion,
  };
}
