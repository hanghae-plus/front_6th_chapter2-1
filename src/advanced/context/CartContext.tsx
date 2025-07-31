import React from "react";
import type { CartItem, Product } from "../types";
import { createSafeContext } from "../utils/createSafeContext";

// 장바구니 상태 타입
export interface CartState {
  cartItems: CartItem[];
  lastSelectedProduct: string | null;
}

// 장바구니 액션 타입
export type CartAction =
  | { type: "ADD_TO_CART"; payload: { productId: string; quantity: number; product: Product } }
  | { type: "REMOVE_FROM_CART"; payload: { productId: string } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; quantity: number; product: Product } }
  | { type: "RESET_CART" }
  | { type: "SET_LAST_SELECTED_PRODUCT"; payload: { productId: string } };

// 초기 장바구니 상태
export const initialCartState: CartState = {
  cartItems: [],
  lastSelectedProduct: null,
};

// 장바구니 리듀서
export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_TO_CART": {
      const { productId, quantity, product } = action.payload;

      if (product.q < quantity) {
        return state; // 재고 부족 시 상태 변경 없음
      }

      const existingItem = state.cartItems.find((item) => item.id === productId);
      let newCartItems;

      if (existingItem) {
        // 기존 아이템 수량 증가
        newCartItems = state.cartItems.map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.q) }
            : item,
        );
      } else {
        // 새 아이템 추가
        const newItem: CartItem = {
          id: product.id,
          name: product.name,
          price: product.val,
          originalPrice: product.originalVal,
          quantity: Math.min(quantity, product.q),
          onSale: product.onSale,
          suggestSale: product.suggestSale,
        };
        newCartItems = [...state.cartItems, newItem];
      }

      return {
        ...state,
        cartItems: newCartItems,
        lastSelectedProduct: productId,
      };
    }

    case "REMOVE_FROM_CART": {
      const { productId } = action.payload;
      return {
        ...state,
        cartItems: state.cartItems.filter((item) => item.id !== productId),
      };
    }

    case "UPDATE_QUANTITY": {
      const { productId, quantity, product } = action.payload;

      if (quantity <= 0) {
        // 수량이 0 이하면 제거
        return {
          ...state,
          cartItems: state.cartItems.filter((item) => item.id !== productId),
        };
      }

      // 재고 확인
      const maxQuantity = Math.min(quantity, product.q);

      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.id === productId ? { ...item, quantity: maxQuantity } : item,
        ),
      };
    }

    case "RESET_CART": {
      return {
        ...state,
        cartItems: [],
        lastSelectedProduct: null,
      };
    }

    case "SET_LAST_SELECTED_PRODUCT": {
      const { productId } = action.payload;
      return {
        ...state,
        lastSelectedProduct: productId,
      };
    }

    default:
      return state;
  }
}

// Context 생성
export interface CartContextType {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
}

export const [CartContextProvider, useCartContext] = createSafeContext<CartContextType>("Cart");
