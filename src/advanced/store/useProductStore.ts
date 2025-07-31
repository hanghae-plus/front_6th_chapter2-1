import { create } from 'zustand';

import { Product } from '@/advanced/types/product.type';
import { getDiscountedPrice } from '@/advanced/utils/discount.util';

interface ProductState {
  products: Product[];
  selectedProductId: string | null;
}

interface ProductActions {
  setProducts: (products: Product[]) => void;
  setSelectedProduct: (product: Product) => void;
  decreaseStock: (productId: string) => void;
  increaseStock: (productId: string) => void;
  setProductOnSale: (productId: string, discountRate: number) => void;
  setProductSuggestSale: (productId: string, discountRate: number) => void;
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

  setProductOnSale: (productId: string, discountRate: number) =>
    set(state => {
      const product = state.products.find(product => product.id === productId);

      if (!product) return state;

      const newDiscountRate = product.discountRate + discountRate;

      const newPrice = getDiscountedPrice(product.originalPrice, newDiscountRate);

      return {
        ...state,
        products: state.products.map(product =>
          product.id === productId
            ? { ...product, onSale: true, discountRate: newDiscountRate, price: newPrice }
            : product
        ),
      };
    }),

  setProductSuggestSale: (productId: string, discountRate: number) =>
    set(state => {
      const product = state.products.find(product => product.id === productId);

      if (!product) return state;

      const newDiscountRate = product.discountRate + discountRate;

      const newPrice = getDiscountedPrice(product.originalPrice, newDiscountRate);

      return {
        ...state,
        products: state.products.map(product =>
          product.id === productId
            ? { ...product, suggestSale: true, discountRate: newDiscountRate, price: newPrice }
            : product
        ),
      };
    }),
}));

export default useProductStore;
