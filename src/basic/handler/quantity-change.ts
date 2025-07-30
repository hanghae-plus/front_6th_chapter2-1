import { handleCalculateCartStuff, onUpdateSelectOptions } from '../main.basic';
import { ProductsData, updateProductQuantity } from '../model/products';

export function handleQuantityChange(e: MouseEvent) {
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
    const newQuantity = currentQuantity + +change;

    const productData = ProductsData.find(
      (product) => product.id === productId
    );

    if (!productData) {
      throw new Error('productData is not found');
    }

    if (newQuantity <= 0) {
      cartDiv.remove();
      handleCalculateCartStuff();
      onUpdateSelectOptions();
      return;
    }

    if (newQuantity <= productData.quantity) {
      quantitySpan.textContent = newQuantity.toString();
      updateProductQuantity({ id: productId, quantity: +change });
      handleCalculateCartStuff();
      onUpdateSelectOptions();
      return;
    }

    alert('재고가 부족합니다.');
  }
}
