import { ReactElement, useEffect } from 'react';

import AddButton from '@/advanced/components/product/AddButton';
import StockStatus from '@/advanced/components/product/StockStatus';
import { useProductStore } from '@/advanced/store';
import { ProductStatus } from '@/advanced/types/product.type';
import { createProductText, getProductStatus } from '@/advanced/utils/product.util';

export default function ProductSelect(): ReactElement {
  const { products, selectedProduct, setSelectedProduct } = useProductStore();

  const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const product = products.find(product => product.id === e.target.value);

    if (product) {
      setSelectedProduct(product);
    }
  };

  useEffect(() => {
    if (!selectedProduct && products.length > 0) {
      setSelectedProduct(products[0]);
    }
  }, [products, selectedProduct]);

  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <select
        onChange={handleChangeSelect}
        id="product-select"
        className="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"
        value={selectedProduct?.id || ''}
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
