export const CartItemBox = ({ onClick }) => {
  const cartItemBox = document.createElement("div");
  cartItemBox.id = "cart-items";

  cartItemBox.addEventListener("click", onClick);
  return cartItemBox;
};
