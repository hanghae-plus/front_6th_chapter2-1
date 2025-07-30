import { create } from 'zustand';

import { Product } from '@/advanced/types/product.type';

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
}

interface ProductActions {
  setProducts: (products: Product[]) => void;
  setSelectedProduct: (product: Product) => void;
}

export const useProductStore = create<ProductState & ProductActions>(set => ({
  products: [],
  selectedProduct: null,

  setSelectedProduct: (product: Product) => {
    set({ selectedProduct: product });
  },
  setProducts: (products: Product[]) => {
    set({ products });
  },
}));
