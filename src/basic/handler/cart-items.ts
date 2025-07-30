import { handleCalculateCartStuff, onUpdateSelectOptions } from '../main.basic';
import { addCartQuantity, removeCart } from '../model/cart';
import { findProduct, ProductsData } from '../model/products';

export function handleClickCartItems(e: MouseEvent) {
  handleQuantityChange(e);
  handleRemoveCartItem(e);
}

function handleQuantityChange(e: MouseEvent) {
  const { target } = e;

  if (!(target instanceof HTMLElement)) {
    return;
  }

  const quantityChangeButton = target.classList.contains('quantity-change');
  if (quantityChangeButton) {
    const { productId, change } = target.dataset;

    if (!productId || !change) {
      throw new Error('productId or change is not found');
    }

    const cartDiv = document.getElementById(productId);

    if (!cartDiv) {
      throw new Error('cartDiv is not found');
    }

    const quantitySpan = cartDiv.querySelector('.quantity-number');

    if (!(quantitySpan instanceof HTMLSpanElement)) {
      throw new Error('quantitySpan is not found');
    }

    const currentQuantity = +(quantitySpan.textContent ?? '');
    const changeQuantity = +change;
    const product = findProduct(productId);

    if (product.quantity < changeQuantity) {
      alert('재고가 부족합니다.');
      return;
    }

    const newQuantity = currentQuantity + changeQuantity;

    if (newQuantity <= 0) {
      cartDiv.remove();
    } else {
      quantitySpan.textContent = newQuantity.toString();
      addCartQuantity({ id: productId, quantity: +change });
    }

    handleCalculateCartStuff();
    onUpdateSelectOptions();
  }
}

function handleRemoveCartItem(e: MouseEvent) {
  const { target } = e;

  if (!(target instanceof HTMLElement)) {
    return;
  }

  const removeItem = target.classList.contains('remove-item');

  if (removeItem) {
    const { productId } = target.dataset;

    if (!productId) {
      throw new Error('productId is not found');
    }

    const cartDiv = document.getElementById(productId);

    if (!cartDiv) {
      throw new Error('cartDiv is not found');
    }

    const quantitySpan = cartDiv.querySelector('.quantity-number');

    if (!(quantitySpan instanceof HTMLSpanElement)) {
      throw new Error('quantitySpan is not found');
    }

    const productData = ProductsData.find(
      (product) => product.id === productId
    );

    if (!productData) {
      throw new Error('productData is not found');
    }

    removeCart(productId);
    cartDiv.remove();
    handleCalculateCartStuff();
    onUpdateSelectOptions();
  }
}
