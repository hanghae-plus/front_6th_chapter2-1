import { ReactElement, useEffect } from 'react';

import AddButton from '@/advanced/components/product/AddButton';
import StockStatus from '@/advanced/components/product/StockStatus';
import { TOTAL_STOCK_WARNING_THRESHOLD } from '@/advanced/data/quantity.data';
import { useProductStore } from '@/advanced/store';
import { ProductStatus } from '@/advanced/types/product.type';
import { createProductText, getProductStatus } from '@/advanced/utils/product.util';
import { getTotalStock } from '@/advanced/utils/stock.util';

export default function ProductSelect(): ReactElement {
  const { products, selectedProductId, setSelectedProduct } = useProductStore();

  const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const product = products.find(product => product.id === e.target.value);

    if (product) {
      setSelectedProduct(product);
    }
  };

  const totalStock = getTotalStock(products);

  const lowStockStyle = totalStock < TOTAL_STOCK_WARNING_THRESHOLD ? 'border-orange-500' : '';

  useEffect(() => {
    if (!selectedProductId && products.length > 0) {
      setSelectedProduct(products[0]);
    }
  }, [products, selectedProductId]);

  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <select
        onChange={handleChangeSelect}
        id="product-select"
        className={`w-full p-3 border border-gray-300 rounded-lg text-base mb-3 ${lowStockStyle}`}
        value={selectedProductId || ''}
      >
        {products.map(product => (
          <option
            key={product.id}
            value={product.id}
            disabled={getProductStatus(product) === ProductStatus.OUT_OF_STOCK}
          >
            {createProductText(product)}
          </option>
        ))}
      </select>

      <AddButton />
      <StockStatus />
    </div>
  );
}
