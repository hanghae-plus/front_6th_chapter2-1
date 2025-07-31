import type { Product } from "../constants";

export interface CartItem {
  id: string;
  name: string;
  val: number;
  quantity: number;
  discount: number;
}

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
