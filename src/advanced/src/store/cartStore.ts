import { create } from 'zustand';
import type { CartState, CartItem } from '../types';

interface CartStore extends CartState {
  // Actions
  addItem: (item: CartItem) => void;
  updateItemQuantity: (id: string, change: number) => void;
  removeItem: (id: string) => void;
  updateTotal: (total: number) => void;
  updateItemCount: (count: number) => void;
  updateOriginalTotal: (total: number) => void;
  updateDiscountRate: (rate: number) => void;
  reset: () => void;
}

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  originalTotal: 0,
  discountRate: 0,
};

export const useCartStore = create<CartStore>((set, get) => ({
  ...initialState,

  addItem: (item) => {
    set((state) => {
      const existingItem = state.items.find((i) => i.id === item.id);
      
      if (existingItem) {
        // 기존 아이템이 있으면 수량만 증가
        const updatedItems = state.items.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
        return {
          items: updatedItems,
          itemCount: state.itemCount + 1,
        };
      } else {
        // 새로운 아이템 추가
        return {
          items: [...state.items, { ...item, quantity: 1 }],
          itemCount: state.itemCount + 1,
        };
      }
    });
  },

  updateItemQuantity: (id, change) => {
    set((state) => {
      const updatedItems = state.items.map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity + change;
          if (newQuantity <= 0) {
            return null; // 제거할 아이템
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter((item): item is CartItem => item !== null);

      const newItemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        items: updatedItems,
        itemCount: newItemCount,
      };
    });
  },

  removeItem: (id) => {
    set((state) => {
      const itemToRemove = state.items.find((item) => item.id === id);
      const updatedItems = state.items.filter((item) => item.id !== id);
      const removedQuantity = itemToRemove?.quantity || 0;

      return {
        items: updatedItems,
        itemCount: state.itemCount - removedQuantity,
      };
    });
  },

  updateTotal: (total) => {
    set({ total });
  },

  updateItemCount: (count) => {
    set({ itemCount: count });
  },

  updateOriginalTotal: (total) => {
    set({ originalTotal: total });
  },

  updateDiscountRate: (rate) => {
    set({ discountRate: rate });
  },

  reset: () => {
    set(initialState);
  },
})); 