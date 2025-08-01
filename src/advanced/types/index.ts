// types/index.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  stock: number;
  onSale: boolean;
  recommendSale: boolean;
}

export interface CartItems {
  [productId: string]: number;
}

export interface AppState {
  products: Product[];
  cartItems: CartItems;
  lastSelectedProductId: string | null;
  totalAmount: number;
  totalQuantity: number;
  bonusPoints: number;
}

export interface ItemDiscount {
  name: string;
  discount: number;
}

export interface ProductOptionFormat {
  text: string;
  className: string;
}

export interface CartState {
  products: Product[]
  cartItems: Record<string, number>
  totalAmount: number
  totalQuantity: number
  bonusPoints: number
  lastSelectedProductId: string | null
}

export interface ShoppingCartContextType {
  state: CartState
  setProducts: (products: Product[]) => void
  setCartItems: (cartItems: Record<string, number>) => void
  setTotalAmount: (amount: number) => void
  setTotalQuantity: (quantity: number) => void
  setBonusPoints: (points: number) => void
  setLastSelectedProductId: (id: string | null) => void
}
