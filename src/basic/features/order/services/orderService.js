import { renderOrderSummaryDetails } from "../components/OrderSummaryDetails.js";

export const updateOrderSummary = (cartResults) => {
  const { subtotal, totalItemCount, itemDiscounts, isTuesday, totalAmount } =
    cartResults;

  // Prepare cart items data for Order Summary
  const cartItemsData = Array.from(
    document.getElementById("cart-items").children
  )
    .map((cartItemElement) => {
      let product = null;
      const products = window.productStore.getProducts();
      for (let j = 0; j < products.length; j++) {
        if (products[j].id === cartItemElement.id) {
          product = products[j];
          break;
        }
      }
      const qtyElem = cartItemElement.querySelector(".quantity-number");
      const quantity = qtyElem ? parseInt(qtyElem.textContent) : 0;
      return { product, quantity };
    })
    .filter((item) => item.product);

  // Render Order Summary Details
  renderOrderSummaryDetails({
    cartItems: cartItemsData,
    subtotal: subtotal,
    totalItemCount: totalItemCount,
    itemDiscounts: itemDiscounts,
    isTuesday: isTuesday,
    totalAmount: totalAmount,
  });
};
