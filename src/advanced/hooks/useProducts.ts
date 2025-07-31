import { useState } from 'react';

import { Product, PRODUCT_LIST } from '../lib/products';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(PRODUCT_LIST);

  const updateProductStock = (productId: string, newStock: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => (product.productId === productId ? { ...product, stock: newStock } : product))
    );
  };

  const updateProductSaleStatus = (productId: string, isOnSale: boolean, newPrice?: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.productId === productId
          ? {
              ...product,
              isOnSale,
              price: newPrice ?? product.originalPrice,
            }
          : product
      )
    );
  };

  const updateProductRecommendStatus = (productId: string, isRecommended: boolean, newPrice?: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.productId === productId
          ? {
              ...product,
              isRecommended,
              price: newPrice ?? product.originalPrice,
            }
          : product
      )
    );
  };

  // useProducts.ts에 추가해야 할 기능
  const decreaseStock = (productId: string, amount: number = 1) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.productId === productId ? { ...product, stock: product.stock - amount } : product
      )
    );
  };

  const increaseStock = (productId: string, amount: number = 1) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.productId === productId ? { ...product, stock: product.stock + amount } : product
      )
    );
  };

  return {
    products,
    updateProductStock,
    updateProductSaleStatus,
    updateProductRecommendStatus,
    decreaseStock,
    increaseStock,
  };
}
