import type { ComponentPropsWithoutRef } from 'react';
import type { Product } from '../type';
import ProductOption from './ProductOption';

interface ProductSelectorProps extends ComponentPropsWithoutRef<'select'> {
  productOptions: Product[];
}

export const ProductSelector = ({ productOptions, ...props }: ProductSelectorProps) => {
  return (
    <select className="w-full p-3 border border-gray-300 rounded-lg text-base mb-3" {...props}>
      {productOptions.map((product) => (
        <ProductOption key={product.name} product={product} value={product.id} />
      ))}
    </select>
  );
};

export default ProductSelector;
