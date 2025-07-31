import { useProducts } from '../stores/products';
import { isItemLowStock, isSoldOut } from '../utils/quantity';

export function useStockStatus() {
  const products = useProducts((state) => state.products);

  return products
    .reduce<string[]>((acc, product) => {
      if (isSoldOut(product)) {
        acc.push(`${product.name}: 품절`);
      }

      if (isItemLowStock(product)) {
        acc.push(`${product.name}: 재고 부족 (${product.quantity}개 남음)`);
      }

      return acc;
    }, [])
    .join('\n');
}
