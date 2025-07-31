import React, { createContext, ReactNode, useContext, useState } from 'react';

import { initialProductList, type Product } from '@/data/product';

type ProductContextType = {
  products: Product[];
  getProductById: (id: string) => Product | undefined;
  updateProduct: (
    id: string,
    changes: Partial<Pick<Product, 'discountPrice' | 'onSale' | 'suggestSale' | 'quantity'>>
  ) => void;
  resetProducts: () => void;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(initialProductList);

  const getProductById = (id: string) => {
    return products.find((p) => p.id === id);
  };

  const updateProduct = (
    id: string,
    changes: Partial<Pick<Product, 'discountPrice' | 'onSale' | 'suggestSale' | 'quantity'>>
  ) => {
    setProducts((prev) => prev.map((product) => (product.id === id ? { ...product, ...changes } : product)));
  };

  const resetProducts = () => {
    setProducts(initialProductList);
  };

  return (
    <ProductContext.Provider value={{ products, getProductById, updateProduct, resetProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};
