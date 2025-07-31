import { getProducts, isLowStock, isSoldOut } from '../model/products';
import { selectById, STOCK_STATUS_ID } from '../utils/selector';

export function renderStockStatus() {
  const products = getProducts();
  const stockStatus = products
    .reduce<string[]>((acc, product) => {
      if (isSoldOut(product)) {
        acc.push(`${product.name}: 품절`);
      }

      if (isLowStock(product)) {
        acc.push(`${product.name}: 재고 부족 (${product.quantity}개 남음)`);
      }

      return acc;
    }, [])
    .join('\n');

  selectById(STOCK_STATUS_ID).textContent = stockStatus;
}
