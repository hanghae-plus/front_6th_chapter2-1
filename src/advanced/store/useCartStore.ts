import { create } from 'zustand';

import { CartItem } from '@/advanced/types/cart.type';
import { Product } from '@/advanced/types/product.type';

interface CartState {
  cartItems: CartItem[];
}

interface CartActions {
  addCartItem: (product: Product) => void;

  hasProductInCart: (product: Product) => boolean;
}

export const useCartStore = create<CartState & CartActions>((set, get) => ({
  cartItems: [],

  hasProductInCart: (product: Product) => {
    return get().cartItems.some(p => p.id === product.id);
  },

  addCartItem: (product: Product) => {
    set(state => {
      const productInCart = state.hasProductInCart(product);

      if (productInCart) {
        const newProducts = state.cartItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );

        return { cartItems: newProducts };
      }

      return { cartItems: [...state.cartItems, { ...product, quantity: 1 }] };
    });
  },

  increaseProductQuantity: (product: Product) => {
    set(state => {
      const productInCart = state.hasProductInCart(product);

      if (productInCart) {
        const newProducts = state.cartItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );

        return { cartItems: newProducts };
      }

      return { cartItems: [...state.cartItems, { ...product, quantity: 1 }] };
    });
  },

  decreaseProductQuantity: (product: Product) => {
    set(state => {
      const productInCart = state.hasProductInCart(product);

      if (!productInCart) return state;

      const newProducts = state.cartItems
        .map(item =>
          item.id === product.id ? { ...item, quantity: Math.max(item.quantity - 1, 0) } : item
        )
        .filter(item => item.quantity > 0);

      return { cartItems: newProducts };
    });
  },
}));
