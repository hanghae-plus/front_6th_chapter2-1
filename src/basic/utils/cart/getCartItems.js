export const getCartItems = (cartDisp) => {
  const cartItems = cartDisp.children;
  return Array.from(cartItems).map((cartItem) => {
    const qtyElem = cartItem.querySelector(".quantity-number");
    const quantity = parseInt(qtyElem.textContent);
    const productId = cartItem.id;
    return { productId, quantity, element: cartItem };
  });
};
