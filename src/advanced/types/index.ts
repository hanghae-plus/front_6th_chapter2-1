export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number;
  isOnLightningSale: boolean;
  isSuggestedSale: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}
