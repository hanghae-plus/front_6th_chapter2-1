export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  onSale?: boolean;
  suggestSale?: boolean;
}

export interface CartItem extends Product {
  cartQuantity?: number;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  className?: string;
}
