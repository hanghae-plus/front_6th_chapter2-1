import { useState, useCallback } from 'react';
import { Product } from '../types';
import { PRODUCTS, getProductById } from '../data/products';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  // 재고 업데이트
  const updateStock = useCallback((productId: string, quantity: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, stock: Math.max(0, product.stock - quantity) }
          : product,
      ),
    );
  }, []);

  // 재고 복구 (상품 제거 시)
  const restoreStock = useCallback((productId: string, quantity: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId ? { ...product, stock: product.stock + quantity } : product,
      ),
    );
  }, []);

  // 상품 가져오기
  const getProduct = useCallback((id: string) => {
    return getProductById(id);
  }, []);

  // 재고 부족 상품
  const lowStockProducts = products.filter((product) => product.stock > 0 && product.stock < 5);

  // 품절 상품
  const outOfStockProducts = products.filter((product) => product.stock === 0);

  return {
    products,
    lowStockProducts,
    outOfStockProducts,
    updateStock,
    restoreStock,
    getProduct,
  };
};
