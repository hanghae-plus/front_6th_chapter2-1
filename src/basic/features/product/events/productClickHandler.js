/**
 * Product specific click event handlers
 */

export const handleAddToCartClick = (event, { onAddToCart }) => {
  event.preventDefault();

  if (!onAddToCart) return;

  onAddToCart();
};
