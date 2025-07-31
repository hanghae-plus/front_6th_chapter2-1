export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number;
  onSale: boolean;
  suggestSale: boolean;
}

export interface CartItem {
  id: string;
  selectedQuantity: number;
}
