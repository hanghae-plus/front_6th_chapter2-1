import { Product } from '@/advanced/types/product.type';

export function getTotalStock(products: Product[]): number {
  return products.reduce((acc, product) => acc + product.stock, 0);
}
