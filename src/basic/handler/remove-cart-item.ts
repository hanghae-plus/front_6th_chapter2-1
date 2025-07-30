import { handleCalculateCartStuff, onUpdateSelectOptions } from '../main.basic';
import { ProductsData, updateProductQuantity } from '../model/products';

export function handleRemoveCartItem(e: MouseEvent) {
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

    updateProductQuantity({ id: productId, quantity: productData.quantity });
    cartDiv.remove();
    handleCalculateCartStuff();
    onUpdateSelectOptions();
  }
}
