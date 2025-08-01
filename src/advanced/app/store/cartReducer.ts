/**
 * 장바구니 상태 관리를 위한 Reducer
 */

import { CartItem, Product } from '../../shared/types';

export interface CartState {
  products: Product[];
  cartItems: CartItem[];
}

export const initialCartState: CartState = {
  products: [],
  cartItems: [],
};

export type CartAction =
  | { type: 'INITIALIZE_PRODUCTS'; payload: Product[] }
  | { type: 'UPDATE_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_TO_CART'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; change: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'CLEAR_CART' };

export const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'INITIALIZE_PRODUCTS':
      return {
        ...state,
        products: action.payload,
      };

    case 'UPDATE_PRODUCTS':
      return {
        ...state,
        products: action.payload,
      };

    case 'ADD_TO_CART': {
      const { productId } = action.payload;
      const product = state.products.find(p => p.id === productId);
      
      if (!product || product.q <= 0) {
        return state;
      }

      const existingItem = state.cartItems.find(item => item.id === productId);
      
      if (existingItem) {
        // 기존 아이템이 있으면 수량 증가
        const availableStock = product.q;
        if (existingItem.quantity >= availableStock) {
          return state; // 재고 부족
        }

        return {
          ...state,
          cartItems: state.cartItems.map(item =>
            item.id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          products: state.products.map(p =>
            p.id === productId
              ? { ...p, q: p.q - 1 }
              : p
          ),
        };
      } else {
        // 새 아이템 추가
        const newItem: CartItem = {
          id: productId,
          product: { ...product },
          quantity: 1,
        };

        return {
          ...state,
          cartItems: [...state.cartItems, newItem],
          products: state.products.map(p =>
            p.id === productId
              ? { ...p, q: p.q - 1 }
              : p
          ),
        };
      }
    }

    case 'UPDATE_QUANTITY': {
      const { productId, change } = action.payload;
      const cartItem = state.cartItems.find(item => item.id === productId);
      const product = state.products.find(p => p.id === productId);
      
      if (!cartItem || !product) {
        return state;
      }

      const newQuantity = cartItem.quantity + change;
      
      if (newQuantity <= 0) {
        // 수량이 0 이하면 제거
        return {
          ...state,
          cartItems: state.cartItems.filter(item => item.id !== productId),
          products: state.products.map(p =>
            p.id === productId
              ? { ...p, q: p.q + cartItem.quantity }
              : p
          ),
        };
      }

      // 재고 확인
      if (change > 0) {
        // 수량 증가 시 재고 확인
        if (product.q < change) {
          return state; // 재고 부족
        }
      }

      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        ),
        products: state.products.map(p =>
          p.id === productId
            ? { ...p, q: p.q - change }
            : p
        ),
      };
    }

    case 'REMOVE_ITEM': {
      const { productId } = action.payload;
      const cartItem = state.cartItems.find(item => item.id === productId);
      
      if (!cartItem) {
        return state;
      }

      return {
        ...state,
        cartItems: state.cartItems.filter(item => item.id !== productId),
        products: state.products.map(p =>
          p.id === productId
            ? { ...p, q: p.q + cartItem.quantity }
            : p
        ),
      };
    }

    case 'CLEAR_CART':
      return {
        ...state,
        cartItems: [],
        products: state.products.map(p => {
          // 장바구니에서 해당 상품의 수량만큼 재고 복원
          const cartItem = state.cartItems.find(item => item.id === p.id);
          const quantityToRestore = cartItem ? cartItem.quantity : 0;
          return {
            ...p,
            q: p.q + quantityToRestore
          };
        }),
      };

    default:
      return state;
  }
};