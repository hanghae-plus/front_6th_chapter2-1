import type { Product } from '../../../services/saleService';

interface StockStatusProps {
  products: Product[];
}

export default function StockStatus({ products }: StockStatusProps) {
  const lowStockProducts = products.filter((p) => p.quantity <= 5);

  if (lowStockProducts.length === 0) {
    return null;
  }

  return (
    <div
      id="stock-status"
      className="text-xs text-red-500 mt-3 whitespace-pre-line"
    >
      {lowStockProducts
        .map((p) => {
          if (p.quantity === 0) {
            return `${p.name}: 품절`;
          } else {
            return `${p.name}: 재고 부족 (${p.quantity}개 남음)`;
          }
        })
        .join('\n')}
    </div>
  );
}