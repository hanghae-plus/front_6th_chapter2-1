// Product and Cart related types
export interface Product {
  id: string;
  name: string;
  val: number;
  originalVal: number;
  q: number;
  onSale: boolean;
  suggestSale: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  productInventory: Product[];
  cartTotalAmount: number;
  cartItemCount: number;
  lastSelectedProduct: string | null;
}

// Discount related types
export interface DiscountRates {
  [productId: string]: number;
}

export interface ItemDiscountResult {
  itemTotal: number;
  itemDiscount: number;
  quantity: number;
  product: Product;
}

export interface CartTotalCalculation {
  cartTotal: number;
  loyaltyPoints: number;
  discountInfo: string;
}

export interface SaleInfo {
  val?: number;
  onSale?: boolean;
  suggestSale?: boolean;
}

// Cart Actions
export type CartAction =
  | { type: 'INITIALIZE'; payload: Product[] }
  | { type: 'ADD_TO_CART'; payload: string }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; change: number } }
  | { type: 'UPDATE_TOTALS'; payload: { total: number; count: number } }
  | { type: 'SET_LAST_SELECTED'; payload: string }
  | {
      type: 'UPDATE_SALE_STATUS';
      payload: { productId: string; saleInfo: SaleInfo };
    }
  | { type: 'REPLACE_STATE'; payload: CartState };

// Component Props interfaces
export interface HeaderProps {
  itemCount?: number;
}

export interface CartItemProps {
  product: Product;
  quantity?: number;
}

export interface CartItemPriceProps {
  product: Product;
  quantity: number;
  onRemove: () => void;
}

export interface ProductSelectorProps {
  products?: Product[];
  stockStatus?: string;
}

export interface OrderSummaryProps {
  cartTotal?: number;
  loyaltyPoints?: number;
  discountInfo?: string;
  isTuesday?: boolean;
}

export interface CartDisplayProps {
  cartItems?: CartItem[];
}

// Event handler types
export interface CartEventHandlers {
  onAddToCart: (productId: string) => void;
  onRemoveFromCart: (productId: string) => void;
  onQuantityChange: (productId: string, change: number) => void;
}
