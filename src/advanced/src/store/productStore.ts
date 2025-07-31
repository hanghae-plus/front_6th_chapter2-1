import { create } from 'zustand';
import type { ProductState, Product } from '../types';
import { productList } from '../data/products';

interface ProductStore extends ProductState {
  // Actions
  setSelectedProduct: (productId: string | null) => void;
  updateProducts: (products: Product[]) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  reset: () => void;
}

const initialState: ProductState = {
  selectedProduct: null,
  products: productList,
};

export const useProductStore = create<ProductStore>((set, get) => ({
  ...initialState,

  setSelectedProduct: (productId) => {
    set({ selectedProduct: productId });
  },

  updateProducts: (products) => {
    set({ products });
  },

  updateProduct: (productId, updates) => {
    set((state) => ({
      products: state.products.map((product) =>
        product.id === productId ? { ...product, ...updates } : product
      ),
    }));
  },

  reset: () => {
    set(initialState);
  },
}));
