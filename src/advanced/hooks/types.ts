import type { CalculationResult, CartItem, Product } from "../types";

/**
 * useCart Hook의 반환 타입
 */
export interface UseCartReturn {
  cartItems: CartItem[];
  addToCart: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  resetCart: () => void;
}

/**
 * useProduct Hook의 반환 타입
 */
export interface UseProductReturn {
  products: Product[];
  selectedProduct: Product | null;
  selectProduct: (productId: string) => void;
}

/**
 * useOrder Hook의 반환 타입
 */
export interface UseOrderReturn {
  calculation: CalculationResult;
  totalAmount: number;
  discountRate: number;
  loyaltyPoints: number;
  isTuesday: boolean;
  itemCount: number;
  subtotal: number;
}

/**
 * useModal Hook의 반환 타입
 */
export interface UseModalReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/**
 * useNotification Hook의 반환 타입
 */
export interface UseNotificationReturn {
  showNotification: (message: string) => void;
}

/**
 * useItemCount Hook의 반환 타입
 */
export interface UseItemCountReturn {
  itemCount: number;
}

/**
 * useHelpModal Hook의 반환 타입
 */
export interface UseHelpModalReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}
