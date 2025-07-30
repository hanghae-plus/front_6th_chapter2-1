export interface CartItem {
  id: string;
  name: string;
  originalPrice: number;
  price: number;
  quantity: number;
  saleIcon?: string;
}

export interface Cart {
  items: CartItem[];
  totalAmount: number; // 최종 결제 금액
  originalAmount: number; // 원래 금액
  discountAmount: number; // 할인 금액
  itemCount: number;
  appliedDiscounts: string[];
}

export interface CartAction {
  type: 'ADD_ITEM' | 'ADJUST_QUANTITY' | 'REMOVE_ITEM';
  payload: {
    productId: string;
    quantity: number;
  };
}

export interface CartContextType {
  state: Cart;
  dispatch: (action: CartAction) => void;
}
