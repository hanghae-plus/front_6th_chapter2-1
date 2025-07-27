import CartDisplay from "../components/CartDisplay.js";

export const renderCartItem = ({ product, quantity, containerElement }) => {
  const itemHTML = CartDisplay({ product, quantity });
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = itemHTML;
  const itemElement = tempDiv.firstElementChild;

  containerElement.appendChild(itemElement);
  return itemElement;
};

export const addCartItem = ({ product, containerElement, onUpdate }) => {
  const existingItem = containerElement.querySelector(`#${product.id}`);

  if (existingItem) {
    const qtyElement = existingItem.querySelector(".quantity-number");
    const newQuantity = parseInt(qtyElement.textContent) + 1;
    qtyElement.textContent = newQuantity;
  } else {
    renderCartItem({ product, quantity: 1, containerElement });
  }

  product.q--;
  if (onUpdate) onUpdate();
};
