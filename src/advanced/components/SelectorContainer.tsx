import { useState } from 'react';
import { AddToCartButton } from './AddToCartButton';
import { ProductSelect } from './ProductSelect';
import { StockStatus } from './StockStatus';
import { useProducts } from '../stores/products';

export function SelectorContainer() {
  const products = useProducts((state) => state.products);
  const [productId, setProductId] = useState(products[0].id);

  const handleChangeProductId = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setProductId(event.target.value);
  };

  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <ProductSelect
        products={products}
        productId={productId}
        onChange={handleChangeProductId}
      />
      <AddToCartButton productId={productId} />
      <StockStatus />
    </div>
  );
}
