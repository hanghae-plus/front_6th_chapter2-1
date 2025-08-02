import { createContext, useContext, useReducer, ReactNode } from "react";
import { INITIAL_PRODUCTS } from "../constants";
import type { Product, CartItem } from "../types";

// State Type
export interface AppState {
  products: Product[];
  cartItems: CartItem[];
  selectedProductId: string;
  lastSelectedProductId: string | null;
  itemCount: number;
  totalAmount: number;
  bonusPoints: number;
}

// Action Types
type AppAction =
  | { type: "SET_PRODUCTS"; payload: Product[] }
  | { type: "SET_CART_ITEMS"; payload: CartItem[] }
  | { type: "SET_SELECTED_PRODUCT_ID"; payload: string }
  | { type: "SET_LAST_SELECTED_PRODUCT_ID"; payload: string | null }
  | { type: "SET_ITEM_COUNT"; payload: number }
  | { type: "SET_TOTAL_AMOUNT"; payload: number }
  | { type: "SET_BONUS_POINTS"; payload: number }
  | { type: "ADD_TO_CART"; payload: { productId: string } }
  | {
      type: "UPDATE_CART_ITEM_QUANTITY";
      payload: { productId: string; change: number };
    }
  | { type: "REMOVE_CART_ITEM"; payload: { productId: string } }
  | { type: "APPLY_LIGHTNING_SALE"; payload: { productId: string } }
  | { type: "APPLY_SUGGESTED_SALE"; payload: { productId: string } };

// Initial State
const initialState: AppState = {
  products: [...INITIAL_PRODUCTS],
  cartItems: [],
  selectedProductId: INITIAL_PRODUCTS[0].id,
  lastSelectedProductId: null,
  itemCount: 0,
  totalAmount: 0,
  bonusPoints: 0,
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_PRODUCTS":
      return { ...state, products: action.payload };

    case "SET_CART_ITEMS":
      return { ...state, cartItems: action.payload };

    case "SET_SELECTED_PRODUCT_ID":
      return { ...state, selectedProductId: action.payload };

    case "SET_LAST_SELECTED_PRODUCT_ID":
      return { ...state, lastSelectedProductId: action.payload };

    case "SET_ITEM_COUNT":
      return { ...state, itemCount: action.payload };

    case "SET_TOTAL_AMOUNT":
      return { ...state, totalAmount: action.payload };

    case "SET_BONUS_POINTS":
      return { ...state, bonusPoints: action.payload };

    case "ADD_TO_CART": {
      const product = state.products.find(
        (p) => p.id === action.payload.productId
      );
      if (!product || product.quantity <= 0) return state;

      const existingItemIndex = state.cartItems.findIndex(
        (item) => item.product.id === action.payload.productId
      );

      let newCartItems: CartItem[];
      if (existingItemIndex >= 0) {
        newCartItems = state.cartItems.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        const newCartItem: CartItem = {
          id: `cart-${action.payload.productId}-${Date.now()}`,
          product: { ...product },
          quantity: 1,
        };
        newCartItems = [...state.cartItems, newCartItem];
      }

      const newProducts = state.products.map((p) =>
        p.id === action.payload.productId
          ? { ...p, quantity: p.quantity - 1 }
          : p
      );

      return {
        ...state,
        cartItems: newCartItems,
        products: newProducts,
        lastSelectedProductId: action.payload.productId,
      };
    }

    case "UPDATE_CART_ITEM_QUANTITY": {
      const { productId, change } = action.payload;
      let newCartItems = state.cartItems
        .map((item) => {
          if (item.product.id === productId) {
            const newQuantity = item.quantity + change;
            if (newQuantity <= 0) return null;
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];

      const newProducts = state.products.map((p) =>
        p.id === productId ? { ...p, quantity: p.quantity - change } : p
      );

      return {
        ...state,
        cartItems: newCartItems,
        products: newProducts,
      };
    }

    case "REMOVE_CART_ITEM": {
      const itemToRemove = state.cartItems.find(
        (item) => item.product.id === action.payload.productId
      );
      if (!itemToRemove) return state;

      const newCartItems = state.cartItems.filter(
        (item) => item.product.id !== action.payload.productId
      );

      const newProducts = state.products.map((p) =>
        p.id === action.payload.productId
          ? { ...p, quantity: p.quantity + itemToRemove.quantity }
          : p
      );

      return {
        ...state,
        cartItems: newCartItems,
        products: newProducts,
      };
    }

    case "APPLY_LIGHTNING_SALE": {
      const newProducts = state.products.map((product) => {
        if (product.id === action.payload.productId) {
          return {
            ...product,
            isOnLightningSale: true,
            price: Math.round((product.originalPrice * 80) / 100),
          };
        }
        return product;
      });

      return { ...state, products: newProducts };
    }

    case "APPLY_SUGGESTED_SALE": {
      const newProducts = state.products.map((product) => {
        if (product.id === action.payload.productId) {
          return {
            ...product,
            isSuggestedSale: true,
            price: Math.round((product.price * 95) / 100),
          };
        }
        return product;
      });

      return { ...state, products: newProducts };
    }

    default:
      return state;
  }
}

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | null>(null);

// Provider
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom Hook
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
}
