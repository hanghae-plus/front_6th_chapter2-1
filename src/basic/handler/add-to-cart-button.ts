import { CartItem } from '../components/cart/cart-tem';
import { handleCalculateCartStuff } from '../main.basic';
import { addToCart } from '../model/cart';
import { getSelectedProductId } from '../model/product-select';
import { findProduct, isSoldOut } from '../model/products';
import { CART_ITEMS_ID, selectById } from '../utils/selector';

export function handleAddItemToCart() {
  const selectedProductId = getSelectedProductId();
  const product = findProduct(selectedProductId);

  if (isSoldOut(product)) {
    return;
  }

  const cartItem = document.getElementById(product['id']);

  if (!cartItem) {
    addToCart(product.id);
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
  const changeQuantity = 1;

  if (product.quantity < changeQuantity) {
    alert('재고가 부족합니다.');
    return;
  }

  const nextQuantity = currentQuantity + changeQuantity;
  quantitySpan.textContent = nextQuantity.toString();
  addToCart(product.id);
  handleCalculateCartStuff();
}
