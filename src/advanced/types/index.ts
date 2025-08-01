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

export interface ItemDiscount {
  name: string;
  discount: number;
}

export interface ProductOptionFormat {
  text: string;
  className: string;
}

// 장바구니 상태 타입
export interface CartState {
  cartItems: Record<string, number>
  totalAmount: number
  totalQuantity: number
  bonusPoints: number
  lastSelectedProductId: string | null
}

// Context 타입
export interface CartContextType {
  state: CartState
  setCartItems: (cartItems: Record<string, number>) => void
  setTotalAmount: (amount: number) => void
  setTotalQuantity: (quantity: number) => void
  setBonusPoints: (points: number) => void
  setLastSelectedProductId: (id: string | null) => void
}

// 상품 상태 타입
export interface ProductState {
  products: Product[]
}

// Context 타입
export interface ProductContextType {
  state: ProductState
  setProducts: (products: Product[]) => void
  updateProduct: (productId: string, updates: Partial<Product>) => void
}
