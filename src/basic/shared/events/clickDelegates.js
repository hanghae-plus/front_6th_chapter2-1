/**
 * Centralized event delegation handlers
 * Following React-like event handling patterns
 */

const handleCartClick = (
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

const handleAddToCartClick = (event, { onAddToCart }) => {
  event.preventDefault();

  if (!onAddToCart) return;

  onAddToCart();
};

const handleHelpModalClick = (event, { onToggle, onClose }) => {
  const target = event.target;

  if (
    !target.closest(".help-toggle") &&
    !target.closest(".help-close") &&
    !target.closest(".help-overlay")
  ) {
    return;
  }

  if (target.closest(".help-toggle")) {
    onToggle();
    return;
  }

  if (
    target.closest(".help-close") ||
    (target.closest(".help-overlay") &&
      event.target.classList.contains("help-overlay"))
  ) {
    onClose();
    return;
  }
};

export { handleCartClick, handleAddToCartClick, handleHelpModalClick };
