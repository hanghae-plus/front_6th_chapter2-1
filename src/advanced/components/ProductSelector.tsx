import type { Product } from '@advanced/feature/product/type';
import { getProductOptionStyle, getSalesInfoText, isOutOfStock } from '@basic/features/product/service';
import type { ChangeEvent } from 'react';

interface Props {
  products: Product[];
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const ProductSelector = ({ products, onChange, value }: Props) => {
  return (
    <select
      className="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"
      id="product-select"
      value={value}
      onChange={onChange}
    >
      {products.map((product) => (
        <option
          key={product.id}
          className={getProductOptionStyle(product)}
          value={product.id}
          disabled={isOutOfStock(product)}
        >
          {getSalesInfoText(product)}
        </option>
      ))}
    </select>
  );
};

export default ProductSelector;
