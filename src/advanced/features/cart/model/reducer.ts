import type { CartItem } from '../../../shared/types';
import type { CartAction } from './actions';

export interface CartState {
  items: CartItem[];
}

export const initialCartState: CartState = {
  items: [],
};

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'cart/ADD_TO_CART': {
      const productId = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === productId
      );

      if (existingItemIndex >= 0) {
        // 기존 아이템 수량 증가
        const newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return { ...state, items: newItems };
      } else {
        // 새 아이템 추가
        const newItems = [...state.items, { id: productId, quantity: 1 }];
        return { ...state, items: newItems };
      }
    }

    case 'cart/UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;

      if (quantity <= 0) {
        // 수량이 0 이하면 제거
        const newItems = state.items.filter((item) => item.id !== id);
        return { ...state, items: newItems };
      }

      const newItems = state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );
      return { ...state, items: newItems };
    }

    case 'cart/REMOVE_FROM_CART': {
      const productId = action.payload;
      const newItems = state.items.filter((item) => item.id !== productId);
      return { ...state, items: newItems };
    }

    case 'cart/CLEAR_CART': {
      return { ...state, items: [] };
    }

    default:
      return state;
  }
}
