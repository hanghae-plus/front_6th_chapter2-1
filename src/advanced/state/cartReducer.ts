// src/advanced/state/cartReducer.ts
import { Product, CartItem } from '../types';
import { initialProducts } from './initialData';

export interface State {
  products: Product[];
  cart: CartItem[];
  lastSelectedId: string | null;
}

export type Action =
  | { type: 'ADD_TO_CART'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; change: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { productId:string } }
  | { type: 'APPLY_SALE'; payload: { productId: string; newPrice: number; saleType: 'onSale' | 'suggestSale' } }
  | { type: 'RESET_STATE' };

export const initialState: State = {
  products: initialProducts,
  cart: [],
  lastSelectedId: null,
};

export function cartReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { productId } = action.payload;
      const product = state.products.find((p) => p.id === productId);

      if (!product || product.q <= 0) {
        alert('재고가 부족합니다.');
        return state;
      }

      const existingItem = state.cart.find((item) => item.id === productId);
      const newCart = existingItem
        ? state.cart.map((item) =>
            item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
          )
        : [...state.cart, { id: productId, quantity: 1 }];

      const newProducts = state.products.map((p) =>
        p.id === productId ? { ...p, q: p.q - 1 } : p
      );

      return {
        ...state,
        cart: newCart,
        products: newProducts,
        lastSelectedId: productId,
      };
    }

    case 'UPDATE_QUANTITY': {
      const { productId, change } = action.payload;
      const product = state.products.find((p) => p.id === productId);
      const cartItem = state.cart.find((item) => item.id === productId);

      if (!product || !cartItem) return state;

      if (change > 0 && product.q < change) {
        alert('재고가 부족합니다.');
        return state;
      }
      
      const newQuantity = cartItem.quantity + change;

      const newCart =
        newQuantity > 0
          ? state.cart.map((item) =>
              item.id === productId ? { ...item, quantity: newQuantity } : item
            )
          : state.cart.filter((item) => item.id !== productId);
      
      const newProducts = state.products.map((p) =>
        p.id === productId ? { ...p, q: p.q - change } : p
      );

      return {
        ...state,
        cart: newCart,
        products: newProducts,
      };
    }

    case 'REMOVE_FROM_CART': {
      const { productId } = action.payload;
      const cartItem = state.cart.find((item) => item.id === productId);
      if (!cartItem) return state;

      const newCart = state.cart.filter((item) => item.id !== productId);
      const newProducts = state.products.map((p) =>
        p.id === productId ? { ...p, q: p.q + cartItem.quantity } : p
      );

      return {
        ...state,
        cart: newCart,
        products: newProducts,
      };
    }
    
    case 'APPLY_SALE': {
      const { productId, newPrice, saleType } = action.payload;
      const newProducts = state.products.map(p => 
        p.id === productId ? {...p, val: newPrice, [saleType]: true} : p
      );
      return {
        ...state,
        products: newProducts,
      }
    }

    case 'RESET_STATE':
      return initialState;

    default:
      return state;
  }
}
