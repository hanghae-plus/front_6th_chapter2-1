export const renderQuantity = (productId, newQty) => {
  const itemElem = document.getElementById(productId);
  if (!itemElem) return;

  const qtyElem = itemElem.querySelector(".quantity-number");
  if (qtyElem) qtyElem.textContent = newQty;
};
