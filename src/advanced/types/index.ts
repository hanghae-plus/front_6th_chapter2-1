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

export interface Elements {
  productSelect: HTMLSelectElement;
  addButton: HTMLButtonElement;
  cartItems: HTMLElement;
  cartTotal: HTMLElement;
  stockInfo: HTMLElement;
  itemCount: HTMLElement;
  loyaltyPoints: HTMLElement;
  discountInfo: HTMLElement;
  tuesdaySpecial: HTMLElement;
  summaryDetails: HTMLElement;
}

export interface ItemDiscount {
  name: string;
  discount: number;
}

export interface ProductOptionFormat {
  text: string;
  className: string;
}