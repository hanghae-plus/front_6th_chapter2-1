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
  totalAmount: number;
  itemCount: number;
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
