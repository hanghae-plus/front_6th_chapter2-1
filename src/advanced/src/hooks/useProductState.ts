import { useState } from 'react';
import { productList as initialProductList } from '../data/products';
import { Product } from '../types/product';

export const useProductState = () => {
  const [productList, setProductList] = useState<Product[]>(initialProductList);

  return {
    productList,
    setProductList,
  };
};
