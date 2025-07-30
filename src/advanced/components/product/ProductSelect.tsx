import { ReactElement } from 'react';

import AddButton from '@/advanced/components/product/AddButton';
import StockStatus from '@/advanced/components/product/StockStatus';
import { PRODUCT_LIST } from '@/advanced/data/product.data';

export default function ProductSelect(): ReactElement {
  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <select
        id="product-select"
        className="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"
      >
        {PRODUCT_LIST.map(product => (
          <option value={product.id}>{product.name}</option>
        ))}
      </select>
      <AddButton />
      <StockStatus />
    </div>
  );
}
