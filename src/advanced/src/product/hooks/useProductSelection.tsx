import { useState } from 'react';
import { Product } from 'types';
import { getFirstAvailableProduct } from '../utils';

interface UseProductSelectionProps {
  products: Product[];
}

interface UseProductSelectionReturn {
  selectedProductId: string;
  setSelectedProductId: (productId: string) => void;
  selectedProduct: Product | null;
  hasValidSelection: boolean;
}

export function useProductSelection({
  products,
}: UseProductSelectionProps): UseProductSelectionReturn {
  const firstAvailableProduct = getFirstAvailableProduct(products);
  const defaultProductId = firstAvailableProduct?.id || '';

  const [selectedProductId, setSelectedProductId] = useState(defaultProductId);

  // 선택된 상품 정보
  const selectedProduct =
    products.find((product) => product.id === selectedProductId) || null;

  // 유효한 선택인지 확인
  const hasValidSelection = Boolean(selectedProductId && selectedProduct);

  return {
    selectedProductId,
    setSelectedProductId,
    selectedProduct,
    hasValidSelection,
  };
}
