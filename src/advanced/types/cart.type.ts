import { Product } from '@/advanced/types/product.type';

export interface CartItem extends Product {
  quantity: number;
}
