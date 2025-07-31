import { ProductOption } from './ProductOption';
import { useCartState, useCartDispatch } from '../../../contexts/CartContext';
import type { Product } from '../../../reducer';
import { getProducts, getSelectedId } from '../../../reducer';

export const ProductSelector = () => {
  const state = useCartState();
  const dispatch = useCartDispatch();
  const products = getProducts(state);
  const selectedProductId = getSelectedId(state);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSelectedId = event.target.value;
    if (dispatch) dispatch({ type: 'SET_SELECTED_PRODUCT', payload: { productId: newSelectedId } });
  };

  return (
    <select
      id='product-select'
      className='w-full p-3 border border-gray-300 rounded-lg text-base mb-3'
      value={selectedProductId}
      onChange={handleSelectChange}
    >
      {products.map((product: Product) => (
        <ProductOption key={product.id} product={product} />
      ))}
    </select>
  );
};
