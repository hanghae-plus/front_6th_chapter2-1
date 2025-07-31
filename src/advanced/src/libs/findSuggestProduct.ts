import type { Product } from '../type';

export const findSuggestedProduct = (productList: Product[], lastSelectedProductId: string) => {
  return (
    productList.find(
      (product) => product.id !== lastSelectedProductId && product.quantity > 0 && !product.suggestSale
    ) || null
  );
};
