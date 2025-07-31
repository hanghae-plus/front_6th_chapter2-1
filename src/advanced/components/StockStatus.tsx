import { useProducts } from '../stores/products';
import { formatQuantity, isItemLowStock, isSoldOut } from '../utils/quantity';

export function StockStatus() {
  const products = useProducts((state) => state.products);

  return (
    <div className="text-xs text-red-500 mt-3 whitespace-pre-line">
      {products
        .reduce<string[]>((acc, { name, quantity }) => {
          if (isSoldOut(quantity)) {
            acc.push(`${name}: 품절`);
          }

          if (isItemLowStock(quantity)) {
            acc.push(
              `${name}: 재고 부족 (${formatQuantity({ quantity })}개 남음)`
            );
          }

          return acc;
        }, [])
        .join('\n')}
    </div>
  );
}
