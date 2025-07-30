import { handleCalculateCartStuff, updateProductSelect } from '../main.basic';
import { addToCart } from '../model/cart';
import { getSelectedProductId } from '../model/product-select';
import { findProduct, isSoldOut } from '../model/products';
import { renderAddCartItem, renderUpdateCartQuantity } from '../render/cart';

export function handleAddItemToCart() {
  const selectedProductId = getSelectedProductId();
  const product = findProduct(selectedProductId);
  const cartItem = document.getElementById(product.id);
  const changeQuantity = 1;

  if (isSoldOut(product)) {
    return;
  }

  if (product.quantity < changeQuantity) {
    alert('재고가 부족합니다.');
    return;
  }

  if (cartItem) {
    addToCart({ id: product.id, quantity: changeQuantity });
    const nextQuantity = getNextQuantity({ cartItem, changeQuantity });
    renderUpdateCartQuantity(product.id, nextQuantity);
    handleCalculateCartStuff();
    updateProductSelect();
    return;
  }

  addToCart({ id: product.id, quantity: changeQuantity });
  renderAddCartItem(product.id);
  handleCalculateCartStuff();
  updateProductSelect();
}

function getNextQuantity({
  cartItem,
  changeQuantity,
}: {
  cartItem: HTMLElement;
  changeQuantity: number;
}) {
  const quantitySpan = cartItem.querySelector('.quantity-number');

  if (!(quantitySpan instanceof HTMLSpanElement)) {
    throw new Error('quantitySpan is not found');
  }

  const currentQuantity = +(quantitySpan.textContent ?? '');
  return currentQuantity + changeQuantity;
}
