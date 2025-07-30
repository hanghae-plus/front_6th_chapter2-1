import { create } from 'zustand';

import { Product } from '@/advanced/types/product.type';

interface ProductState {
  products: Product[];
  selectedProductId: string | null;
}

interface ProductActions {
  setProducts: (products: Product[]) => void;
  setSelectedProduct: (product: Product) => void;
  decreaseStock: (productId: string) => void;
  increaseStock: (productId: string) => void;
}

const useProductStore = create<ProductState & ProductActions>((set, get) => ({
  products: [],
  selectedProductId: null,

  setSelectedProduct: (product: Product) => {
    set({ selectedProductId: product.id });
  },

  setProducts: (products: Product[]) => {
    set({ products });
  },

  decreaseStock: (productId: string) =>
    set(state => {
      const product = state.products.find(product => product.id === productId);

      if (!product) return state;

      const canDecreaseStock = product.stock > 0;

      if (!canDecreaseStock) return state;

      return {
        ...state,
        products: state.products.map(product =>
          product.id === productId ? { ...product, stock: product.stock - 1 } : product
        ),
      };
    }),

  increaseStock: (productId: string) =>
    set(state => {
      const product = state.products.find(product => product.id === productId);

      if (!product) return state;

      return {
        ...state,
        products: state.products.map(product =>
          product.id === productId ? { ...product, stock: product.stock + 1 } : product
        ),
      };
    }),
}));

export default useProductStore;
