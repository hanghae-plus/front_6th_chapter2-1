import { ReactElement } from 'react';

import AddButton from '@/advanced/components/product/AddButton';
import StockStatus from '@/advanced/components/product/StockStatus';
import { useProductStore } from '@/advanced/store/useProductStore';
import { ProductStatus } from '@/advanced/types/product.type';
import { createProductText, getProductStatus } from '@/advanced/utils/product.util';

export default function ProductSelect(): ReactElement {
  const { products } = useProductStore();

  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <select
        id="product-select"
        className="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"
      >
        {products.map(product => (
          <option
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
