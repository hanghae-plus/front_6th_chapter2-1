/**
 * Cart specific click event handlers
 */

export const handleCartClick = (
  event,
  { cartUtils, productUtils, onCalculate, onUpdateOptions }
) => {
  const target = event.target;

  if (
    !target.classList.contains("quantity-change") &&
    !target.classList.contains("remove-item")
  ) {
    return;
  }

  const productId = target.dataset.productId;
  if (!productId) return;

  const itemElement = document.getElementById(productId);
  const product = productUtils.findById(productId);

  if (!product || !itemElement) return;

  if (target.classList.contains("quantity-change")) {
    const quantityChange = parseInt(target.dataset.change);
    cartUtils.changeItemQuantity(product, itemElement, quantityChange);
  } else if (target.classList.contains("remove-item")) {
    cartUtils.removeItem(product, itemElement);
  }

  onCalculate();
  onUpdateOptions();
};
