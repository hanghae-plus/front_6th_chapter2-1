import { Product } from 'types';

/**
 * 상품 상태를 판단하는 유틸리티 함수들
 */
export const getProductStatus = (product: Product) => {
  const isOutOfStock = product.q <= 0;
  const hasDiscount = product.onSale || product.suggestSale;

  return { isOutOfStock, hasDiscount };
};

export const isProductAvailable = (product: Product): boolean => {
  return product.q > 0;
};

export const getFirstAvailableProduct = (
  products: Product[]
): Product | null => {
  return products.find(isProductAvailable) || null;
};
