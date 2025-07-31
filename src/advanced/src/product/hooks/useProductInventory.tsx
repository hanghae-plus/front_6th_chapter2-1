import { useState } from 'react';
import { Product, SaleInfo } from 'types';
import { findProductById, updateProductStock } from 'product/utils';

export function useProductInventory(initialProducts: Product[]) {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const updateStock = (productId: string, change: number) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId ? updateProductStock(product, change) : product
      )
    );
  };

  const updateSaleStatus = (productId: string, saleInfo: SaleInfo) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId ? { ...product, ...saleInfo } : product
      )
    );
  };

  const getProduct = (productId: string): Product | null => {
    return findProductById(products, productId);
  };

  return {
    products,
    updateStock,
    updateSaleStatus,
    getProduct,
  };
}
