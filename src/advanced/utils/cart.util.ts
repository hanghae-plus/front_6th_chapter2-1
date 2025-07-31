import { CartItem } from '@/advanced/types/cart.type';
import { Product, ProductStatus } from '@/advanced/types/product.type';
import { getProductStatus } from '@/advanced/utils/product.util';

export function getCartTotalCount(cartItems: CartItem[]): number {
  return cartItems.reduce((acc, item) => acc + item.quantity, 0);
}

export function getProductStatusIcon(product: Product) {
  const icons = {
    [ProductStatus.SUPER_SALE]: '⚡💝',
    [ProductStatus.LIGHTNING_SALE]: '⚡',
    [ProductStatus.SUGGESTION_SALE]: '💝',
    [ProductStatus.OUT_OF_STOCK]: '',
    [ProductStatus.NORMAL]: '',
  };

  const status = getProductStatus(product);

  return icons[status];
}
