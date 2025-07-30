import { CartItem } from '../components/cart/cart-tem';
import { handleCalculateCartStuff } from '../main.basic';
import { getSelectedProductId } from '../model/product-select';
import {
  findProduct,
  isSoldOut,
  ProductsData,
  updateProductQuantity,
} from '../model/products';
import { CART_ITEMS_ID, selectById } from '../utils/selector';

export function handleAddItemToCart() {
  const selectedProductId = getSelectedProductId();
  const product = findProduct(selectedProductId);
  const productData = ProductsData.find(
    (product) => product.id === selectedProductId
  );

  if (!product || !productData) {
    throw new Error('product is not found');
  }

  if (isSoldOut(product)) {
    return;
  }

  const cartItem = document.getElementById(product['id']);

  if (!cartItem) {
    updateProductQuantity({ id: product.id, quantity: -1 });
    const cartDisp = selectById(CART_ITEMS_ID);
    if (!cartDisp) {
      throw new Error('cartDisp not found');
    }
    cartDisp.innerHTML += CartItem({ id: product.id });
    handleCalculateCartStuff();
    return;
  }

  const quantitySpan = cartItem.querySelector('.quantity-number');

  if (!(quantitySpan instanceof HTMLSpanElement)) {
    throw new Error('quantitySpan is not found');
  }

  const currentQuantity = +(quantitySpan.textContent ?? '');
  const nextQuantity = currentQuantity + 1;

  if (nextQuantity <= productData.quantity) {
    quantitySpan.textContent = nextQuantity.toString();
    updateProductQuantity({ id: product.id, quantity: -1 });
  } else {
    alert('재고가 부족합니다.');
  }

  handleCalculateCartStuff();
}
