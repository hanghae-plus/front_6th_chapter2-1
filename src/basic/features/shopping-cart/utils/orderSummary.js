import OrderSummary from "../components/OrderSummary.js";

export const renderOrderSummary = ({
  cartItems,
  products,
  subtotal,
  totalItemCount,
  itemDiscounts,
  isTuesday,
  totalAmount,
  containerElement,
  bulkDiscountThreshold,
}) => {
  const summaryHTML = OrderSummary({
    cartItems,
    products,
    subtotal,
    totalItemCount,
    itemDiscounts,
    isTuesday,
    totalAmount,
    bulkDiscountThreshold,
  });

  containerElement.innerHTML = summaryHTML;
};
