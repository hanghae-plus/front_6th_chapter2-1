import { getProducts } from '../../model/products';
import { PRODUCT_SELECT_ID } from '../../utils/selector';
import { ProductSelectOption } from './product-select-option';

export const ProductSelect = () => {
  const product = getProducts();

  const productSelect = document.createElement('select');
  productSelect.id = PRODUCT_SELECT_ID;
  productSelect.className =
    'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';

  product.forEach((product) => {
    productSelect.innerHTML += ProductSelectOption(product);
  });
  productSelect.value = product[0].id;

  return productSelect;
};
