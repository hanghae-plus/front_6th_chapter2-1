import { ProductOption } from './ProductOption';
import type { Product } from '../../../types';

type ProductSelectorProps = {
  products: Product[];
  selectedId: string;
  onSelectChange: React.ChangeEventHandler<HTMLSelectElement>;
};

export const ProductSelector = ({ products, selectedId, onSelectChange }: ProductSelectorProps) => (
  <select
    id='product-select'
    className='w-full p-3 border border-gray-300 rounded-lg text-base mb-3'
    value={selectedId}
    onChange={onSelectChange}
  >
    {products.map((product: Product) => (
      <ProductOption key={product.id} product={product} />
    ))}
  </select>
);
