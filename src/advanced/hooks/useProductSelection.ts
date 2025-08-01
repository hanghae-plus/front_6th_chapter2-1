import { useState, useCallback } from 'react';

interface UseProductSelectionReturn {
  selectedProductId: string;
  selectProduct: (productId: string) => void;
}

export const useProductSelection = (
  initialProductId: string = 'product1'
): UseProductSelectionReturn => {
  const [selectedProductId, setSelectedProductId] =
    useState<string>(initialProductId);

  const selectProduct = useCallback((productId: string) => {
    setSelectedProductId(productId);
  }, []);

  return {
    selectedProductId,
    selectProduct,
  };
};
