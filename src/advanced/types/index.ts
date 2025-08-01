export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number;
  onSale: boolean;
  suggestSale: boolean;
}

export interface Cart {
  id: string;
  quantity: number;
  product: Product;
}

export interface Discount {
  type: "individual" | "bulk" | "tuesday" | "lightning" | "suggest";
  percentage: number;
  description: string;
}

export interface PointInfo {
  basePoints: number;
  bonusPoints: number;
  totalPoints: number;
  details: string[];
}

export interface AppState {
  products: Product[];
  cartItems: Cart[];
  totalAmount: number;
  itemCount: number;
  bonusPoints: number;
  selectedProductId: string | null;
}

export interface CartContextType {
  state: AppState;
  addToCart: (productId: string) => void;
  updateQuantity: (productId: string, change: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  updateProducts: (products: Product[]) => void;
  setSelectedProduct: (productId: string | null) => void;
}

export interface ProductContextType {
  products: Product[];
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  getProduct: (productId: string) => Product | undefined;
}

export type ProductId = "p1" | "p2" | "p3" | "p4" | "p5";
