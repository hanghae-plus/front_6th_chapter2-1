import { create } from 'zustand';

import { Product } from '@/advanced/types/product.type';

interface ProductState {
  products: Product[];
}

interface ProductActions {
  setProducts: (products: Product[]) => void;
}

export const useProductStore = create<ProductState & ProductActions>(set => ({
  products: [],

  setProducts: (products: Product[]) => {
    set({ products });
  },
}));
