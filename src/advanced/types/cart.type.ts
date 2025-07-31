import { Product } from '@/advanced/types/product.type';

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  totalPrice: number;
}
