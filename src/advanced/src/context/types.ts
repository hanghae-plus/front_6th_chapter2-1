import type { Product, CartItem } from "../types";

// Re-export types for backward compatibility
export type { Product, CartItem };

export interface AppContextType {
  // State
  products: Product[];
  cart: CartItem[];
  isManualOpen: boolean;
  selectedProduct: string;
  stockStatus: string;

  // Actions
  addToCart: (productId: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  toggleManual: () => void;
  setSelectedProduct: (productId: string) => void;
  setStockStatus: (status: string) => void;
}
