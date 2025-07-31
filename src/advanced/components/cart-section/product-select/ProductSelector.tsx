import { ProductOption } from './ProductOption';
import { useCartState } from '../../../contexts/CartContext';
import { getProducts, Product } from '../../../reducer';

export const ProductSelector = () => {
  const state = useCartState();
  const products = getProducts(state);

  return (
    <select
      id='product-select'
      className='w-full p-3 border border-gray-300 rounded-lg text-base mb-3'
    >
      {products.map((product: Product) => (
        <ProductOption key={product.id} product={product} />
      ))}
    </select>
  );
};
