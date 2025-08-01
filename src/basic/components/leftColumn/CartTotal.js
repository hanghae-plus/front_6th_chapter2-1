export const CartTotal = ({ totalDiscountedPrice }) => {
  const sum = document.querySelector("#cart-total");
  let totalDiv = sum.querySelector(".text-2xl");
  if (totalDiv) {
    totalDiv.textContent =
      "₩" + Math.round(totalDiscountedPrice).toLocaleString();
  }
};
