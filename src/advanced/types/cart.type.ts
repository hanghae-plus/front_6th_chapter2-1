export interface CartItem {
  id: string;
  quantity: number;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  totalPrice: number;
}
