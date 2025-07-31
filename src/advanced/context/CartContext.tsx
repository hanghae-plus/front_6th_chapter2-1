import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { AppState, CartContextType, Cart, Product } from "../types";
import { calculateTotalDiscount, calculateFinalPrice } from "../services/discountService";
import { calculateTotalPoints } from "../services/pointService";

type CartAction =
  | { type: "ADD_TO_CART"; productId: string }
  | { type: "UPDATE_QUANTITY"; productId: string; change: number }
  | { type: "REMOVE_FROM_CART"; productId: string }
  | { type: "CLEAR_CART" }
  | { type: "UPDATE_PRODUCTS"; products: Product[] }
  | { type: "SET_SELECTED_PRODUCT"; productId: string | null };

const initialState: AppState = {
  products: [],
  cartItems: [],
  totalAmount: 0,
  itemCount: 0,
  bonusPoints: 0,
  selectedProductId: null,
};

const cartReducer = (state: AppState, action: CartAction): AppState => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const product = state.products.find(p => p.id === action.productId);
      if (!product || product.quantity <= 0) return state;

      const existingItem = state.cartItems.find(item => item.id === action.productId);

      if (existingItem) {
        // 이미 장바구니에 있는 경우 수량만 증가
        const updatedItems = state.cartItems.map(item => (item.id === action.productId ? { ...item, quantity: item.quantity + 1 } : item));

        const updatedProducts = state.products.map(p => (p.id === action.productId ? { ...p, quantity: p.quantity - 1 } : p));

        return {
          ...state,
          cartItems: updatedItems,
          products: updatedProducts,
        };
      } else {
        // 새로운 아이템 추가
        const newItem: Cart = {
          id: action.productId,
          quantity: 1,
          product: { ...product },
        };

        const updatedProducts = state.products.map(p => (p.id === action.productId ? { ...p, quantity: p.quantity - 1 } : p));

        return {
          ...state,
          cartItems: [...state.cartItems, newItem],
          products: updatedProducts,
        };
      }
    }

    case "UPDATE_QUANTITY": {
      const { productId, change } = action;
      const item = state.cartItems.find(item => item.id === productId);
      if (!item) return state;

      const newQuantity = item.quantity + change;

      if (newQuantity <= 0) {
        // 아이템 제거
        const updatedProducts = state.products.map(p => (p.id === productId ? { ...p, quantity: p.quantity + item.quantity } : p));

        return {
          ...state,
          cartItems: state.cartItems.filter(item => item.id !== productId),
          products: updatedProducts,
        };
      }

      // 재고 확인
      const product = state.products.find(p => p.id === productId);
      if (!product || product.quantity < change) return state;

      const updatedItems = state.cartItems.map(item => (item.id === productId ? { ...item, quantity: newQuantity } : item));

      const updatedProducts = state.products.map(p => (p.id === productId ? { ...p, quantity: p.quantity - change } : p));

      return {
        ...state,
        cartItems: updatedItems,
        products: updatedProducts,
      };
    }

    case "REMOVE_FROM_CART": {
      const item = state.cartItems.find(item => item.id === action.productId);
      if (!item) return state;

      const updatedProducts = state.products.map(p => (p.id === action.productId ? { ...p, quantity: p.quantity + item.quantity } : p));

      return {
        ...state,
        cartItems: state.cartItems.filter(item => item.id !== action.productId),
        products: updatedProducts,
      };
    }

    case "CLEAR_CART": {
      // 모든 아이템을 재고로 반환
      const updatedProducts = state.products.map(product => {
        const cartItem = state.cartItems.find(item => item.id === product.id);
        return cartItem ? { ...product, quantity: product.quantity + cartItem.quantity } : product;
      });

      return {
        ...state,
        cartItems: [],
        products: updatedProducts,
      };
    }

    case "UPDATE_PRODUCTS": {
      return {
        ...state,
        products: action.products,
      };
    }

    case "SET_SELECTED_PRODUCT": {
      return {
        ...state,
        selectedProductId: action.productId,
      };
    }

    default:
      return state;
  }
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (productId: string) => {
    dispatch({ type: "ADD_TO_CART", productId });
  };

  const updateQuantity = (productId: string, change: number) => {
    dispatch({ type: "UPDATE_QUANTITY", productId, change });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: "REMOVE_FROM_CART", productId });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const updateProducts = (products: Product[]) => {
    dispatch({ type: "UPDATE_PRODUCTS", products });
  };

  const setSelectedProduct = (productId: string | null) => {
    dispatch({ type: "SET_SELECTED_PRODUCT", productId });
  };

  // 계산된 값들
  const subtotal = state.cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const discounts = calculateTotalDiscount(state.cartItems, subtotal);
  const totalAmount = calculateFinalPrice(subtotal, discounts);
  const itemCount = state.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const pointInfo = calculateTotalPoints(totalAmount, state.cartItems);

  const contextValue: CartContextType & {
    updateProducts: (products: Product[]) => void;
    setSelectedProduct: (productId: string | null) => void;
  } = {
    state: {
      ...state,
      totalAmount,
      itemCount,
      bonusPoints: pointInfo.totalPoints,
    },
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    updateProducts,
    setSelectedProduct,
  };

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};
