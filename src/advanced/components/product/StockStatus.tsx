import { ReactElement } from 'react';

import { LOW_STOCK_THRESHOLD } from '@/advanced/data/quantity.data';
import { useProductStore } from '@/advanced/store';

export default function StockStatus(): ReactElement {
  const { products } = useProductStore();

  const lowStockProducts = products.filter(product => {
    if (product.stock < LOW_STOCK_THRESHOLD) return product;
  });

  /**
   * 버그 없애는 키보드: 재고 부족 (1개 남음)
   * 에러 방지 노트북 파우치: 품절
   * 코딩할 때 듣는 Lo-Fi 스피커: 품절
   */
  const stockStatusList = lowStockProducts.map(product => {
    const stockStatus = product.stock === 0 ? '품절' : `재고 부족 (${product.stock}개 남음)`;

    return `${product.name}: ${stockStatus}`;
  });

  return (
    <div id="stock-status" className="text-xs text-red-500 mt-3 whitespace-pre-line flex flex-col">
      {stockStatusList.map((stockStatus, index) => (
        <span key={index}>{stockStatus}</span>
      ))}
    </div>
  );
}
